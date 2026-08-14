// Typed mirror of `supabase/migrations/`.
// SQL migrations remain the schema source of truth. Do not drizzle-kit push/generate.

import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import type { Json } from '../database.types';

const timestamptz = (name: string) =>
  timestamp(name, { withTimezone: true, mode: 'string' });

export const sellerStatus = pgEnum('seller_status', [
  'pending',
  'approved',
  'rejected',
  'suspended',
]);

export const sellers = pgTable(
  'sellers',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    company_name: text('company_name').notNull(),
    cnpj: text('cnpj').notNull(),
    phone: text('phone').notNull(),
    message: text('message').notNull().default(''),
    status: sellerStatus('status').notNull().default('pending'),
    approved_at: timestamptz('approved_at'),
    approved_by: text('approved_by'),
    rejected_reason: text('rejected_reason'),
    created_at: timestamptz('created_at').notNull().defaultNow(),
    updated_at: timestamptz('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('sellers_email_unique').on(table.email),
    index('sellers_status_idx').on(table.status),
    index('sellers_email_idx').on(table.email),
  ],
);

export const blingOauthTokens = pgTable('bling_oauth_tokens', {
  id: integer('id').primaryKey().default(1),
  access_token: text('access_token').notNull(),
  refresh_token: text('refresh_token').notNull(),
  token_type: text('token_type').notNull().default('Bearer'),
  expires_at: timestamptz('expires_at').notNull(),
  scope: text('scope'),
  raw: jsonb('raw')
    .$type<Json>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  updated_at: timestamptz('updated_at').notNull().defaultNow(),
});

export const blingProducts = pgTable(
  'bling_products',
  {
    id: bigint('id', { mode: 'number' }).primaryKey(),
    sku: text('sku'),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    image_url: text('image_url'),
    price_cents: integer('price_cents'),
    stock: numeric('stock', { mode: 'number' }),
    unit: text('unit'),
    min_quantity: integer('min_quantity').notNull().default(1),
    active: boolean('active').notNull().default(true),
    category: text('category'),
    raw: jsonb('raw')
      .$type<Json>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    search_terms: text('search_terms').notNull().default(''),
    synced_at: timestamptz('synced_at').notNull().defaultNow(),
  },
  (table) => [index('bling_products_active_idx').on(table.active)],
);

export const quoteNotificationStatus = [
  'pending',
  'sent',
  'failed',
  'not_configured',
] as const;

export type QuoteNotificationStatus = (typeof quoteNotificationStatus)[number];

export const b2bQuoteRequests = pgTable(
  'b2b_quote_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    seller_id: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    request_key: uuid('request_key').notNull(),
    items: jsonb('items').$type<Json>().notNull(),
    notes: text('notes').notNull().default(''),
    status: text('status').notNull().default('submitted'),
    notification_status: text('notification_status')
      .$type<QuoteNotificationStatus>()
      .notNull()
      .default('pending'),
    notification_attempts: integer('notification_attempts')
      .notNull()
      .default(0),
    notified_at: timestamptz('notified_at'),
    created_at: timestamptz('created_at').notNull().defaultNow(),
  },
  (table) => [
    unique('b2b_quote_requests_seller_request_key_key').on(
      table.seller_id,
      table.request_key,
    ),
    index('b2b_quote_requests_seller_idx').on(table.seller_id),
  ],
);

export type SellerRow = typeof sellers.$inferSelect;
export type BlingProductRow = typeof blingProducts.$inferSelect;
export type BlingTokenRow = typeof blingOauthTokens.$inferSelect;
export type QuoteRequestRow = typeof b2bQuoteRequests.$inferSelect;
