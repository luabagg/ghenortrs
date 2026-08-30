import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';

import type { Json } from '../json';
import { type SellerTier, tierPriceColumn } from '../seller-tier';
import { getDb } from './client';
import {
  adminAuditEvents,
  adminUsers,
  b2bQuoteRequests,
  blingOauthTokens,
  blingProducts,
  emailActionTokens,
  sellers,
  type AdminAuditEventRow,
  type AdminUserRow,
  type BlingTokenRow,
  type EmailActionTokenRow,
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

export function catalogSelectColumns(tier: SellerTier) {
  const priceCol = blingProducts[tierPriceColumn(tier)];
  return {
    ...catalogProductColumns,
    priceCents: sql<number | null>`${priceCol}`.as('priceCents'),
  };
}

export function catalogVisibilityConditions(tier: SellerTier) {
  return [
    eq(blingProducts.active, true),
    eq(blingProducts.visibleB2b, true),
    isNotNull(blingProducts[tierPriceColumn(tier)]),
  ] as const;
}

export const ADMIN_PRODUCT_LIST_LIMIT = 200;

export type AdminProductRow = {
  id: number;
  sku: string | null;
  name: string;
  active: boolean;
  visibleB2b: boolean;
  category: string | null;
};

export const adminProductColumns = {
  id: blingProducts.id,
  sku: blingProducts.sku,
  name: blingProducts.name,
  active: blingProducts.active,
  visibleB2b: blingProducts.visibleB2b,
  category: blingProducts.category,
} as const;

export function buildAdminProductListSql(query: string, limit: number) {
  const safe = sanitizeCatalogQuery(query);
  const select = qb.select(adminProductColumns).from(blingProducts);
  const filtered = safe
    ? select.where(
        or(
          ilike(blingProducts.name, `%${safe}%`),
          ilike(blingProducts.sku, `%${safe}%`),
        ),
      )
    : select;
  return filtered.orderBy(blingProducts.name).limit(limit).toSQL();
}

export async function listAdminProducts(
  query: string,
  limit = ADMIN_PRODUCT_LIST_LIMIT,
): Promise<AdminProductRow[]> {
  const safe = sanitizeCatalogQuery(query);
  const select = getDb().select(adminProductColumns).from(blingProducts);
  const filtered = safe
    ? select.where(
        or(
          ilike(blingProducts.name, `%${safe}%`),
          ilike(blingProducts.sku, `%${safe}%`),
        ),
      )
    : select;
  return filtered.orderBy(blingProducts.name).limit(limit);
}

/** Sets an explicit visibility on exactly the given product IDs. */
export async function updateProductsVisibleB2b(
  ids: number[],
  visibleB2b: boolean,
): Promise<number> {
  if (ids.length === 0) return 0;
  const rows = await getDb()
    .update(blingProducts)
    .set({ visibleB2b })
    .where(inArray(blingProducts.id, ids))
    .returning({ id: blingProducts.id });
  return rows.length;
}

export type PriceImportProductRow = {
  id: number;
  sku: string;
  name: string;
  active: boolean;
  priceCents: number | null;
};

/** Cached products for the pasted SKUs, with the chosen tier price. */
export async function listProductsBySkus(
  tier: SellerTier,
  skus: string[],
): Promise<PriceImportProductRow[]> {
  if (skus.length === 0) return [];
  return getDb()
    .select({
      id: blingProducts.id,
      sku: sql<string>`${blingProducts.sku}`,
      name: blingProducts.name,
      active: blingProducts.active,
      priceCents: sql<number | null>`${blingProducts[tierPriceColumn(tier)]}`,
    })
    .from(blingProducts)
    .where(inArray(blingProducts.sku, skus));
}

/** Only the tier price column. Never touches visible_b2b, active, or Bling fields. */
function tierPriceUpdate(tier: SellerTier, priceCents: number) {
  switch (tier) {
    case 'start':
      return { priceStartCents: priceCents };
    case 'pro':
      return { priceProCents: priceCents };
    case 'max':
      return { priceMaxCents: priceCents };
  }
}

export async function updateTierPrices(
  tier: SellerTier,
  rows: { sku: string; priceCents: number }[],
): Promise<number> {
  if (rows.length === 0) return 0;

  const skusByPrice = new Map<number, string[]>();
  for (const row of rows) {
    const grouped = skusByPrice.get(row.priceCents);
    if (grouped) grouped.push(row.sku);
    else skusByPrice.set(row.priceCents, [row.sku]);
  }

  return getDb().transaction(async (tx) => {
    let updated = 0;
    for (const [priceCents, skus] of skusByPrice) {
      const changed = await tx
        .update(blingProducts)
        .set(tierPriceUpdate(tier, priceCents))
        .where(inArray(blingProducts.sku, skus))
        .returning({ sku: blingProducts.sku });
      updated += changed.length;
    }
    return updated;
  });
}

export function buildCatalogSearchSql(
  query: string,
  limit: number,
  tier: SellerTier,
) {
  const safe = sanitizeCatalogQuery(query);
  const pattern = `%${safe}%`;
  return qb
    .select(catalogSelectColumns(tier))
    .from(blingProducts)
    .where(
      and(
        ...catalogVisibilityConditions(tier),
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

export async function listSellers(): Promise<SellerRow[]> {
  return getDb().select().from(sellers).orderBy(desc(sellers.createdAt));
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

export async function isAdminUser(userId: string): Promise<boolean> {
  const [row] = await getDb()
    .select({ userId: adminUsers.userId })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return row !== undefined;
}

export async function countAdminUsers(): Promise<number> {
  const [row] = await getDb().select({ count: count() }).from(adminUsers);
  return Number(row?.count ?? 0);
}

export async function createAdminUser(input: {
  userId: string;
  email: string;
  createdBy?: string | null;
}): Promise<void> {
  await getDb().insert(adminUsers).values(input).onConflictDoNothing();
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  return getDb().select().from(adminUsers).orderBy(adminUsers.createdAt);
}

export async function deleteAdminUser(userId: string): Promise<boolean> {
  const [row] = await getDb()
    .delete(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .returning({ userId: adminUsers.userId });
  return row !== undefined;
}

export async function createEmailActionToken(input: {
  jtiHash: string;
  purpose: string;
  sellerId: string;
  expiresAt: string;
}): Promise<void> {
  await getDb().insert(emailActionTokens).values(input);
}

export async function consumeEmailActionToken(
  jtiHash: string,
  now: string,
): Promise<EmailActionTokenRow | null> {
  const [row] = await getDb()
    .update(emailActionTokens)
    .set({ consumedAt: now })
    .where(
      and(
        eq(emailActionTokens.jtiHash, jtiHash),
        isNull(emailActionTokens.consumedAt),
        gte(emailActionTokens.expiresAt, now),
      ),
    )
    .returning();
  return row ?? null;
}

const sensitiveAuditMetadataKey = /token|secret|code|link|authorization/i;

function containsSensitiveAuditMetadata(value: Json | undefined): boolean {
  if (value === undefined || value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(containsSensitiveAuditMetadata);
  }
  return Object.entries(value).some(
    ([key, nestedValue]) =>
      sensitiveAuditMetadataKey.test(key) ||
      containsSensitiveAuditMetadata(nestedValue),
  );
}

export async function insertAdminAuditEvent(input: {
  actorUserId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetSellerId?: string | null;
  targetProductId?: number | null;
  metadata?: Json;
  outcome?: string;
}): Promise<AdminAuditEventRow> {
  if (containsSensitiveAuditMetadata(input.metadata)) {
    throw new Error('sensitive audit metadata');
  }

  const [row] = await getDb()
    .insert(adminAuditEvents)
    .values({ ...input, metadata: input.metadata ?? {} })
    .returning();
  if (!row) throw new Error('admin_audit_event_save_failed');
  return row;
}

export async function listAdminAuditEvents(
  limit = 100,
): Promise<AdminAuditEventRow[]> {
  return getDb()
    .select()
    .from(adminAuditEvents)
    .orderBy(desc(adminAuditEvents.createdAt))
    .limit(limit);
}

export async function listActiveCatalogProducts(
  query: string,
  limit: number,
  tier: SellerTier,
): Promise<CatalogProductRow[]> {
  const conditions = [...catalogVisibilityConditions(tier)];
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
    .select(catalogSelectColumns(tier))
    .from(blingProducts)
    .where(and(...conditions))
    .orderBy(blingProducts.name)
    .limit(limit);
}

export async function listActiveProductsByIds(
  ids: number[],
  tier: SellerTier,
): Promise<CatalogProductRow[]> {
  if (ids.length === 0) return [];
  return getDb()
    .select(catalogSelectColumns(tier))
    .from(blingProducts)
    .where(
      and(inArray(blingProducts.id, ids), ...catalogVisibilityConditions(tier)),
    );
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

export type BlingTokenStatusRow = {
  expiresAt: string;
  updatedAt: string;
};

/** Connection metadata only. Never selects the token columns. */
export async function readBlingTokenStatus(): Promise<BlingTokenStatusRow | null> {
  const [row] = await getDb()
    .select({
      expiresAt: blingOauthTokens.expiresAt,
      updatedAt: blingOauthTokens.updatedAt,
    })
    .from(blingOauthTokens)
    .where(eq(blingOauthTokens.id, 1))
    .limit(1);
  return row ?? null;
}

export async function readStoredBlingTokens(): Promise<BlingTokenRow | null> {
  const [row] = await getDb()
    .select()
    .from(blingOauthTokens)
    .where(eq(blingOauthTokens.id, 1))
    .limit(1);
  return row ?? null;
}

/** Sync upsert SET. Must omit visible_b2b and price_*_cents. */
export const blingProductSyncConflictSet = {
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
};

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
  await getDb().insert(blingProducts).values(rows).onConflictDoUpdate({
    target: blingProducts.id,
    set: blingProductSyncConflictSet,
  });
}
