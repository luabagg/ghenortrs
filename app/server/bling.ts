import sharp from 'sharp';

import { htmlToPlainText } from './html-text';
import type { Json } from './json';
import {
  listStoredImageKeys,
  readStoredBlingTokens,
  saveBlingTokens as persistBlingTokens,
  upsertBlingProducts,
  upsertProductImage,
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
  active: boolean;
  category: string | null;
  search_terms: string;
  raw: Json;
};

export function normalizeBlingProduct(
  product: BlingProduct,
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

/**
 * Bling's S3 serves every photo as application/octet-stream, so the header
 * says nothing. Sniff the magic bytes instead. This also stops an HTML error
 * page from being stored and served as an image.
 */
function sniffImageType(bytes: Buffer): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (bytes.subarray(0, 8).equals(PNG_MAGIC)) return 'image/png';
  if (bytes.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  if (
    bytes.subarray(0, 4).toString('latin1') === 'RIFF' &&
    bytes.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp';
  }
  if (bytes.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = bytes.subarray(8, 12).toString('latin1');
    if (brand === 'avif' || brand === 'avis') return 'image/avif';
  }
  return null;
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const MAX_IMAGE_BYTES = 5_000_000;

/**
 * The content hash S3 uses as the object name, without the signature or the
 * expiry. The thumbnail and the full size share it, so the sync can decide to
 * skip from the cheap list response before spending a detail call.
 */
function imageSourceKey(url: string): string | null {
  try {
    const last = new URL(url).pathname.split('/').pop();
    return last && last.length > 0 ? last : null;
  } catch {
    return null;
  }
}

type BlingProductMedia = {
  midia?: {
    imagens?: {
      internas?: Array<{ link?: string | null; linkMiniatura?: string | null }>;
    };
  };
};

/**
 * The list endpoint only carries `imagemURL`, which is a 70px thumbnail. The
 * detail endpoint carries the original, so ask for it one product at a time.
 * Falls back to the thumbnail rather than leaving the row with no photo.
 */
async function fetchFullSizeImageUrl(
  productId: number,
  thumbnailUrl: string,
): Promise<string> {
  try {
    const res = await blingFetch<{ data: BlingProductMedia }>(
      `/produtos/${productId}`,
    );
    const first = res.data.midia?.imagens?.internas?.[0];
    return first?.link ?? first?.linkMiniatura ?? thumbnailUrl;
  } catch (error) {
    console.error('bling image detail failed', productId, error);
    return thumbnailUrl;
  }
}

/** Wide enough for the 80px row thumb and the drawer image on a 2x screen. */
const CATALOG_IMAGE_WIDTH = 400;

/** For the expanded viewer. Covers a phone at 2x and a desktop lightbox. */
const FULL_IMAGE_WIDTH = 1400;

/**
 * Bling originals run to 2160x2700 PNG, around 445 KB each. Serving that for
 * an 80px thumbnail is waste, so normalise once at sync time into the two
 * sizes the UI actually asks for.
 */
async function normaliseImage(bytes: Buffer, width: number): Promise<Buffer> {
  return sharp(bytes)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/**
 * Copies each product photo into our own storage. Bling hands out presigned
 * S3 links that expire within days, so the link is only usable right now, at
 * sync time. Storing the URL is what left the catalog full of 403s.
 */
export async function cacheBlingProductImages(
  products: Array<{ id: number; imageUrl: string | null }>,
): Promise<{ stored: number; skipped: number; failed: number }> {
  const stored = await listStoredImageKeys();
  let storedCount = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const key = product.imageUrl ? imageSourceKey(product.imageUrl) : null;
    if (!product.imageUrl || !key) {
      skipped += 1;
      continue;
    }
    if (stored.get(product.id) === key) {
      skipped += 1;
      continue;
    }

    try {
      const sourceUrl = await fetchFullSizeImageUrl(
        product.id,
        product.imageUrl,
      );
      const res = await fetch(sourceUrl);
      if (!res.ok) throw new Error(`image ${res.status}`);

      const downloaded = Buffer.from(await res.arrayBuffer());
      if (downloaded.length === 0 || downloaded.length > MAX_IMAGE_BYTES) {
        throw new Error(`unexpected size ${downloaded.length}`);
      }
      // Guard before sharp so an HTML error page gives a clear reason.
      if (!sniffImageType(downloaded)) {
        throw new Error('payload is not an image');
      }

      const [catalogBytes, fullBytes] = await Promise.all([
        normaliseImage(downloaded, CATALOG_IMAGE_WIDTH),
        normaliseImage(downloaded, FULL_IMAGE_WIDTH),
      ]);
      await upsertProductImage({
        productId: product.id,
        contentType: 'image/webp',
        bytes: catalogBytes,
        fullBytes,
        sourceKey: key,
      });
      storedCount += 1;
    } catch (error) {
      // One bad photo must not fail the whole product sync.
      console.error('bling image cache failed', product.id, error);
      failed += 1;
    }
  }

  return { stored: storedCount, skipped, failed };
}

export async function syncBlingProductsToCache(): Promise<{
  upserted: number;
  images: { stored: number; skipped: number; failed: number };
}> {
  const products = await listAllBlingProducts();
  const rows = products.map((product) => {
    const normalized = normalizeBlingProduct(product);
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
      active: normalized.active,
      category: normalized.category,
      searchTerms: normalized.search_terms,
      raw: normalized.raw,
      syncedAt: new Date().toISOString(),
    };
  });

  if (rows.length === 0) {
    return { upserted: 0, images: { stored: 0, skipped: 0, failed: 0 } };
  }

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await upsertBlingProducts(rows.slice(i, i + chunkSize));
  }

  // Products first: the image rows reference them.
  const images = await cacheBlingProductImages(rows);

  return { upserted: rows.length, images };
}
