// GET /api/bling-oauth-callback?code=&state=
// Bling returns the admin browser here. The state cookie proves the origin.

import { redirect } from '@remix-run/node';

import { exchangeAuthorizationCode, saveBlingTokens } from './bling';
import type { BlingConnectResult } from './bling-oauth-state';
import {
  serializeBlingConnectResult,
  validateBlingOAuthCallback,
} from './bling-oauth-state';
import { insertAdminAuditEvent } from './db/queries';
import { methodNotAllowed } from './http';
import { requireAdmin } from './require-admin.server';

const PRODUCTS_PATH = '/admin/produtos';

async function recordConnectAudit(
  actor: { id: string; email?: string | null },
  result: BlingConnectResult,
): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: actor.id,
      actorEmail: actor.email ?? null,
      action: 'bling.oauth.connect',
      metadata: { result },
      outcome: result === 'connected' ? 'success' : 'failure',
    });
  } catch (error) {
    console.error('bling connect audit failed', error);
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed(['GET']);

  const { user, headers } = await requireAdmin(request);
  const state = await validateBlingOAuthCallback(request);
  for (const cookie of state.headers.getSetCookie()) {
    headers.append('Set-Cookie', cookie);
  }

  const finish = async (result: BlingConnectResult): Promise<Response> => {
    await recordConnectAudit(user, result);
    headers.append('Set-Cookie', await serializeBlingConnectResult(result));
    return redirect(PRODUCTS_PATH, { headers });
  };

  const url = new URL(request.url);
  if (url.searchParams.get('error')) return finish('denied');
  if (!state.valid) return finish('invalid_state');

  const code = url.searchParams.get('code');
  if (!code) return finish('failed');

  try {
    await saveBlingTokens(await exchangeAuthorizationCode(code));
  } catch (error) {
    console.error('bling-oauth-callback failed', error);
    return finish('failed');
  }
  return finish('connected');
}
