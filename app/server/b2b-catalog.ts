// GET /api/b2b-catalog?q=&limit=
// Approved sellers only. Reads cached Bling products.

import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import {
  createServiceClient,
  requireApprovedSeller,
  type BlingProductRow,
} from './supabase';

const CATALOG_SELECT =
  'id, sku, name, description, image_url, price_cents, stock, unit, min_quantity, active, category, search_terms, synced_at' as const;

type CatalogProductRow = Pick<
  BlingProductRow,
  | 'id'
  | 'sku'
  | 'name'
  | 'description'
  | 'image_url'
  | 'price_cents'
  | 'stock'
  | 'unit'
  | 'min_quantity'
  | 'category'
>;

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
    const service = createServiceClient();
    let query = service
      .from('bling_products')
      .select(CATALOG_SELECT)
      .eq('active', true)
      .order('name', { ascending: true })
      .limit(limit);

    if (q) {
      // Simple ilike across name/sku/terms. Enough for MVP.
      const safe = q.replace(/[%_,.()'"]/g, ' ').trim();
      const pattern = `%${safe}%`;
      query = query.or(
        `name.ilike."${pattern}",sku.ilike."${pattern}",search_terms.ilike."${pattern}",category.ilike."${pattern}"`,
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    const products = (data ?? []).map(toPublicProduct);

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
