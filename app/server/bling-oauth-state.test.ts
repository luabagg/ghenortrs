import { describe, expect, it, vi } from 'vitest';

import {
  startBlingOAuth,
  validateBlingOAuthCallback,
} from './bling-oauth-state';

vi.mock('./bling', () => ({
  getBlingAuthorizeUrl: vi.fn(
    (state: string) => `https://bling.example/authorize?state=${state}`,
  ),
}));

function cookieFrom(response: Response): string {
  const setCookie = response.headers.get('Set-Cookie');
  if (!setCookie) throw new Error('missing oauth state cookie');
  return setCookie.split(';', 1)[0];
}

describe('Bling OAuth state cookie', () => {
  it('accepts only the state issued in the current HttpOnly cookie', async () => {
    const start = await startBlingOAuth();
    const state = new URL(start.headers.get('Location')!).searchParams.get(
      'state',
    );
    const callback = new Request(
      `https://gheno.example/api/bling-oauth-callback?state=${state}`,
      { headers: { Cookie: cookieFrom(start) } },
    );

    await expect(validateBlingOAuthCallback(callback)).resolves.toMatchObject({
      valid: true,
    });
  });

  it('rejects callbacks without or with mismatched state cookies', async () => {
    const start = await startBlingOAuth();
    const state = new URL(start.headers.get('Location')!).searchParams.get(
      'state',
    );
    const missingCookie = new Request(
      `https://gheno.example/api/bling-oauth-callback?state=${state}`,
    );
    const mismatchedCookie = new Request(
      `https://gheno.example/api/bling-oauth-callback?state=${state}`,
      { headers: { Cookie: 'bling_oauth_state=foreign-state' } },
    );

    await expect(
      validateBlingOAuthCallback(missingCookie),
    ).resolves.toMatchObject({ valid: false });
    await expect(
      validateBlingOAuthCallback(mismatchedCookie),
    ).resolves.toMatchObject({ valid: false });
  });
});
