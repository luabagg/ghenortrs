import { describe, expect, it, vi } from 'vitest';

import type { ServerEnv } from './env';
import {
  handleB2BQuote,
  mapQuoteResult,
  quoteIdempotencyKey,
  type B2BQuoteDeps,
  type QuoteLineItem,
  type QuoteRequestRow,
} from './b2b-quote';
import type { SellerRow } from './supabase';

const REQUEST_KEY = '550e8400-e29b-41d4-a716-446655440000';
const CREATED_AT = '2026-08-09T12:00:00.000Z';

function baseEnv(overrides: Partial<ServerEnv> = {}): ServerEnv {
  return {
    siteUrl: 'https://ghenortrs.vercel.app',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'anon',
    supabaseServiceRoleKey: 'service',
    databaseUrl: 'postgres://postgres:postgres@localhost:5432/postgres',
    resendApiKey: 're_test',
    resendToEmail: 'ops@ghenortrs.com.br',
    resendFrom: 'test@example.com',
    blingClientId: null,
    blingClientSecret: null,
    blingRedirectUri: null,
    blingApiBase: 'https://api.bling.com.br/Api/v3',
    blingAuthBase: 'https://www.bling.com.br/Api/v3/oauth',
    adminApproveSecret: 'approve-secret',
    defaultMinQuantity: 6,
    ...overrides,
  };
}

function sellerRow(overrides: Partial<SellerRow> = {}): SellerRow {
  return {
    id: 'seller-1',
    email: 'loja@example.com',
    company_name: 'Loja Exemplo',
    cnpj: '12345678000199',
    phone: '11999999999',
    message: '',
    status: 'approved',
    approved_at: CREATED_AT,
    approved_by: 'admin',
    rejected_reason: null,
    created_at: CREATED_AT,
    updated_at: CREATED_AT,
    ...overrides,
  };
}

function lineItem(overrides: Partial<QuoteLineItem> = {}): QuoteLineItem {
  return {
    productId: 10,
    name: 'Pastilha Elite',
    sku: 'PE-1',
    quantity: 6,
    minQuantity: 6,
    unit: 'par',
    ...overrides,
  };
}

function quoteRow(
  overrides: Partial<QuoteRequestRow> = {},
): QuoteRequestRow {
  const items = overrides.items ?? [lineItem()];
  return {
    id: 'quote-1',
    seller_id: 'seller-1',
    request_key: REQUEST_KEY,
    items,
    notes: '',
    status: 'submitted',
    notification_status: 'pending',
    notification_attempts: 0,
    notified_at: null,
    created_at: CREATED_AT,
    ...overrides,
  };
}

type ProductRow = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  image_url: string | null;
  price_cents: number | null;
  stock: number | null;
  unit: string | null;
  min_quantity: number;
  active: boolean;
  category: string | null;
  search_terms: string;
  synced_at: string;
};

function productRow(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    id: 10,
    sku: 'PE-1',
    name: 'Pastilha Elite',
    description: '',
    image_url: null,
    price_cents: 1000,
    stock: 20,
    unit: 'par',
    min_quantity: 6,
    active: true,
    category: 'pastilhas',
    search_terms: 'pastilha elite',
    synced_at: CREATED_AT,
    ...overrides,
  };
}

