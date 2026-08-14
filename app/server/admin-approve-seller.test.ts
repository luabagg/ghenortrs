import { describe, expect, it, vi } from 'vitest';

import { createSellerApproveToken } from './action-token';
import {
  handleAdminApproveSeller,
  type AdminApproveDeps,
} from './admin-approve-seller';
import type { ServerEnv } from './env';
import type { SellerRow } from './supabase';

const SECRET = 'approve-test-secret';
const UPDATED_AT = '2026-03-20T12:00:00.000Z';
const UPDATED_AT_LATER = '2026-03-20T13:00:00.000Z';

function baseEnv(overrides: Partial<ServerEnv> = {}): ServerEnv {
  return {
    siteUrl: 'https://ghenortrs.vercel.app',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'anon',
    supabaseServiceRoleKey: 'service',
    databaseUrl: 'postgres://postgres:postgres@localhost:5432/postgres',
    resendApiKey: null,
    resendToEmail: null,
    resendFrom: 'test@example.com',
    blingClientId: null,
    blingClientSecret: null,
    blingRedirectUri: null,
    blingApiBase: 'https://api.bling.com.br/Api/v3',
    blingAuthBase: 'https://www.bling.com.br/Api/v3/oauth',
    adminApproveSecret: SECRET,
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
    status: 'pending',
    approved_at: null,
    approved_by: null,
    rejected_reason: null,
    created_at: UPDATED_AT,
    updated_at: UPDATED_AT,
    ...overrides,
  };
}

type FakeUpdate = {
  patch: Record<string, unknown>;
  filters: Array<{ col: string; val: string }>;
};

function createFakeService(options: {
  seller: SellerRow;
  /** Mutates seller.updated_at after successful update when provided. */
  afterUpdate?: (seller: SellerRow) => void;
}) {
  const updates: FakeUpdate[] = [];
  let current = { ...options.seller };

  const service = {
    from(table: string) {
      void table;
      return {
        update(patch: Record<string, unknown>) {
          const filters: Array<{ col: string; val: string }> = [];
          const builder = {
            eq(col: string, val: string) {
              filters.push({ col, val });
              return builder;
            },
            select(cols: string) {
              void cols;
              return {
                async single() {
                  updates.push({ patch, filters });
                  const idFilter = filters.find((f) => f.col === 'id');
                  if (idFilter && idFilter.val !== current.id) {
                    return { data: null, error: { message: 'not found' } };
                  }
                  const updatedAtFilter = filters.find(
                    (f) => f.col === 'updated_at',
                  );
                  if (
                    updatedAtFilter &&
                    updatedAtFilter.val !== current.updated_at
                  ) {
                    return {
                      data: null,
                      error: { message: 'updated_at mismatch' },
                    };
                  }
                  current = {
                    ...current,
                    ...(patch as Partial<SellerRow>),
                    updated_at: UPDATED_AT_LATER,
                  };
                  options.afterUpdate?.(current);
                  return { data: { ...current }, error: null };
                },
              };
            },
          };
          return builder;
        },
      };
    },
  };

  return {
    service: service as never,
    updates,
    getSeller: () => current,
  };
}

function makeDeps(input: {
  seller: SellerRow | null;
  fake?: ReturnType<typeof createFakeService>;
  sendApprovalEmail?: AdminApproveDeps['sendApprovalEmail'];
}): AdminApproveDeps {
  const fake =
    input.fake ??
    (input.seller
      ? createFakeService({ seller: input.seller })
      : createFakeService({ seller: sellerRow() }));

  return {
    getEnv: () => baseEnv(),
    createServiceClient: () => fake.service,
    getSellerByEmail: async () =>
      input.seller === null ? null : fake.getSeller(),
    sendApprovalEmail:
      input.sendApprovalEmail ??
      (async () => 'not_configured' as const),
    nowMs: () => Date.parse(UPDATED_AT),
  };
}

