import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
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
  stock: numeric('stock', { mode: 'number' }),
  unit: text('unit'),
  minQuantity: integer('min_quantity').notNull().default(1),
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
export type BlingProductRow = typeof blingProducts.$inferSelect;
export type BlingTokenRow = typeof blingOauthTokens.$inferSelect;
export type QuoteRequestRow = typeof b2bQuoteRequests.$inferSelect;
