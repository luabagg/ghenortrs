import { eq } from 'drizzle-orm';

import { createDb } from './client';
import { sellers, type SellerRow } from './schema';

export type { SellerRow };

export async function getSellerById(id: string): Promise<SellerRow | null> {
  const db = createDb();
  const [row] = await db
    .select()
    .from(sellers)
    .where(eq(sellers.id, id))
    .limit(1);
  return row ?? null;
}

export async function getSellerByEmail(
  email: string,
): Promise<SellerRow | null> {
  const db = createDb();
  const [row] = await db
    .select()
    .from(sellers)
    .where(eq(sellers.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}
