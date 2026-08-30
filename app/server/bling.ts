import type { Json } from './json';
import {
  readStoredBlingTokens,
  saveBlingTokens as persistBlingTokens,
  upsertBlingProducts,
} from './db/queries';
import { getServerEnv } from './env';

export type BlingProduct = {
  id: number;
  nome: string;
  codigo?: string | null;
  preco?: number | null;
  precoCusto?: number | null;
  estoque?: { saldoVirtualTotal?: number | null } | null;
  imagemURL?: string | null;
  situacao?: string | null;
  formato?: string | null;
  tipo?: string | null;
  unidade?: string | null;
  descricaoCurta?: string | null;
  categoria?: { descricao?: string | null } | null;
};

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

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
};

/**
 * Bling stores the short description as seller-authored HTML. The catalog
 * shows it as text, so flatten it here instead of trusting markup later.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(
      /&(amp|lt|gt|quot|#39|nbsp);/g,
      (_match, entity: string) => HTML_ENTITIES[entity] ?? ' ',
    )
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

export async function saveBlingTokens(tokens: TokenResponse): Promise<void> {
  const expiresAt = new Date(
    Date.now() + tokens.expires_in * 1000,
  ).toISOString();
  await persistBlingTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type ?? 'Bearer',
    expiresAt,
    scope: tokens.scope ?? null,
    raw: tokens,
  });
}

export async function getValidAccessToken(): Promise<string> {
  const stored = await readStoredBlingTokens();
  if (!stored) {
    throw new Error('Bling not connected. Connect it at /admin/produtos.');
  }

  const expiresAt = new Date(stored.expiresAt).getTime();
  const skewMs = 60_000;
  if (Date.now() < expiresAt - skewMs) {
    return stored.accessToken;
  }

  const refreshed = await refreshAccessToken(stored.refreshToken);
  await saveBlingTokens(refreshed);
  return refreshed.access_token;
}

export async function blingFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const env = getServerEnv();
  const token = await getValidAccessToken();
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

export type NormalizedBlingProduct = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  image_url: string | null;
  price_cents: number | null;
  cost_cents: number | null;
  stock: number | null;
  unit: string | null;
  min_quantity: number;
  active: boolean;
  category: string | null;
  search_terms: string;
  raw: Json;
};

export function normalizeBlingProduct(
  product: BlingProduct,
  defaultMinQuantity: number,
): NormalizedBlingProduct {
  const toCents = (value: number | null | undefined): number | null =>
    typeof value === 'number' && Number.isFinite(value)
      ? Math.round(value * 100)
      : null;
  const price = toCents(product.preco);
  const stock =
    typeof product.estoque?.saldoVirtualTotal === 'number'
      ? product.estoque.saldoVirtualTotal
      : null;
  const active =
    !product.situacao ||
    product.situacao.toLowerCase() === 'a' ||
    product.situacao.toLowerCase() === 'ativo';

  const description = htmlToPlainText(product.descricaoCurta ?? '');
  const terms = [
    product.nome,
    product.codigo ?? '',
    product.categoria?.descricao ?? '',
    description,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: product.id,
    sku: product.codigo ?? null,
    name: product.nome,
    description,
    image_url: product.imagemURL ?? null,
    price_cents: price,
    cost_cents: toCents(product.precoCusto),
    stock,
    unit: product.unidade ?? null,
    min_quantity: defaultMinQuantity,
    active,
    category: product.categoria?.descricao ?? null,
    search_terms: terms,
    raw: product,
  };
}

export async function listAllBlingProducts(): Promise<BlingProduct[]> {
  const products: BlingProduct[] = [];
  let page = 1;
  const limit = 100;

  for (;;) {
    const payload = await blingFetch<{ data?: BlingProduct[] }>(
      `/produtos?pagina=${page}&limite=${limit}`,
    );
    const batch = payload.data ?? [];
    products.push(...batch);
    if (batch.length < limit) break;
    page += 1;
    if (page > 200) break;
  }
  return products;
}

export async function syncBlingProductsToCache(
  defaultMinQuantity: number,
): Promise<{ upserted: number }> {
  const products = await listAllBlingProducts();
  const rows = products.map((product) => {
    const normalized = normalizeBlingProduct(product, defaultMinQuantity);
    return {
      id: normalized.id,
      sku: normalized.sku,
      name: normalized.name,
      description: normalized.description,
      imageUrl: normalized.image_url,
      priceCents: normalized.price_cents,
      costCents: normalized.cost_cents,
      stock: normalized.stock,
      unit: normalized.unit,
      minQuantity: normalized.min_quantity,
      active: normalized.active,
      category: normalized.category,
      searchTerms: normalized.search_terms,
      raw: normalized.raw,
      syncedAt: new Date().toISOString(),
    };
  });

  if (rows.length === 0) return { upserted: 0 };

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await upsertBlingProducts(rows.slice(i, i + chunkSize));
  }

  return { upserted: rows.length };
}
