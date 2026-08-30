// GET /api/bling-oauth-callback?code=&state=
// Bling redirects here after app authorization. Stores tokens via Drizzle.

import { exchangeAuthorizationCode, saveBlingTokens } from './bling';
import { getServerEnv } from './env';
import { json, methodNotAllowed } from './http';
import { isValidBlingOAuthState } from './signed-token';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET']);

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return json({ error: 'bling_oauth_denied', detail: error }, 400);
  }
  if (!code) return json({ error: 'code_required' }, 400);

  try {
    const env = getServerEnv();
    if (!env.adminApproveSecret) {
      return json({ error: 'admin_secret_not_configured' }, 503);
    }
    if (
      !isValidBlingOAuthState(
        state,
        env.adminApproveSecret,
        env.blingOauthInviteState,
      )
    ) {
      return json(
        {
          error: 'invalid_state',
          message:
            'Use /api/bling-oauth-start?secret=... or set BLING_OAUTH_INVITE_STATE to the state from Bling invite link.',
        },
        400,
      );
    }
    const tokens = await exchangeAuthorizationCode(code);
    await saveBlingTokens(tokens);
    return json({
      success: true,
      message:
        'Bling conectado. Rode /api/bling-sync ou pnpm catalog:sync para popular o catálogo.',
    });
  } catch (err) {
    console.error('bling-oauth-callback failed', err);
    return json({ error: 'oauth_callback_failed' }, 500);
  }
}