describe('admin-approve-seller signed token flow', () => {
  it('GET with token renders confirmation and does not mutate', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const { token } = await createSellerApproveToken(
      { email: seller.email, updatedAt: seller.updated_at },
      SECRET,
      { nowMs: Date.parse(UPDATED_AT) },
    );

    const res = await handleAdminApproveSeller(
      new Request(
        `https://ghenortrs.vercel.app/api/admin-approve-seller?token=${encodeURIComponent(token)}`,
        { method: 'GET' },
      ),
      makeDeps({ seller, fake }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const body = await res.text();
    expect(body).toContain('Confirmar aprovação');
    expect(body).toContain(seller.email);
    expect(body).not.toContain(SECRET);
    expect(fake.updates).toHaveLength(0);
    expect(fake.getSeller().status).toBe('pending');
  });

  it('POST form with token approves once', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const sendApprovalEmail = vi.fn(async () => 'sent' as const);
    const { token } = await createSellerApproveToken(
      { email: seller.email, updatedAt: seller.updated_at },
      SECRET,
      { nowMs: Date.parse(UPDATED_AT) },
    );

    const form = new URLSearchParams({ token });
    const res = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      }),
      makeDeps({ seller, fake, sendApprovalEmail }),
    );

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('Cadastro aprovado');
    expect(body).toContain('E-mail de acesso enviado');
    expect(fake.updates).toHaveLength(1);
    expect(fake.updates[0]?.patch).toMatchObject({ status: 'approved' });
    expect(fake.getSeller().status).toBe('approved');
    expect(sendApprovalEmail).toHaveBeenCalledOnce();
  });

  it('keeps approved status when approval email fails', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const sendApprovalEmail = vi.fn(async () => 'failed' as const);
    const { token } = await createSellerApproveToken(
      { email: seller.email, updatedAt: seller.updated_at },
      SECRET,
      { nowMs: Date.parse(UPDATED_AT) },
    );

    const form = new URLSearchParams({ token });
    const res = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      }),
      makeDeps({ seller, fake, sendApprovalEmail }),
    );

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('Cadastro aprovado');
    expect(body).toContain('e-mail de acesso falhou');
    expect(fake.getSeller().status).toBe('approved');
    expect(sendApprovalEmail).toHaveBeenCalledOnce();
  });

  it('returns notification failed when sendApprovalEmail throws after status update', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const sendApprovalEmail = vi.fn(async () => {
      throw new Error('resend network error');
    });

    const res = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': SECRET,
        },
        body: JSON.stringify({
          email: seller.email,
          status: 'approved',
        }),
      }),
      makeDeps({ seller, fake, sendApprovalEmail }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      success: true,
      status: 'approved',
      notification: 'failed',
    });
    expect(fake.getSeller().status).toBe('approved');
    expect(sendApprovalEmail).toHaveBeenCalledOnce();
  });

  it('reports not_configured approval email without rolling back status', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const sendApprovalEmail = vi.fn(async () => 'not_configured' as const);
    const res = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': SECRET,
        },
        body: JSON.stringify({
          email: seller.email,
          status: 'approved',
        }),
      }),
      makeDeps({ seller, fake, sendApprovalEmail }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      success: true,
      status: 'approved',
      notification: 'not_configured',
    });
    expect(fake.getSeller().status).toBe('approved');
  });

  it('rejects replay after seller.updated_at changes', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const { token } = await createSellerApproveToken(
      { email: seller.email, updatedAt: seller.updated_at },
      SECRET,
      { nowMs: Date.parse(UPDATED_AT) },
    );

    const deps = makeDeps({ seller, fake });
    const form = new URLSearchParams({ token });

    const first = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      }),
      deps,
    );
    expect(first.status).toBe(200);

    const second = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      }),
      deps,
    );
    expect(second.status).toBe(409);
    const body = await second.text();
    expect(body).toContain('Link já usado');
    expect(fake.updates).toHaveLength(1);
  });

  it('does not accept long-lived secret in query on GET', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const res = await handleAdminApproveSeller(
      new Request(
        `https://ghenortrs.vercel.app/api/admin-approve-seller?email=${encodeURIComponent(seller.email)}&secret=${encodeURIComponent(SECRET)}&status=approved`,
        { method: 'GET' },
      ),
      makeDeps({ seller, fake }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'token_required' });
    expect(fake.updates).toHaveLength(0);
  });

  it('keeps admin JSON POST with X-Admin-Secret', async () => {
    const seller = sellerRow();
    const fake = createFakeService({ seller });
    const res = await handleAdminApproveSeller(
      new Request('https://ghenortrs.vercel.app/api/admin-approve-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': SECRET,
        },
        body: JSON.stringify({
          email: seller.email,
          status: 'rejected',
          reason: 'docs',
        }),
      }),
      makeDeps({ seller, fake }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      success: true,
      status: 'rejected',
      notification: 'skipped',
    });
    expect(fake.updates[0]?.patch).toMatchObject({
      status: 'rejected',
      rejected_reason: 'docs',
    });
  });
});
