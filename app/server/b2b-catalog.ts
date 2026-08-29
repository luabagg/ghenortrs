// GET /api/b2b-catalog?q=&limit=
// Approved sellers only. Reads cached Bling products.

import { listActiveCatalogProducts } from './db/queries';
import { getServerEnv } from './env';
import { json, methodNotAllowed } from './http';
import { requireApprovedSeller } from './supabase';

function toPublicProduct(
  row: Awaited<ReturnType<typeof listActiveCatalogProducts>>[number],
) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    priceCents: row.priceCents,
    stock: row.stock,
    unit: row.unit,
    minQuantity: row.minQuantity,
    category: row.category,
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET']);

  const auth = await requireApprovedSeller(req);
  if (auth instanceof Response) return auth;

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limitRaw = Number(url.searchParams.get('limit') ?? '48');
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100
      ? Math.floor(limitRaw)
      : 48;

  try {
    const env = getServerEnv();
    const products = (await listActiveCatalogProducts(q, limit)).map(
      toPublicProduct,
    );

    return json({
      source: 'bling_cache',
      defaultMinQuantity: env.defaultMinQuantity,
      count: products.length,
      products,
      seller: {
        companyName: auth.seller.companyName,
        email: auth.seller.email,
      },
    });
  } catch (error) {
    console.error('b2b-catalog failed', error);
    return json({ error: 'catalog_failed' }, 500);
  }
}
