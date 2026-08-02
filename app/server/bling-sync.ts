// POST /api/bling-sync
// Pulls products from Bling into bling_products cache. Admin secret required.

import { syncBlingProductsToCache } from './bling';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import { createServiceClient } from './supabase';


export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST' && req.method !== 'GET') {
    return methodNotAllowed(['GET', 'POST', 'OPTIONS']);
  }

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const url = new URL(req.url);
  const secret =
    req.headers.get('x-admin-secret') ?? url.searchParams.get('secret');
  if (!env.adminApproveSecret || secret !== env.adminApproveSecret) {
    return json({ error: 'unauthorized' }, 401);
  }

  try {
    const service = createServiceClient();
    const result = await syncBlingProductsToCache(
      service,
      env.defaultMinQuantity,
    );
    return json({
      success: true,
      upserted: result.upserted,
      defaultMinQuantity: env.defaultMinQuantity,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('bling-sync failed', error);
    return json(
      {
        error: 'sync_failed',
        message:
          error instanceof Error ? error.message : 'Unknown Bling sync error',
      },
      500,
    );
  }
}
