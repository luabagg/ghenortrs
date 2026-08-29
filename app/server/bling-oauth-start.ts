// GET /api/bling-oauth-start
// Redirects browser to Bling OAuth consent. Protect with admin secret.

import { getBlingAuthorizeUrl } from './bling';
import { getServerEnv } from './env';
import { json, methodNotAllowed, readAdminSecret } from './http';
import { buildBlingOAuthState } from './signed-token';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET']);

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const url = new URL(req.url);
  const secret = readAdminSecret(req) ?? url.searchParams.get('secret');
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
    const state = buildBlingOAuthState(env.adminApproveSecret);
    const authorizeUrl = getBlingAuthorizeUrl(state);
    return Response.redirect(authorizeUrl, 302);
  } catch (error) {
    console.error('bling-oauth-start failed', error);
    return json({ error: 'oauth_start_failed' }, 500);
  }
}
