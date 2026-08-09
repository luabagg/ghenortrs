import { describe, expect, it, vi } from 'vitest';

import { handleBlingSync } from './bling-sync';
import type { ServerEnv } from './env';

const SECRET = 'sync-test-secret';

function baseEnv(overrides: Partial<ServerEnv> = {}): ServerEnv {
  return {
    siteUrl: 'https://ghenortrs.vercel.app',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'anon',
    supabaseServiceRoleKey: 'service',
    resendApiKey: null,
    resendToEmail: null,
    resendFrom: 'test@example.com',
    blingClientId: 'bling-client',
    blingClientSecret: 'bling-secret',
    blingRedirectUri: 'https://ghenortrs.vercel.app/api/bling-oauth-callback',
    blingApiBase: 'https://api.bling.com.br/Api/v3',
    blingAuthBase: 'https://www.bling.com.br/Api/v3/oauth',
    adminApproveSecret: SECRET,
    defaultMinQuantity: 6,
    ...overrides,
  };
}

describe('bling-sync auth', () => {
  it('rejects GET', async () => {
    const syncProducts = vi.fn(async () => ({ upserted: 0 }));
    const res = await handleBlingSync(
      new Request('https://ghenortrs.vercel.app/api/bling-sync', {
        method: 'GET',
        headers: { 'X-Admin-Secret': SECRET },
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => ({}) as never,
        syncProducts,
        nowMs: () => 1_700_000_000_000,
      },
    );
    expect(res.status).toBe(405);
    expect(syncProducts).not.toHaveBeenCalled();
  });

  it('ignores query secret and rejects missing header', async () => {
    const syncProducts = vi.fn(async () => ({ upserted: 0 }));
    const res = await handleBlingSync(
      new Request(
        `https://ghenortrs.vercel.app/api/bling-sync?secret=${encodeURIComponent(SECRET)}`,
        { method: 'POST' },
      ),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => ({}) as never,
        syncProducts,
        nowMs: () => 1_700_000_000_000,
      },
    );
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: 'unauthorized' });
    expect(syncProducts).not.toHaveBeenCalled();
  });

  it('rejects wrong header secret', async () => {
    const syncProducts = vi.fn(async () => ({ upserted: 0 }));
    const res = await handleBlingSync(
      new Request('https://ghenortrs.vercel.app/api/bling-sync', {
        method: 'POST',
        headers: { 'X-Admin-Secret': 'wrong-secret' },
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient: () => ({}) as never,
        syncProducts,
        nowMs: () => 1_700_000_000_000,
      },
    );
    expect(res.status).toBe(401);
    expect(syncProducts).not.toHaveBeenCalled();
  });

  it('calls sync on valid header POST', async () => {
    const syncProducts = vi.fn(async () => ({ upserted: 3 }));
    const createServiceClient = vi.fn(() => ({ id: 'service' }) as never);

    const res = await handleBlingSync(
      new Request('https://ghenortrs.vercel.app/api/bling-sync', {
        method: 'POST',
        headers: { 'X-Admin-Secret': SECRET },
      }),
      {
        getEnv: () => baseEnv(),
        createServiceClient,
        syncProducts,
        nowMs: () => 1_700_000_000_000,
      },
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      success: true,
      upserted: 3,
      defaultMinQuantity: 6,
      syncedAt: new Date(1_700_000_000_000).toISOString(),
    });
    expect(createServiceClient).toHaveBeenCalledOnce();
    expect(syncProducts).toHaveBeenCalledWith({ id: 'service' }, 6);
  });
});
