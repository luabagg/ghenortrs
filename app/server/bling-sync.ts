// POST /api/bling-sync
// Pulls products from Bling into bling_products cache. Admin secret required.

import { syncBlingProductsToCache } from './bling';
import { getServerEnv } from './env';
import { json, methodNotAllowed, readAdminSecret } from './http';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST']);

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const secret = readAdminSecret(req);
  if (!env.adminApproveSecret || secret !== env.adminApproveSecret) {
    return json({ error: 'unauthorized' }, 401);
  }

  try {
    const result = await syncBlingProductsToCache(env.defaultMinQuantity);
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
