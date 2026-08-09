import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database, Tables } from './database.types';
import {
  type BlingProduct,
  type NormalizedBlingProduct,
  normalizeBlingProduct,
} from './bling-normalize';
import { getServerEnv } from './env';

export type { BlingProduct, NormalizedBlingProduct };
export { normalizeBlingProduct };

export type BlingTokenRow = Tables<'bling_oauth_tokens'>;

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
};

function basicAuthHeader(clientId: string, clientSecret: string): string {
  const raw = `${clientId}:${clientSecret}`;
  if (typeof btoa === 'function') {
    return `Basic ${btoa(raw)}`;
  }
  // Node fallback
  return `Basic ${Buffer.from(raw, 'utf8').toString('base64')}`;
}

export function getBlingAuthorizeUrl(state: string): string {
  const env = getServerEnv();
  if (!env.blingClientId || !env.blingRedirectUri) {
    throw new Error('BLING_CLIENT_ID and BLING_REDIRECT_URI are required');
  }
  const url = new URL(`${env.blingAuthBase}/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', env.blingClientId);
  url.searchParams.set('state', state);
  url.searchParams.set('redirect_uri', env.blingRedirectUri);
  return url.toString();
}

async function exchangeToken(body: URLSearchParams): Promise<TokenResponse> {
  const env = getServerEnv();
  if (!env.blingClientId || !env.blingClientSecret) {
    throw new Error('BLING_CLIENT_ID and BLING_CLIENT_SECRET are required');
  }

  const res = await fetch(`${env.blingAuthBase}/token`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(env.blingClientId, env.blingClientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bling token exchange failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function exchangeAuthorizationCode(
  code: string,
): Promise<TokenResponse> {
  const env = getServerEnv();
  if (!env.blingRedirectUri) {
    throw new Error('BLING_REDIRECT_URI is required');
  }
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.blingRedirectUri,
  });
  return exchangeToken(body);
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  return exchangeToken(body);
}

export async function saveBlingTokens(
  service: SupabaseClient<Database>,
  tokens: TokenResponse,
): Promise<void> {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const { error } = await service.from('bling_oauth_tokens').upsert(
    {
      id: 1,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type ?? 'Bearer',
      expires_at: expiresAt,
      scope: tokens.scope ?? null,
      raw: tokens,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
  if (error) throw error;
}

async function readStoredTokens(
  service: SupabaseClient<Database>,
): Promise<BlingTokenRow | null> {
  const { data, error } = await service
    .from('bling_oauth_tokens')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getValidAccessToken(
  service: SupabaseClient<Database>,
): Promise<string> {
  const stored = await readStoredTokens(service);
  if (!stored) {
    throw new Error(
      'Bling OAuth not connected. POST /api/bling-oauth-start with X-Admin-Secret, then open the returned authorizeUrl.',
    );
  }

  const expiresAt = new Date(stored.expires_at).getTime();
  const skewMs = 60_000;
  if (Date.now() < expiresAt - skewMs) {
    return stored.access_token;
  }

  const refreshed = await refreshAccessToken(stored.refresh_token);
  await saveBlingTokens(service, refreshed);
  return refreshed.access_token;
}

export async function blingFetch<T>(
  service: SupabaseClient<Database>,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const env = getServerEnv();
  const token = await getValidAccessToken(service);
  const url = path.startsWith('http')
    ? path
    : `${env.blingApiBase}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bling API ${res.status} ${path}: ${text}`);
  }
  return (await res.json()) as T;
}

/** Safety cap on Bling list pages (100 items each). Partial snapshots are rejected. */
export const BLING_PRODUCT_PAGE_CAP = 200;

export async function listAllBlingProducts(
  service: SupabaseClient<Database>,
): Promise<BlingProduct[]> {
  const products: BlingProduct[] = [];
  let page = 1;
  const limit = 100;

  for (;;) {
    const payload = await blingFetch<{ data?: BlingProduct[] }>(
      service,
      `/produtos?pagina=${page}&limite=${limit}`,
    );
    const batch = payload.data ?? [];
    products.push(...batch);
    if (batch.length < limit) break;
    page += 1;
    if (page > BLING_PRODUCT_PAGE_CAP) {
      throw new Error(
        `Bling product list exceeded safety cap of ${BLING_PRODUCT_PAGE_CAP} pages; refusing partial snapshot`,
      );
    }
  }
  return products;
}

export async function syncBlingProductsToCache(
  service: SupabaseClient<Database>,
  defaultMinQuantity: number,
): Promise<{ upserted: number }> {
  const products = await listAllBlingProducts(service);
  const syncedAt = new Date().toISOString();
  const rows = products.map((product) => {
    const normalized = normalizeBlingProduct(product, defaultMinQuantity);
    return {
      ...normalized,
      synced_at: syncedAt,
    };
  });

  if (rows.length === 0) {
    throw new Error(
      'Bling product snapshot is empty; refusing to clear catalog cache',
    );
  }

  const { data, error } = await service.rpc('replace_bling_products_snapshot', {
    p_products: rows,
  });
  if (error) throw error;

  return { upserted: typeof data === 'number' ? data : rows.length };
}
