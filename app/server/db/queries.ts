import { and, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';

import type { Json } from '../json';
import { getDb } from './client';
import {
  b2bQuoteRequests,
  blingOauthTokens,
  blingProducts,
  sellers,
  type BlingProductRow,
  type BlingTokenRow,
  type SellerRow,
  type SellerStatus,
} from './schema';

const qb = new QueryBuilder();

export const catalogProductColumns = {
  id: blingProducts.id,
  sku: blingProducts.sku,
  name: blingProducts.name,
  description: blingProducts.description,
  imageUrl: blingProducts.imageUrl,
  priceCents: blingProducts.priceCents,
  stock: blingProducts.stock,
  unit: blingProducts.unit,
  minQuantity: blingProducts.minQuantity,
  category: blingProducts.category,
} as const;

export type CatalogProductRow = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  imageUrl: string | null;
  priceCents: number | null;
  stock: number | null;
  unit: string | null;
  minQuantity: number;
  category: string | null;
};

export function sanitizeCatalogQuery(raw: string): string {
  return raw.replace(/[%_,.()'"]/g, ' ').trim();
}

export function buildCatalogSearchSql(query: string, limit: number) {
  const safe = sanitizeCatalogQuery(query);
  const pattern = `%${safe}%`;
  return qb
    .select(catalogProductColumns)
    .from(blingProducts)
    .where(
      and(
        eq(blingProducts.active, true),
        or(
          ilike(blingProducts.name, pattern),
          ilike(blingProducts.sku, pattern),
          ilike(blingProducts.searchTerms, pattern),
          ilike(blingProducts.category, pattern),
        ),
      ),
    )
    .orderBy(blingProducts.name)
    .limit(limit)
    .toSQL();
}

export async function getSellerById(id: string): Promise<SellerRow | null> {
  const [row] = await getDb()
    .select()
    .from(sellers)
    .where(eq(sellers.id, id))
    .limit(1);
  return row ?? null;
}

export async function getSellerByEmail(
  email: string,
): Promise<SellerRow | null> {
  const [row] = await getDb()
    .select()
    .from(sellers)
    .where(eq(sellers.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export async function upsertSeller(payload: {
  id: string;
  email: string;
  companyName: string;
  cnpj: string;
  phone: string;
  message: string;
  status: SellerStatus;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedReason: string | null;
}): Promise<SellerRow> {
  const [row] = await getDb()
    .insert(sellers)
    .values(payload)
    .onConflictDoUpdate({
      target: sellers.id,
      set: {
        email: payload.email,
        companyName: payload.companyName,
        cnpj: payload.cnpj,
        phone: payload.phone,
        message: payload.message,
        status: payload.status,
        approvedAt: payload.approvedAt,
        approvedBy: payload.approvedBy,
        rejectedReason: payload.rejectedReason,
      },
    })
    .returning();
  if (!row) throw new Error('seller_save_failed');
  return row;
}

export async function updateSellerStatus(
  id: string,
  patch:
    | {
        status: 'approved';
        approvedAt: string;
        approvedBy: string;
        rejectedReason: null;
      }
    | {
        status: Exclude<SellerStatus, 'approved'>;
        approvedAt: null;
        approvedBy: null;
        rejectedReason: string | null;
      },
): Promise<SellerRow | null> {
  const [row] = await getDb()
    .update(sellers)
    .set(patch)
    .where(eq(sellers.id, id))
    .returning();
  return row ?? null;
}

export async function listActiveCatalogProducts(
  query: string,
  limit: number,
): Promise<CatalogProductRow[]> {
  const conditions = [eq(blingProducts.active, true)];
  const safe = sanitizeCatalogQuery(query);
  if (safe) {
    const pattern = `%${safe}%`;
    conditions.push(
      or(
        ilike(blingProducts.name, pattern),
        ilike(blingProducts.sku, pattern),
        ilike(blingProducts.searchTerms, pattern),
        ilike(blingProducts.category, pattern),
      )!,
    );
  }

  return getDb()
    .select(catalogProductColumns)
    .from(blingProducts)
    .where(and(...conditions))
    .orderBy(blingProducts.name)
    .limit(limit);
}

export async function listActiveProductsByIds(
  ids: number[],
): Promise<BlingProductRow[]> {
  if (ids.length === 0) return [];
  return getDb()
    .select()
    .from(blingProducts)
    .where(and(inArray(blingProducts.id, ids), eq(blingProducts.active, true)));
}

export async function insertQuoteRequest(input: {
  sellerId: string;
  items: Json;
  notes: string;
}): Promise<{ id: string; createdAt: string }> {
  const [row] = await getDb()
    .insert(b2bQuoteRequests)
    .values({
      sellerId: input.sellerId,
      items: input.items,
      notes: input.notes,
      status: 'submitted',
    })
    .returning({
      id: b2bQuoteRequests.id,
      createdAt: b2bQuoteRequests.createdAt,
    });
  if (!row) throw new Error('quote_save_failed');
  return row;
}

export async function saveBlingTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  scope: string | null;
  raw: Json;
}): Promise<void> {
  await getDb()
    .insert(blingOauthTokens)
    .values({
      id: 1,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: tokens.tokenType,
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
      raw: tokens.raw,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: blingOauthTokens.id,
      set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresAt: tokens.expiresAt,
        scope: tokens.scope,
        raw: tokens.raw,
        updatedAt: new Date().toISOString(),
      },
    });
}

export async function readStoredBlingTokens(): Promise<BlingTokenRow | null> {
  const [row] = await getDb()
    .select()
    .from(blingOauthTokens)
    .where(eq(blingOauthTokens.id, 1))
    .limit(1);
  return row ?? null;
}

export async function upsertBlingProducts(
  rows: Array<{
    id: number;
    sku: string | null;
    name: string;
    description: string;
    imageUrl: string | null;
    priceCents: number | null;
    stock: number | null;
    unit: string | null;
    minQuantity: number;
    active: boolean;
    category: string | null;
    searchTerms: string;
    raw: Json;
    syncedAt: string;
  }>,
): Promise<void> {
  if (rows.length === 0) return;
  await getDb()
    .insert(blingProducts)
    .values(rows)
    .onConflictDoUpdate({
      target: blingProducts.id,
      set: {
        sku: sql`excluded.sku`,
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        imageUrl: sql`excluded.image_url`,
        priceCents: sql`excluded.price_cents`,
        stock: sql`excluded.stock`,
        unit: sql`excluded.unit`,
        minQuantity: sql`excluded.min_quantity`,
        active: sql`excluded.active`,
        category: sql`excluded.category`,
        searchTerms: sql`excluded.search_terms`,
        raw: sql`excluded.raw`,
        syncedAt: sql`excluded.synced_at`,
      },
    });
}
