import { describe, expect, it, vi } from 'vitest';

import type { B2BRegisterRequestData } from '../b2b/schemas';
import type { ServerEnv } from './env';
import {
  findAuthUserIdByEmail,
  mapRegisterResultToApi,
  mapRegisterResultToRemix,
  registerSellerApplication,
  type B2BRegisterDeps,
  type RegisterSellerResult,
} from './b2b-register-service';
import type { SellerRow } from './supabase';

const UPDATED_AT = '2026-03-20T12:00:00.000Z';

const registrationData: B2BRegisterRequestData = {
  empresa: 'Loja Exemplo',
  cnpj: '12345678000199',
  telefone: '11999999999',
  email: 'loja@example.com',
  mensagem: 'Preciso de pastilhas',
};

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
    email: registrationData.email,
    company_name: registrationData.empresa,
    cnpj: registrationData.cnpj,
    phone: registrationData.telefone,
    message: registrationData.mensagem,
    status: 'pending',
    approved_at: null,
    approved_by: null,
    rejected_reason: null,
    created_at: UPDATED_AT,
    updated_at: UPDATED_AT,
    ...overrides,
  };
}

function makeDeps(input: {
  env?: ServerEnv | (() => never);
  existing?: SellerRow | null;
  createAuthUser?: B2BRegisterDeps['createAuthUser'];
  listAuthUsersPage?: B2BRegisterDeps['listAuthUsersPage'];
  upsertPendingSeller?: B2BRegisterDeps['upsertPendingSeller'];
  sendRegistrationAlert?: B2BRegisterDeps['sendRegistrationAlert'];
  buildApproveUrl?: B2BRegisterDeps['buildApproveUrl'];
}): {
  deps: B2BRegisterDeps;
  upsertPendingSeller: ReturnType<typeof vi.fn>;
  sendRegistrationAlert: ReturnType<typeof vi.fn>;
} {
  const upsertPendingSeller =
    input.upsertPendingSeller ??
    vi.fn(async () => ({
      seller: sellerRow(),
      error: null,
    }));
  const sendRegistrationAlert =
    input.sendRegistrationAlert ??
    vi.fn(async () => ({ ok: true as const }));

  const deps: B2BRegisterDeps = {
    getEnv:
      typeof input.env === 'function'
        ? input.env
        : () => input.env ?? baseEnv(),
    createServiceClient: () => ({}) as never,
    getSellerByEmail: async () => input.existing ?? null,
    buildApproveUrl:
      input.buildApproveUrl ??
      (async () =>
        'https://ghenortrs.vercel.app/api/admin-approve-seller?token=t'),
    sendRegistrationAlert,
    listAuthUsersPage:
      input.listAuthUsersPage ??
      (async () => ({
        users: [],
        nextPage: null,
        lastPage: 0,
        total: 0,
        error: null,
      })),
    createAuthUser:
      input.createAuthUser ??
      (async () => ({ ok: true as const, userId: 'auth-user-1' })),
    upsertPendingSeller,
  };

  return { deps, upsertPendingSeller, sendRegistrationAlert };
}

describe('findAuthUserIdByEmail', () => {
  it('finds the user on page 2 using pagination metadata', async () => {
    const listAuthUsersPage = vi.fn(
      async (_service: unknown, page: number) => {
        if (page === 1) {
          return {
            users: [{ id: 'u1', email: 'other@example.com' }],
            nextPage: 2,
            lastPage: 2,
            total: 201,
            error: null,
          };
        }
        return {
          users: [{ id: 'u-target', email: 'loja@example.com' }],
          nextPage: null,
          lastPage: 2,
          total: 201,
          error: null,
        };
      },
    );

    const id = await findAuthUserIdByEmail({} as never, 'loja@example.com', {
      listAuthUsersPage,
    });

    expect(id).toBe('u-target');
    expect(listAuthUsersPage).toHaveBeenCalledTimes(2);
    expect(listAuthUsersPage).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      1,
      200,
    );
    expect(listAuthUsersPage).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      2,
      200,
    );
  });

  it('stops when nextPage is null without a first-200 assumption', async () => {
    const listAuthUsersPage = vi.fn(async () => ({
      users: Array.from({ length: 200 }, (_, i) => ({
        id: `u${i}`,
        email: `u${i}@example.com`,
      })),
      nextPage: null,
      lastPage: 1,
      total: 200,
      error: null,
    }));

    const id = await findAuthUserIdByEmail({} as never, 'missing@example.com', {
      listAuthUsersPage,
    });

    expect(id).toBeNull();
    expect(listAuthUsersPage).toHaveBeenCalledTimes(1);
  });
});

