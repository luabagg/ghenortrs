// POST /api/b2b-quote
// Approved sellers send a quote request. No checkout. Enforces min qty.
// Persistence is idempotent on (seller_id, request_key). Delivery is tracked.

import { parseB2BQuoteRequest } from '../b2b/schemas';
import { getServerEnv, type ServerEnv } from './env';
import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import { buildQuoteRequestHtml, sendResendEmail } from './resend';
import {
  createServiceClient,
  requireApprovedSeller,
  type SellerRow,
} from './supabase';
import type { Database, Tables } from './database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type QuoteNotificationStatus =
  | 'pending'
  | 'sent'
  | 'failed'
  | 'not_configured';

export type QuoteLineItem = {
  productId: number;
  name: string;
  sku: string | null;
  quantity: number;
  minQuantity: number;
  unit: string | null;
};

export type QuoteRequestRow = Tables<'b2b_quote_requests'>;

export type QuoteSubmitResult = {
  httpStatus: number;
  body: {
    success: true;
    persisted: true;
    complete: boolean;
    id: string;
    requestKey: string;
    createdAt: string;
    itemCount: number;
    notification: QuoteNotificationStatus;
    message: string;
  };
};

export type B2BQuoteDeps = {
  getEnv: typeof getServerEnv;
  createServiceClient: typeof createServiceClient;
  requireApprovedSeller: typeof requireApprovedSeller;
  sendQuoteEmail: typeof sendQuoteDeliveryEmail;
  nowMs: () => number;
};

const defaultDeps: B2BQuoteDeps = {
  getEnv: getServerEnv,
  createServiceClient,
  requireApprovedSeller,
  sendQuoteEmail: sendQuoteDeliveryEmail,
  nowMs: () => Date.now(),
};

const QUOTE_SENT_MESSAGE =
  'Solicitação enviada. A equipe GHENO retorna com condições comerciais.';
const QUOTE_FAILED_MESSAGE =
  'Recebemos sua solicitação, mas o aviso à GHENO falhou. Tente enviar de novo; a seleção permanece.';
const QUOTE_NOT_CONFIGURED_MESSAGE =
  'Recebemos sua solicitação, mas o aviso automático não está configurado. Fale com a GHENO pelos canais de contato.';

function isUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === '23505') return true;
  const message = (error.message ?? '').toLowerCase();
  return (
    message.includes('duplicate key') ||
    message.includes('unique constraint') ||
    message.includes('b2b_quote_requests_seller_request_key')
  );
}

export function quoteIdempotencyKey(sellerId: string, requestKey: string): string {
  return `b2b-quote:${sellerId}:${requestKey}`;
}

export function mapQuoteNotificationMessage(
  notification: QuoteNotificationStatus,
): string {
  if (notification === 'sent') return QUOTE_SENT_MESSAGE;
  if (notification === 'not_configured') return QUOTE_NOT_CONFIGURED_MESSAGE;
  return QUOTE_FAILED_MESSAGE;
}

export function mapQuoteResult(input: {
  row: Pick<
    QuoteRequestRow,
    'id' | 'request_key' | 'created_at' | 'notification_status' | 'items'
  >;
  itemCount?: number;
}): QuoteSubmitResult {
  const notification = input.row.notification_status;
  const complete = notification === 'sent';
  const items = Array.isArray(input.row.items)
    ? input.row.items
    : [];
  const itemCount =
    input.itemCount ??
    (Array.isArray(items) ? items.length : 0);

  return {
    httpStatus: complete ? 200 : 202,
    body: {
      success: true,
      persisted: true,
      complete,
      id: input.row.id,
      requestKey: input.row.request_key,
      createdAt: input.row.created_at,
      itemCount,
      notification,
      message: mapQuoteNotificationMessage(notification),
    },
  };
}

async function sendQuoteDeliveryEmail(input: {
  toEmail: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
  items: QuoteLineItem[];
  idempotencyKey: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  return sendResendEmail({
    to: input.toEmail,
    subject: `[B2B orçamento] ${input.companyName}`,
    replyTo: input.email,
    idempotencyKey: input.idempotencyKey,
    html: buildQuoteRequestHtml({
      companyName: input.companyName,
      email: input.email,
      phone: input.phone,
      notes: input.notes,
      items: input.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
      })),
    }),
  });
}

