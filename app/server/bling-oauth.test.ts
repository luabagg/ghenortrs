import { describe, expect, it, vi } from 'vitest';

import { createBlingOAuthStateToken, verifyActionToken } from './action-token';
import { handleBlingOAuthCallback } from './bling-oauth-callback';
import { handleBlingOAuthStart } from './bling-oauth-start';
import type { ServerEnv } from './env';

const SECRET = 'oauth-test-secret';

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

describe('bling oauth start', () => {
  it('rejects missing header secret and ignores query secret', async () => {
    const res = await handleBlingOAuthStart(
      new Request(
        'https://ghenortrs.vercel.app/api/bling-oauth-start?secret=' + SECRET,
        { method: 'POST' },
      ),
      {
        getEnv: () => baseEnv(),
        getAuthorizeUrl: () => 'https://bling.example/authorize',
        createStateToken: createBlingOAuthStateToken,
        nowMs: () => 1_700_000_000_000,
      },
    );
    expect(res.status).toBe(401);
  });

  it('rejects GET', async () => {
    const res = await handleBlingOAuthStart(
      new Request('https://ghenortrs.vercel.app/api/bling-oauth-start', {
        method: 'GET',
        headers: { 'X-Admin-Secret': SECRET },
      }),
      {
        getEnv: () => baseEnv(),
        getAuthorizeUrl: () => 'https://bling.example/authorize',
        createStateToken: createBlingOAuthStateToken,
        nowMs: () => Date.now(),
      },
    );
    expect(res.status).toBe(405);
  });

  it('returns authorizeUrl with signed state on admin POST', async () => {
    const getAuthorizeUrl = vi.fn((state: string) => {
      return `https://bling.example/authorize?state=${encodeURIComponent(state)}`;
    });

    const res = await handleBlingOAuthStart(
      new Request('https://ghenortrs.vercel.app/api/bling-oauth-start', {
        method: 'POST',
        headers: { 'X-Admin-Secret': SECRET },
      }),
      {
        getEnv: () => baseEnv(),
        getAuthorizeUrl,
        createStateToken: createBlingOAuthStateToken,
        nowMs: () => 1_700_000_000_000,
      },
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as { authorizeUrl: string; state: string };
    expect(body.authorizeUrl).toContain('https://bling.example/authorize');
    expect(body.state).toBeTruthy();
    expect(getAuthorizeUrl).toHaveBeenCalledWith(body.state);
    expect(JSON.stringify(body)).not.toContain(SECRET);
  });
});

describe('bling oauth callback state validation', () => {
  it('requires state', async () => {
    const res = await handleBlingOAuthCallback(
      new Request(
        'https://ghenortrs.vercel.app/api/bling-oauth-callback?code=abc',
        { method: 'GET' },
      ),
      {
        getEnv: () => baseEnv(),
        verifyState: verifyActionToken,
        exchangeCode: async () => {
          throw new Error('should not run');
        },
        createServiceClient: () => ({}) as never,
        saveTokens: async () => undefined,
        nowMs: () => Date.now(),
      },
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'state_required' });
  });

  it('rejects invalid signed state before token exchange', async () => {
    const exchangeCode = vi.fn(async () => {
      throw new Error('should not run');
    });

    const res = await handleBlingOAuthCallback(
      new Request(
        'https://ghenortrs.vercel.app/api/bling-oauth-callback?code=abc&state=bad',
        { method: 'GET' },
      ),
      {
        getEnv: () => baseEnv(),
        verifyState: verifyActionToken,
        exchangeCode,
        createServiceClient: () => ({}) as never,
        saveTokens: async () => undefined,
        nowMs: () => Date.now(),
      },
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'state_invalid' });
    expect(exchangeCode).not.toHaveBeenCalled();
  });

  it('exchanges code when state verifies with a real signed token', async () => {
    const { token } = await createBlingOAuthStateToken(SECRET, {
      nonce: 'n1',
      nowMs: 1_700_000_000_000,
    });
    const exchangeCode = vi.fn(async () => ({
      access_token: 'a',
      refresh_token: 'r',
      expires_in: 3600,
    }));
    const saveTokens = vi.fn(async () => undefined);

    const res = await handleBlingOAuthCallback(
      new Request(
        `https://ghenortrs.vercel.app/api/bling-oauth-callback?code=abc&state=${encodeURIComponent(token)}`,
        { method: 'GET' },
      ),
      {
        getEnv: () => baseEnv(),
        verifyState: verifyActionToken,
        exchangeCode,
        createServiceClient: () => ({}) as never,
        saveTokens,
        nowMs: () => 1_700_000_000_000,
      },
    );

    expect(res.status).toBe(200);
    expect(exchangeCode).toHaveBeenCalledWith('abc');
    expect(saveTokens).toHaveBeenCalled();
    expect(await res.json()).toMatchObject({ success: true });
  });

  it('rejects expired real signed state before token exchange', async () => {
    const nowMs = 1_700_000_000_000;
    const { token } = await createBlingOAuthStateToken(SECRET, {
      nonce: 'expired-n',
      nowMs,
      ttlSeconds: 60,
    });
    const exchangeCode = vi.fn(async () => {
      throw new Error('should not run');
    });

    const res = await handleBlingOAuthCallback(
      new Request(
        `https://ghenortrs.vercel.app/api/bling-oauth-callback?code=abc&state=${encodeURIComponent(token)}`,
        { method: 'GET' },
      ),
      {
        getEnv: () => baseEnv(),
        verifyState: verifyActionToken,
        exchangeCode,
        createServiceClient: () => ({}) as never,
        saveTokens: async () => undefined,
        nowMs: () => nowMs + 61_000,
      },
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: 'state_invalid',
      detail: 'token_expired',
    });
    expect(exchangeCode).not.toHaveBeenCalled();
  });
});
