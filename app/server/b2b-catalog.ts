// GET /api/b2b-catalog?q=&limit=
// Approved sellers only. Reads cached Bling products.

import { and, eq, ilike, or } from 'drizzle-orm';

import { createDb } from './db/client';
import { blingProducts } from './db/schema';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import { requireApprovedSeller } from './supabase';

const CATALOG_COLUMNS = {
  id: blingProducts.id,
  sku: blingProducts.sku,
  name: blingProducts.name,
  description: blingProducts.description,
  image_url: blingProducts.image_url,
  price_cents: blingProducts.price_cents,
  stock: blingProducts.stock,
  unit: blingProducts.unit,
  min_quantity: blingProducts.min_quantity,
  category: blingProducts.category,
} as const;

type CatalogProductRow = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  image_url: string | null;
  price_cents: number | null;
  stock: number | null;
  unit: string | null;
  min_quantity: number;
  category: string | null;
};

function toPublicProduct(row: CatalogProductRow) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    priceCents: row.price_cents,
    stock: row.stock,
    unit: row.unit,
    minQuantity: row.min_quantity,
    category: row.category,
  };
}

export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'GET') return methodNotAllowed(['GET', 'OPTIONS']);

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
    const db = createDb();
    const active = eq(blingProducts.active, true);

    const search = q
      ? (() => {
          const safe = q.replace(/[%_,.()'"]/g, ' ').trim();
          const pattern = `%${safe}%`;
          return or(
            ilike(blingProducts.name, pattern),
            ilike(blingProducts.sku, pattern),
            ilike(blingProducts.search_terms, pattern),
            ilike(blingProducts.category, pattern),
          );
        })()
      : undefined;

    const rows = await db
      .select(CATALOG_COLUMNS)
      .from(blingProducts)
      .where(search ? and(active, search) : active)
      .orderBy(blingProducts.name)
      .limit(limit);

    const products = rows.map(toPublicProduct);

    return json({
      source: 'bling_cache',
      defaultMinQuantity: env.defaultMinQuantity,
      count: products.length,
      products,
      seller: {
        companyName: auth.seller.company_name,
        email: auth.seller.email,
      },
    });
  } catch (error) {
    console.error('b2b-catalog failed', error);
    return json({ error: 'catalog_failed' }, 500);
  }
}
