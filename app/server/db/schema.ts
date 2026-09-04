import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  customType,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import type { Json } from '../json';

/** Drizzle has no bytea column, and postgres.js hands it back as a Buffer. */
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => 'bytea',
});

export const sellerStatusEnum = pgEnum('seller_status', [
  'pending',
  'approved',
  'rejected',
  'suspended',
]);

export const sellers = pgTable(
  'sellers',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull().unique(),
    companyName: text('company_name').notNull(),
    cnpj: text('cnpj').notNull(),
    phone: text('phone').notNull(),
    message: text('message').notNull().default(''),
    status: sellerStatusEnum('status').notNull().default('pending'),
    approvedAt: timestamp('approved_at', {
      withTimezone: true,
      mode: 'string',
    }),
    approvedBy: text('approved_by'),
    rejectedReason: text('rejected_reason'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [check('sellers_cnpj_digits', sql`${table.cnpj} ~ '^\\d{14}$'`)],
);

export const adminUsers = pgTable('admin_users', {
  userId: uuid('user_id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  createdBy: uuid('created_by'),
});

export const emailActionTokens = pgTable('email_action_tokens', {
  jtiHash: text('jti_hash').primaryKey(),
  purpose: text('purpose').notNull(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => sellers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true, mode: 'string' }),
});

export const adminAuditEvents = pgTable('admin_audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id'),
  actorEmail: text('actor_email'),
  action: text('action').notNull(),
  targetSellerId: uuid('target_seller_id').references(() => sellers.id, {
    onDelete: 'set null',
  }),
  targetProductId: bigint('target_product_id', { mode: 'number' }).references(
    () => blingProducts.id,
    { onDelete: 'set null' },
  ),
  metadata: jsonb('metadata').$type<Json>().notNull().default({}),
  outcome: text('outcome').notNull().default('success'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const blingOauthTokens = pgTable(
  'bling_oauth_tokens',
  {
    id: integer('id').primaryKey().default(1),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    tokenType: text('token_type').notNull().default('Bearer'),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    scope: text('scope'),
    raw: jsonb('raw').$type<Json>().notNull().default({}),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (table) => [check('bling_oauth_tokens_singleton', sql`${table.id} = 1`)],
);

export const blingProducts = pgTable('bling_products', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  sku: text('sku'),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  imageUrl: text('image_url'),
  priceCents: integer('price_cents'),
  costCents: integer('cost_cents'),
  stock: numeric('stock', { mode: 'number' }),
  unit: text('unit'),
  active: boolean('active').notNull().default(true),
  visibleB2b: boolean('visible_b2b').notNull().default(true),
  priceStartCents: integer('price_start_cents'),
  priceProCents: integer('price_pro_cents'),
  priceMaxCents: integer('price_max_cents'),
  category: text('category'),
  raw: jsonb('raw').$type<Json>().notNull().default({}),
  searchTerms: text('search_terms').notNull().default(''),
  syncedAt: timestamp('synced_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

/**
 * Bling serves product photos as presigned S3 links that expire in days, so a
 * cached URL turns into a 403. Keep the bytes instead. The store is small: one
 * thumbnail-sized image per product.
 */
export const blingProductImages = pgTable('bling_product_images', {
  productId: bigint('product_id', { mode: 'number' })
    .primaryKey()
    .references(() => blingProducts.id, { onDelete: 'cascade' }),
  contentType: text('content_type').notNull(),
  /** Catalog size. Small enough that a full page of rows stays cheap. */
  bytes: bytea('bytes').notNull(),
  /**
   * Expanded size, for the viewer in the product drawer. Nullable so a row
   * written before this column existed still serves its catalog image.
   */
  fullBytes: bytea('full_bytes'),
  /**
   * The S3 object key from the source URL, without the signature. Bling keys
   * are content addressed, so an unchanged key means unchanged bytes and the
   * sync can skip the download.
   */
  sourceKey: text('source_key').notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

export const b2bQuoteRequests = pgTable('b2b_quote_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => sellers.id, { onDelete: 'cascade' }),
  items: jsonb('items').$type<Json>().notNull(),
  notes: text('notes').notNull().default(''),
  status: text('status').notNull().default('submitted'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
});

export type SellerStatus = (typeof sellerStatusEnum.enumValues)[number];
export type SellerRow = typeof sellers.$inferSelect;
export type AdminUserRow = typeof adminUsers.$inferSelect;
export type EmailActionTokenRow = typeof emailActionTokens.$inferSelect;
export type AdminAuditEventRow = typeof adminAuditEvents.$inferSelect;
export type BlingProductRow = typeof blingProducts.$inferSelect;
export type BlingTokenRow = typeof blingOauthTokens.$inferSelect;
export type QuoteRequestRow = typeof b2bQuoteRequests.$inferSelect;
