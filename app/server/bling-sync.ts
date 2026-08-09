// POST /api/bling-sync
// Header: X-Admin-Secret: $B2B_ADMIN_APPROVE_SECRET
// Pull Bling products into Supabase cache. Header auth only (no query secret).

import { syncBlingProductsToCache } from './bling';
import { getServerEnv } from './env';
import { handleOptions, json, methodNotAllowed } from './http';
import { createServiceClient } from './supabase';

export type BlingSyncDeps = {
  getEnv: typeof getServerEnv;
  createServiceClient: typeof createServiceClient;
  syncProducts: typeof syncBlingProductsToCache;
  nowMs: () => number;
};

const defaultDeps: BlingSyncDeps = {
  getEnv: getServerEnv,
  createServiceClient,
  syncProducts: syncBlingProductsToCache,
  nowMs: () => Date.now(),
};

export async function handleBlingSync(
  req: Request,
  deps: BlingSyncDeps = defaultDeps,
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

  try {
    const service = deps.createServiceClient();
    const result = await deps.syncProducts(service, env.defaultMinQuantity);
    return json({
      success: true,
      upserted: result.upserted,
      defaultMinQuantity: env.defaultMinQuantity,
      syncedAt: new Date(deps.nowMs()).toISOString(),
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

export default async function handler(req: Request): Promise<Response> {
  return handleBlingSync(req);
}