describe('registerSellerApplication seller state', () => {
  it('returns already_approved without mutating or notifying', async () => {
    const { deps, upsertPendingSeller, sendRegistrationAlert } = makeDeps({
      existing: sellerRow({ status: 'approved' }),
    });

    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );

    expect(result).toMatchObject({ kind: 'already_approved' });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
    expect(sendRegistrationAlert).not.toHaveBeenCalled();
  });

  it('preserves rejected sellers and does not upsert', async () => {
    const { deps, upsertPendingSeller, sendRegistrationAlert } = makeDeps({
      existing: sellerRow({
        status: 'rejected',
        rejected_reason: 'docs incomplete',
        updated_at: UPDATED_AT,
      }),
    });

    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );

    expect(result).toEqual({
      kind: 'registration_blocked',
      status: 'rejected',
      message: expect.stringContaining('não está autorizado'),
    });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
    expect(sendRegistrationAlert).not.toHaveBeenCalled();
  });

  it('preserves suspended sellers and does not upsert', async () => {
    const { deps, upsertPendingSeller, sendRegistrationAlert } = makeDeps({
      existing: sellerRow({ status: 'suspended' }),
    });

    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );

    expect(result).toMatchObject({
      kind: 'registration_blocked',
      status: 'suspended',
    });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
    expect(sendRegistrationAlert).not.toHaveBeenCalled();
  });

  it('keeps pending sellers and retries the registration alert', async () => {
    const existing = sellerRow({
      status: 'pending',
      company_name: 'Empresa Persistida',
      cnpj: '99888777000166',
      phone: '21988887777',
      message: 'Mensagem do banco',
    });
    const liveForm: B2BRegisterRequestData = {
      empresa: 'Empresa do Formulario',
      cnpj: '11111111000111',
      telefone: '11911111111',
      email: existing.email,
      mensagem: 'Mensagem do formulario',
    };
    const { deps, upsertPendingSeller, sendRegistrationAlert } = makeDeps({
      existing,
    });

    const result = await registerSellerApplication(
      { data: liveForm, authenticatedUser: null },
      deps,
    );

    expect(result).toEqual({
      kind: 'registered',
      status: 'pending',
      existingPending: true,
      notification: 'sent',
      message: expect.stringContaining('Reenviamos o alerta'),
      sellerEmail: existing.email,
    });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
    expect(sendRegistrationAlert).toHaveBeenCalledOnce();
    expect(sendRegistrationAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: 'Empresa Persistida',
        cnpj: '99888777000166',
        phone: '21988887777',
        email: existing.email,
        message: 'Mensagem do banco',
      }),
    );
    expect(sendRegistrationAlert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: liveForm.empresa,
      }),
    );
  });

  it('recovers auth user from page 2 when createUser fails', async () => {
    const listAuthUsersPage = vi.fn(
      async (_service: unknown, page: number) => {
        if (page === 1) {
          return {
            users: [{ id: 'u1', email: 'a@example.com' }],
            nextPage: 2,
            lastPage: 2,
            total: 201,
            error: null,
          };
        }
        return {
          users: [{ id: 'auth-page-2', email: registrationData.email }],
          nextPage: null,
          lastPage: 2,
          total: 201,
          error: null,
        };
      },
    );
    const upsertPendingSeller = vi.fn(async (service, payload) => {
      void service;
      return {
        seller: sellerRow({ id: payload.id }),
        error: null,
      };
    });
    const { deps } = makeDeps({
      existing: null,
      createAuthUser: async () => ({
        ok: false,
        error: { message: 'already exists' },
      }),
      listAuthUsersPage,
      upsertPendingSeller,
    });

    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );

    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'sent',
      existingPending: false,
    });
    expect(listAuthUsersPage).toHaveBeenCalledTimes(2);
    expect(upsertPendingSeller).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ id: 'auth-page-2' }),
    );
  });
});