async function loadQuoteByRequestKey(
  service: SupabaseClient<Database>,
  sellerId: string,
  requestKey: string,
): Promise<QuoteRequestRow | null> {
  const { data, error } = await service
    .from('b2b_quote_requests')
    .select(
      'id, seller_id, request_key, items, notes, status, notification_status, notification_attempts, notified_at, created_at',
    )
    .eq('seller_id', sellerId)
    .eq('request_key', requestKey)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function insertQuoteRequest(
  service: SupabaseClient<Database>,
  input: {
    sellerId: string;
    requestKey: string;
    items: QuoteLineItem[];
    notes: string;
  },
): Promise<
  | { kind: 'created'; row: QuoteRequestRow }
  | { kind: 'existing'; row: QuoteRequestRow }
> {
  const { data, error } = await service
    .from('b2b_quote_requests')
    .insert({
      seller_id: input.sellerId,
      request_key: input.requestKey,
      items: input.items,
      notes: input.notes,
      status: 'submitted',
      notification_status: 'pending',
      notification_attempts: 0,
      notified_at: null,
    })
    .select(
      'id, seller_id, request_key, items, notes, status, notification_status, notification_attempts, notified_at, created_at',
    )
    .single();

  if (!error && data) {
    return { kind: 'created', row: data };
  }

  if (isUniqueViolation(error)) {
    const existing = await loadQuoteByRequestKey(
      service,
      input.sellerId,
      input.requestKey,
    );
    if (existing) return { kind: 'existing', row: existing };
  }

  throw error ?? new Error('quote_insert_failed');
}

async function markQuoteNotification(
  service: SupabaseClient<Database>,
  input: {
    id: string;
    notificationStatus: QuoteNotificationStatus;
    notificationAttempts: number;
    notifiedAt: string | null;
  },
): Promise<QuoteRequestRow> {
  const { data, error } = await service
    .from('b2b_quote_requests')
    .update({
      notification_status: input.notificationStatus,
      notification_attempts: input.notificationAttempts,
      notified_at: input.notifiedAt,
    })
    .eq('id', input.id)
    .select(
      'id, seller_id, request_key, items, notes, status, notification_status, notification_attempts, notified_at, created_at',
    )
    .single();
  if (error || !data) throw error ?? new Error('quote_update_failed');
  return data;
}

async function deliverQuoteNotification(input: {
  service: SupabaseClient<Database>;
  env: ServerEnv;
  seller: SellerRow;
  row: QuoteRequestRow;
  lineItems: QuoteLineItem[];
  notes: string;
  deps: B2BQuoteDeps;
}): Promise<QuoteRequestRow> {
  const { service, env, seller, row, lineItems, notes, deps } = input;

  if (!env.resendApiKey || !env.resendToEmail) {
    return markQuoteNotification(service, {
      id: row.id,
      notificationStatus: 'not_configured',
      notificationAttempts: row.notification_attempts,
      notifiedAt: row.notified_at,
    });
  }

  const attempts = row.notification_attempts + 1;
  try {
    const sent = await deps.sendQuoteEmail({
      toEmail: env.resendToEmail,
      companyName: seller.company_name,
      email: seller.email,
      phone: seller.phone,
      notes,
      items: lineItems,
      idempotencyKey: quoteIdempotencyKey(seller.id, row.request_key),
    });

    if (sent.ok) {
      return markQuoteNotification(service, {
        id: row.id,
        notificationStatus: 'sent',
        notificationAttempts: attempts,
        notifiedAt: new Date(deps.nowMs()).toISOString(),
      });
    }

    return markQuoteNotification(service, {
      id: row.id,
      notificationStatus: 'failed',
      notificationAttempts: attempts,
      notifiedAt: row.notified_at,
    });
  } catch (error) {
    console.error('quote delivery threw', error);
    return markQuoteNotification(service, {
      id: row.id,
      notificationStatus: 'failed',
      notificationAttempts: attempts,
      notifiedAt: row.notified_at,
    });
  }
}

function lineItemsFromRow(row: QuoteRequestRow): QuoteLineItem[] {
  if (!Array.isArray(row.items)) return [];
  return row.items as QuoteLineItem[];
}

export async function handleB2BQuote(
  req: Request,
  deps: B2BQuoteDeps = defaultDeps,
): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return methodNotAllowed(['POST', 'OPTIONS']);

  const auth = await deps.requireApprovedSeller(req);
  if (auth instanceof Response) return auth;

  const body = await readJson<unknown>(req);
  const parsed = parseB2BQuoteRequest(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const { items: requested, notes, requestKey } = parsed;

  try {
    const env = deps.getEnv();
    const service = deps.createServiceClient();
    const ids = requested.map((item) => item.productId);
    const { data, error } = await service
      .from('bling_products')
      .select(
        'id, sku, name, description, image_url, price_cents, stock, unit, min_quantity, active, category, search_terms, synced_at',
      )
      .in('id', ids)
      .eq('active', true);
    if (error) throw error;

    const products = data ?? [];
    const byId = new Map(products.map((product) => [product.id, product]));
    const lineItems: QuoteLineItem[] = [];
    const violations: Array<{
      productId: number;
      name: string;
      quantity: number;
      minQuantity: number;
    }> = [];

    for (const item of requested) {
      const product = byId.get(item.productId);
      if (!product) {
        return json(
          { error: 'product_not_found', productId: item.productId },
          400,
        );
      }
      const minQuantity = product.min_quantity || env.defaultMinQuantity;
      if (item.quantity < minQuantity) {
        violations.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          minQuantity,
        });
        continue;
      }
      lineItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: Math.floor(item.quantity),
        minQuantity,
        unit: product.unit,
      });
    }

    if (violations.length > 0) {
      return json(
        {
          error: 'min_quantity_not_met',
          message:
            'Um ou mais itens estão abaixo da quantidade mínima B2B.',
          violations,
        },
        400,
      );
    }

    const inserted = await insertQuoteRequest(service, {
      sellerId: auth.seller.id,
      requestKey,
      items: lineItems,
      notes,
    });

    let row = inserted.row;

    if (row.notification_status === 'sent') {
      const mapped = mapQuoteResult({
        row,
        itemCount: lineItemsFromRow(row).length || lineItems.length,
      });
      return json(mapped.body, mapped.httpStatus);
    }

    row = await deliverQuoteNotification({
      service,
      env,
      seller: auth.seller,
      row,
      lineItems:
        inserted.kind === 'existing' ? lineItemsFromRow(row) : lineItems,
      notes: inserted.kind === 'existing' ? row.notes : notes,
      deps,
    });

    const mapped = mapQuoteResult({
      row,
      itemCount: lineItemsFromRow(row).length || lineItems.length,
    });
    return json(mapped.body, mapped.httpStatus);
  } catch (error) {
    console.error('b2b-quote failed', error);
    return json({ error: 'quote_failed' }, 500);
  }
}

export default async function handler(req: Request): Promise<Response> {
  return handleB2BQuote(req);
}