function createFakeService(options: {
  products?: ProductRow[];
  existingQuotes?: QuoteRequestRow[];
}) {
  const products = options.products ?? [productRow()];
  const quotes = [...(options.existingQuotes ?? [])];
  const inserts: Array<Record<string, unknown>> = [];
  const updates: Array<{ id: string; patch: Record<string, unknown> }> = [];

  const service = {
    from(table: string) {
      if (table === 'bling_products') {
        return {
          select() {
            return {
              in(_col: string, ids: number[]) {
                void _col;
                return {
                  async eq(_col2: string, _val: unknown) {
                    void _col2;
                    void _val;
                    return {
                      data: products.filter((product) =>
                        ids.includes(product.id),
                      ),
                      error: null,
                    };
                  },
                };
              },
            };
          },
        };
      }

      if (table === 'b2b_quote_requests') {
        return {
          insert(patch: Record<string, unknown>) {
            return {
              select() {
                return {
                  async single() {
                    inserts.push(patch);
                    const requestKey = String(patch.request_key);
                    const sellerId = String(patch.seller_id);
                    const existing = quotes.find(
                      (row) =>
                        row.seller_id === sellerId &&
                        row.request_key === requestKey,
                    );
                    if (existing) {
                      return {
                        data: null,
                        error: {
                          code: '23505',
                          message:
                            'duplicate key value violates unique constraint "b2b_quote_requests_seller_request_key_key"',
                        },
                      };
                    }
                    const row = quoteRow({
                      id: `quote-${quotes.length + 1}`,
                      seller_id: sellerId,
                      request_key: requestKey,
                      items: patch.items as QuoteRequestRow['items'],
                      notes: String(patch.notes ?? ''),
                      notification_status: 'pending',
                      notification_attempts: 0,
                      notified_at: null,
                    });
                    quotes.push(row);
                    return { data: { ...row }, error: null };
                  },
                };
              },
            };
          },
          select() {
            const filters: Array<{ col: string; val: string }> = [];
            const builder = {
              eq(col: string, val: string) {
                filters.push({ col, val });
                return builder;
              },
              async maybeSingle() {
                const sellerId = filters.find(
                  (filter) => filter.col === 'seller_id',
                )?.val;
                const requestKey = filters.find(
                  (filter) => filter.col === 'request_key',
                )?.val;
                const row = quotes.find(
                  (quote) =>
                    quote.seller_id === sellerId &&
                    quote.request_key === requestKey,
                );
                return { data: row ? { ...row } : null, error: null };
              },
            };
            return builder;
          },
          update(patch: Record<string, unknown>) {
            const filters: Array<{ col: string; val: string }> = [];
            const builder = {
              eq(col: string, val: string) {
                filters.push({ col, val });
                return builder;
              },
              select() {
                return {
                  async single() {
                    const id = filters.find((filter) => filter.col === 'id')
                      ?.val;
                    const index = quotes.findIndex((quote) => quote.id === id);
                    if (index < 0) {
                      return {
                        data: null,
                        error: { message: 'not found' },
                      };
                    }
                    updates.push({ id: String(id), patch });
                    quotes[index] = {
                      ...quotes[index],
                      ...(patch as Partial<QuoteRequestRow>),
                    };
                    return { data: { ...quotes[index] }, error: null };
                  },
                };
              },
            };
            return builder;
          },
        };
      }

      throw new Error(`unexpected table ${table}`);
    },
  };

  return {
    service: service as never,
    inserts,
    updates,
    quotes,
  };
}

function quoteRequest(body: unknown) {
  return new Request('https://ghenortrs.vercel.app/api/b2b-quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    },
    body: JSON.stringify(body),
  });
}

describe('quote helpers', () => {
  it('builds a stable Resend idempotency key', () => {
    expect(quoteIdempotencyKey('seller-1', REQUEST_KEY)).toBe(
      `b2b-quote:seller-1:${REQUEST_KEY}`,
    );
  });

  it('maps sent notifications to HTTP 200 complete success', () => {
    expect(
      mapQuoteResult({
        row: quoteRow({ notification_status: 'sent' }),
      }),
    ).toMatchObject({
      httpStatus: 200,
      body: {
        success: true,
        persisted: true,
        complete: true,
        notification: 'sent',
      },
    });
  });

  it('maps failed notifications to HTTP 202 incomplete success', () => {
    expect(
      mapQuoteResult({
        row: quoteRow({ notification_status: 'failed' }),
      }),
    ).toMatchObject({
      httpStatus: 202,
      body: {
        success: true,
        persisted: true,
        complete: false,
        notification: 'failed',
      },
    });
  });
});