describe('registerSellerApplication notification outcomes', () => {
  it('reports sent on successful alert after new registration', async () => {
    const persisted = sellerRow({
      company_name: 'Empresa Persistida Nova',
      cnpj: '55444333000122',
      phone: '31977776666',
      message: 'Snapshot do upsert',
    });
    const upsertPendingSeller = vi.fn(async () => ({
      seller: persisted,
      error: null,
    }));
    const { deps, sendRegistrationAlert } = makeDeps({
      existing: null,
      upsertPendingSeller,
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'sent',
      existingPending: false,
    });
    expect(sendRegistrationAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: persisted.company_name,
        cnpj: persisted.cnpj,
        phone: persisted.phone,
        email: persisted.email,
        message: persisted.message,
      }),
    );
  });

  it('reports failed when alert delivery fails after persistence', async () => {
    const { deps, upsertPendingSeller } = makeDeps({
      existing: null,
      sendRegistrationAlert: async () => ({
        ok: false,
        reason: 'Email delivery failed',
      }),
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'failed',
      message: expect.stringContaining('aviso à GHENO falhou'),
    });
    expect(upsertPendingSeller).toHaveBeenCalledOnce();
  });

  it('reports failed when buildApproveUrl throws after persistence', async () => {
    const { deps, upsertPendingSeller } = makeDeps({
      existing: null,
      buildApproveUrl: async () => {
        throw new Error('token sign failed');
      },
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'failed',
      existingPending: false,
    });
    expect(upsertPendingSeller).toHaveBeenCalledOnce();
  });

  it('reports failed when sendRegistrationAlert throws after persistence', async () => {
    const { deps, upsertPendingSeller } = makeDeps({
      existing: null,
      sendRegistrationAlert: async () => {
        throw new Error('network down');
      },
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'failed',
      existingPending: false,
    });
    expect(upsertPendingSeller).toHaveBeenCalledOnce();
  });

  it('reports failed when buildApproveUrl throws for existing pending', async () => {
    const { deps, upsertPendingSeller } = makeDeps({
      existing: sellerRow({ status: 'pending' }),
      buildApproveUrl: async () => {
        throw new Error('token sign failed');
      },
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      existingPending: true,
      notification: 'failed',
    });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
  });

  it('reports failed when sendRegistrationAlert throws for existing pending', async () => {
    const { deps, upsertPendingSeller } = makeDeps({
      existing: sellerRow({ status: 'pending' }),
      sendRegistrationAlert: async () => {
        throw new Error('smtp timeout');
      },
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      existingPending: true,
      notification: 'failed',
    });
    expect(upsertPendingSeller).not.toHaveBeenCalled();
  });

  it('reports not_configured when Resend env is missing', async () => {
    const { deps, sendRegistrationAlert } = makeDeps({
      existing: null,
      env: baseEnv({ resendApiKey: null, resendToEmail: null }),
    });
    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );
    expect(result).toMatchObject({
      kind: 'registered',
      notification: 'not_configured',
    });
    expect(sendRegistrationAlert).not.toHaveBeenCalled();
  });

  it('retries notification for existing pending even after prior failure', async () => {
    const sendRegistrationAlert = vi.fn(async () => ({
      ok: false as const,
      reason: 'Email delivery failed',
    }));
    const { deps, upsertPendingSeller } = makeDeps({
      existing: sellerRow({ status: 'pending' }),
      sendRegistrationAlert,
    });

    const result = await registerSellerApplication(
      { data: registrationData, authenticatedUser: null },
      deps,
    );

    expect(result).toMatchObject({
      kind: 'registered',
      existingPending: true,
      notification: 'failed',
    });
    expect(sendRegistrationAlert).toHaveBeenCalledOnce();
    expect(upsertPendingSeller).not.toHaveBeenCalled();
  });
});

describe('result mapping', () => {
  it('maps API bodies for sent, failed, and not_configured', () => {
    const baseRegistered = {
      kind: 'registered' as const,
      status: 'pending' as const,
      existingPending: false,
      sellerEmail: registrationData.email,
      message: 'ok',
    };

    expect(
      mapRegisterResultToApi({ ...baseRegistered, notification: 'sent' }),
    ).toEqual({
      status: 200,
      body: {
        success: true,
        persisted: true,
        complete: true,
        status: 'pending',
        notification: 'sent',
        existingPending: false,
        message: 'ok',
      },
    });
    expect(
      mapRegisterResultToApi({ ...baseRegistered, notification: 'failed' }),
    ).toEqual({
      status: 202,
      body: {
        success: true,
        persisted: true,
        complete: false,
        status: 'pending',
        notification: 'failed',
        existingPending: false,
        message: 'ok',
      },
    });
    expect(
      mapRegisterResultToApi({
        ...baseRegistered,
        notification: 'not_configured',
      }),
    ).toEqual({
      status: 202,
      body: {
        success: true,
        persisted: true,
        complete: false,
        status: 'pending',
        notification: 'not_configured',
        existingPending: false,
        message: 'ok',
      },
    });
  });

  it('maps Remix form statuses including partial success', () => {
    const sent: RegisterSellerResult = {
      kind: 'registered',
      status: 'pending',
      existingPending: false,
      notification: 'sent',
      message: 'Pré-cadastro recebido.',
      sellerEmail: registrationData.email,
    };
    const failed: RegisterSellerResult = {
      ...sent,
      notification: 'failed',
      message: 'Recebemos seu cadastro, mas o aviso à GHENO falhou.',
    };

    expect(mapRegisterResultToRemix(sent)).toEqual({
      status: 'success',
      message: sent.message,
      gateHint: 'pending',
    });
    expect(mapRegisterResultToRemix(failed)).toEqual({
      status: 'partial-success',
      message: failed.message,
      gateHint: 'pending',
    });
    expect(
      mapRegisterResultToRemix({
        kind: 'already_approved',
        message: 'login',
      }),
    ).toEqual({
      status: 'error',
      message: 'login',
      gateHint: 'login',
    });
    expect(
      mapRegisterResultToRemix({
        kind: 'registration_blocked',
        status: 'rejected',
        message: 'blocked',
      }),
    ).toEqual({
      status: 'error',
      message: 'blocked',
    });
  });
});
