// GET /api/b2b-product-image/:id
// Serves the product photo the Bling sync copied into our own storage.
//
// Public on purpose. An <img> cannot send an Authorization header, and these
// are catalogue photos of components already listed on the public storefront,
// so gating them would cost the seller UI its images to protect nothing.

import { getProductImage, type ProductImageVariant } from './db/queries';
import { methodNotAllowed } from './http';

/** A year. The URL is stable per product and the bytes change only on sync. */
const CACHE_CONTROL = 'public, max-age=31536000, stale-while-revalidate=86400';

function parseProductId(raw: string | undefined): number | null {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** `?size=full` serves the expanded image; anything else the catalog one. */
function parseVariant(url: string): ProductImageVariant {
  try {
    return new URL(url).searchParams.get('size') === 'full'
      ? 'full'
      : 'catalog';
  } catch {
    return 'catalog';
  }
}

export default async function handler(
  req: Request,
  productIdParam: string | undefined,
): Promise<Response> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return methodNotAllowed(['GET', 'HEAD']);
  }

  const productId = parseProductId(productIdParam);
  if (productId === null) return new Response('Not Found', { status: 404 });

  const variant = parseVariant(req.url);
  const image = await getProductImage(productId, variant);
  if (!image) return new Response('Not Found', { status: 404 });

  // The source key is content addressed, so it doubles as a strong ETag. The
  // variant belongs in it too, or one size would be served from the other's
  // cache entry.
  const etag = `"${image.sourceKey.split('/').pop() ?? productId}-${variant}"`;
  if (req.headers.get('if-none-match') === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, 'Cache-Control': CACHE_CONTROL },
    });
  }

  // Buffer is a Uint8Array; the DOM Response type does not know that.
  const body: BodyInit | null =
    req.method === 'HEAD' ? null : new Uint8Array(image.bytes);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': image.contentType,
      'Content-Length': String(image.bytes.length),
      'Cache-Control': CACHE_CONTROL,
      ETag: etag,
    },
  });
}