describe('handleB2BQuote', () => {
  it('rejects missing requestKey', async () => {
    const res = await handleB2BQuote(
      quoteRequest({ items: [{ productId: 10, quantity: 6 }] }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => createFakeService({}).service,
        requireApprovedSeller: async () => ({
          user: { id: 'user-1' } as never,
          seller: sellerRow(),
          accessToken: 'token',
        }),
        sendQuoteEmail: vi.fn(),
        nowMs: () => Date.parse(CREATED_AT),
      },
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'request_key_invalid' });
  });

  it('persists once for a duplicate request key and skips resend when already sent', async () => {
    const existing = quoteRow({
      notification_status: 'sent',
      notification_attempts: 1,
      notified_at: CREATED_AT,
    });
    const fake = createFakeService({ existingQuotes: [existing] });
    const sendQuoteEmail = vi.fn(async () => ({ ok: true as const }));
    const deps: B2BQuoteDeps = {
      getEnv: () => baseEnv(),
      createServiceClient: () => fake.service,
      requireApprovedSeller: async () => ({
        user: { id: 'user-1' } as never,
        seller: sellerRow(),
        accessToken: 'token',
      }),
      sendQuoteEmail,
      nowMs: () => Date.parse(CREATED_AT),
    };

    const res = await handleB2BQuote(
      quoteRequest({
        requestKey: REQUEST_KEY,
        items: [{ productId: 10, quantity: 6 }],
      }),
      deps,
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      success: true,
      persisted: true,
      complete: true,
      notification: 'sent',
      requestKey: REQUEST_KEY,
    });
    expect(fake.inserts).toHaveLength(1);
    expect(fake.quotes).toHaveLength(1);
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });

  it('retries delivery for a failed quote without creating a second row', async () => {
    const existing = quoteRow({
      notification_status: 'failed',
      notification_attempts: 1,
    });
    const fake = createFakeService({ existingQuotes: [existing] });
    const sendQuoteEmail = vi.fn(async () => ({ ok: true as const }));

    const res = await handleB2BQuote(
      quoteRequest({
        requestKey: REQUEST_KEY,
        notes: 'retry',
        items: [{ productId: 10, quantity: 6 }],
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => fake.service,
        requireApprovedSeller: async () => ({
          user: { id: 'user-1' } as never,
          seller: sellerRow(),
          accessToken: 'token',
        }),
        sendQuoteEmail,
        nowMs: () => Date.parse(CREATED_AT),
      },
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      complete: true,
      notification: 'sent',
    });
    expect(fake.quotes).toHaveLength(1);
    expect(sendQuoteEmail).toHaveBeenCalledOnce();
    expect(sendQuoteEmail.mock.calls[0]?.[0]).toMatchObject({
      idempotencyKey: quoteIdempotencyKey('seller-1', REQUEST_KEY),
      notes: '',
    });
    expect(fake.updates.at(-1)?.patch).toMatchObject({
      notification_status: 'sent',
      notification_attempts: 2,
    });
  });

  it('returns 202 when Resend is not configured after persistence', async () => {
    const fake = createFakeService({});
    const sendQuoteEmail = vi.fn(async () => ({ ok: true as const }));

    const res = await handleB2BQuote(
      quoteRequest({
        requestKey: REQUEST_KEY,
        items: [{ productId: 10, quantity: 6 }],
      }),
      {
        getEnv: () =>
          baseEnv({ resendApiKey: null, resendToEmail: null }),
        createServiceClient: () => fake.service,
        requireApprovedSeller: async () => ({
          user: { id: 'user-1' } as never,
          seller: sellerRow(),
          accessToken: 'token',
        }),
        sendQuoteEmail,
        nowMs: () => Date.parse(CREATED_AT),
      },
    );

    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({
      success: true,
      persisted: true,
      complete: false,
      notification: 'not_configured',
    });
    expect(sendQuoteEmail).not.toHaveBeenCalled();
    expect(fake.quotes[0]?.notification_status).toBe('not_configured');
  });

  it('maps thrown delivery to failed without HTTP 500 after persistence', async () => {
    const fake = createFakeService({});
    const sendQuoteEmail = vi.fn(async () => {
      throw new Error('network down');
    });

    const res = await handleB2BQuote(
      quoteRequest({
        requestKey: REQUEST_KEY,
        items: [{ productId: 10, quantity: 6 }],
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => fake.service,
        requireApprovedSeller: async () => ({
          user: { id: 'user-1' } as never,
          seller: sellerRow(),
          accessToken: 'token',
        }),
        sendQuoteEmail,
        nowMs: () => Date.parse(CREATED_AT),
      },
    );

    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({
      success: true,
      persisted: true,
      complete: false,
      notification: 'failed',
    });
    expect(fake.quotes).toHaveLength(1);
    expect(fake.quotes[0]?.notification_status).toBe('failed');
    expect(fake.quotes[0]?.notification_attempts).toBe(1);
  });

  it('maps soft Resend failure to failed incomplete success', async () => {
    const fake = createFakeService({});
    const sendQuoteEmail = vi.fn(async () => ({
      ok: false as const,
      reason: 'Email delivery failed',
    }));

    const res = await handleB2BQuote(
      quoteRequest({
        requestKey: REQUEST_KEY,
        items: [{ productId: 10, quantity: 6 }],
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => fake.service,
        requireApprovedSeller: async () => ({
          user: { id: 'user-1' } as never,
          seller: sellerRow(),
          accessToken: 'token',
        }),
        sendQuoteEmail,
        nowMs: () => Date.parse(CREATED_AT),
      },
    );

    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({
      notification: 'failed',
      complete: false,
    });
  });
});
