// POST /api/bling-oauth-start
// Header: X-Admin-Secret: $B2B_ADMIN_APPROVE_SECRET
// Returns JSON { authorizeUrl } with a signed short-lived OAuth state.
// Does not accept the admin secret from query parameters.

import {
  createBlingOAuthStateToken,
} from './action-token';
import { getBlingAuthorizeUrl } from './bling';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';

export type BlingOAuthStartDeps = {
  getEnv: typeof getServerEnv;
  getAuthorizeUrl: typeof getBlingAuthorizeUrl;
  createStateToken: typeof createBlingOAuthStateToken;
  nowMs: () => number;
};

const defaultDeps: BlingOAuthStartDeps = {
  getEnv: getServerEnv,
  getAuthorizeUrl: getBlingAuthorizeUrl,
  createStateToken: createBlingOAuthStateToken,
  nowMs: () => Date.now(),
};

export async function handleBlingOAuthStart(
  req: Request,
  deps: BlingOAuthStartDeps = defaultDeps,
): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return methodNotAllowed(['POST', 'OPTIONS']);

  let env;
  try {
    env = deps.getEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const secret = req.headers.get('x-admin-secret');
  if (!env.adminApproveSecret || secret !== env.adminApproveSecret) {
    return json({ error: 'unauthorized' }, 401);
  }

  if (!env.blingClientId || !env.blingRedirectUri) {
    return json(
      {
        error: 'bling_not_configured',
        message:
          'Set BLING_CLIENT_ID, BLING_CLIENT_SECRET, BLING_REDIRECT_URI.',
      },
      503,
    );
  }

  try {
    const { token: state } = await deps.createStateToken(
      env.adminApproveSecret,
      { nowMs: deps.nowMs() },
    );
    const authorizeUrl = deps.getAuthorizeUrl(state);
    return json({ authorizeUrl, state });
  } catch (error) {
    console.error('bling-oauth-start failed', error);
    return json({ error: 'oauth_start_failed' }, 500);
  }
}

export default async function handler(req: Request): Promise<Response> {
  return handleBlingOAuthStart(req);
}
