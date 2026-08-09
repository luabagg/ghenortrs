// GET /api/bling-oauth-callback?code=&state=
// Bling redirects here after auth. Validate signed state, then store tokens.

import {
  BLING_OAUTH_STATE_PURPOSE,
  type BlingOAuthStatePayload,
  verifyActionToken,
} from './action-token';
import { exchangeAuthorizationCode, saveBlingTokens } from './bling';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import { createServiceClient } from './supabase';

export type BlingOAuthCallbackDeps = {
  getEnv: typeof getServerEnv;
  verifyState: (
    token: string,
    secret: string,
    expectedPurpose: typeof BLING_OAUTH_STATE_PURPOSE,
    nowMs?: number,
  ) => Promise<
    | { ok: true; payload: BlingOAuthStatePayload }
    | { ok: false; error: string }
  >;
  exchangeCode: typeof exchangeAuthorizationCode;
  createServiceClient: typeof createServiceClient;
  saveTokens: typeof saveBlingTokens;
  nowMs: () => number;
};

const defaultDeps: BlingOAuthCallbackDeps = {
  getEnv: getServerEnv,
  verifyState: verifyActionToken,
  exchangeCode: exchangeAuthorizationCode,
  createServiceClient,
  saveTokens: saveBlingTokens,
  nowMs: () => Date.now(),
};

export async function handleBlingOAuthCallback(
  req: Request,
  deps: BlingOAuthCallbackDeps = defaultDeps,
): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'GET') return methodNotAllowed(['GET', 'OPTIONS']);

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return json({ error: 'bling_oauth_denied', detail: error }, 400);
  }
  if (!code) return json({ error: 'code_required' }, 400);
  if (!state) return json({ error: 'state_required' }, 400);

  let env;
  try {
    env = deps.getEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }
  if (!env.adminApproveSecret) {
    return json({ error: 'admin_secret_not_configured' }, 503);
  }

  const verified = await deps.verifyState(
    state,
    env.adminApproveSecret,
    BLING_OAUTH_STATE_PURPOSE,
    deps.nowMs(),
  );
  if (!verified.ok) {
    return json({ error: 'state_invalid', detail: verified.error }, 400);
  }

  try {
    const tokens = await deps.exchangeCode(code);
    const service = deps.createServiceClient();
    await deps.saveTokens(service, tokens);
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

export default async function handler(req: Request): Promise<Response> {
  return handleBlingOAuthCallback(req);
}
