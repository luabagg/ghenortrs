// Cookie-bound Bling OAuth state.
// The admin browser holds the state nonce, so no shared secret is needed.

import { randomUUID } from 'node:crypto';

import { createCookie, redirect } from '@remix-run/node';

import { getBlingAuthorizeUrl } from './bling';

const STATE_TTL_SECONDS = 15 * 60;
const FLASH_TTL_SECONDS = 60;

/** Result of the last connect attempt, shown once on /admin/produtos. */
export type BlingConnectResult =
  | 'connected'
  | 'denied'
  | 'invalid_state'
  | 'not_configured'
  | 'failed';

const CONNECT_RESULTS: BlingConnectResult[] = [
  'connected',
  'denied',
  'invalid_state',
  'not_configured',
  'failed',
];

const stateCookie = createCookie('bling_oauth_state', {
  httpOnly: true,
  maxAge: STATE_TTL_SECONDS,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

const resultCookie = createCookie('bling_connect_result', {
  httpOnly: true,
  maxAge: FLASH_TTL_SECONDS,
  path: '/admin',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

/** Redirects to Bling consent and binds the state nonce to this browser. */
export async function startBlingOAuth(
  headers = new Headers(),
): Promise<Response> {
  const state = randomUUID();
  const authorizeUrl = getBlingAuthorizeUrl(state);
  headers.append('Set-Cookie', await stateCookie.serialize(state));
  return redirect(authorizeUrl, { headers });
}

/** Compares the callback state with the cookie and always clears the cookie. */
export async function validateBlingOAuthCallback(
  request: Request,
): Promise<{ valid: boolean; headers: Headers }> {
  const headers = new Headers();
  headers.append('Set-Cookie', await stateCookie.serialize('', { maxAge: 0 }));

  const issued = await stateCookie.parse(request.headers.get('Cookie'));
  const received = new URL(request.url).searchParams.get('state');
  const valid =
    typeof issued === 'string' && issued.length > 0 && issued === received;

  return { valid, headers };
}

export async function serializeBlingConnectResult(
  result: BlingConnectResult,
): Promise<string> {
  return resultCookie.serialize(result);
}

/** Reads the one-time connect result and the header that clears it. */
export async function readBlingConnectResult(request: Request): Promise<{
  result: BlingConnectResult | null;
  clearCookie: string | null;
}> {
  const stored = await resultCookie.parse(request.headers.get('Cookie'));
  if (!CONNECT_RESULTS.includes(stored as BlingConnectResult)) {
    return { result: null, clearCookie: null };
  }
  return {
    result: stored as BlingConnectResult,
    clearCookie: await resultCookie.serialize('', { maxAge: 0 }),
  };
}
