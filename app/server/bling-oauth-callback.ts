// GET /api/bling-oauth-callback?code=&state=
// Bling redirects here after app authorization. Stores tokens in Supabase.

import {
  exchangeAuthorizationCode,
  saveBlingTokens,
} from './bling';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import { createServiceClient } from './supabase';


export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'GET') return methodNotAllowed(['GET', 'OPTIONS']);

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return json({ error: 'bling_oauth_denied', detail: error }, 400);
  }
  if (!code) return json({ error: 'code_required' }, 400);

  try {
    getServerEnv();
    const tokens = await exchangeAuthorizationCode(code);
    const service = createServiceClient();
    await saveBlingTokens(service, tokens);
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
