// Admin-side Bling operations: connection status and catalog synchronization.

import { createCookie } from '@remix-run/node';

import { syncBlingProductsToCache } from './bling';
import { insertAdminAuditEvent, readBlingTokenStatus } from './db/queries';

const FLASH_TTL_SECONDS = 60;

type Actor = {
  id: string;
  email?: string | null;
};

export type BlingConnectionStatus = {
  connected: boolean;
  expiresAt: string | null;
};

export type BlingSyncResult =
  | { ok: true; upserted: number; syncedAt: string }
  | { ok: false; error: 'sync_failed' };

const syncResultCookie = createCookie('bling_sync_result', {
  httpOnly: true,
  maxAge: FLASH_TTL_SECONDS,
  path: '/admin',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

export async function getBlingConnectionStatus(): Promise<BlingConnectionStatus> {
  const row = await readBlingTokenStatus();
  return { connected: row !== null, expiresAt: row?.expiresAt ?? null };
}

async function recordSyncAudit(
  actor: Actor,
  outcome: 'success' | 'failure',
  upserted: number | null,
): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: actor.id,
      actorEmail: actor.email ?? null,
      action: 'bling.catalog.sync',
      metadata: upserted === null ? {} : { upserted },
      outcome,
    });
  } catch (error) {
    console.error('bling sync audit failed', error);
  }
}

/** Pulls the Bling catalog into the product cache and audits the outcome. */
export async function syncBlingCatalog(input: {
  actor: Actor;
}): Promise<BlingSyncResult> {
  let upserted: number;
  try {
    upserted = (await syncBlingProductsToCache()).upserted;
  } catch (error) {
    console.error('bling catalog sync failed', error);
    await recordSyncAudit(input.actor, 'failure', null);
    return { ok: false, error: 'sync_failed' };
  }

  await recordSyncAudit(input.actor, 'success', upserted);
  return { ok: true, upserted, syncedAt: new Date().toISOString() };
}

export async function serializeBlingSyncResult(
  result: BlingSyncResult,
): Promise<string> {
  return syncResultCookie.serialize(result);
}

/** Reads the one-time sync result and the header that clears it. */
export async function readBlingSyncResult(request: Request): Promise<{
  result: BlingSyncResult | null;
  clearCookie: string | null;
}> {
  const stored = await syncResultCookie.parse(request.headers.get('Cookie'));
  if (typeof stored !== 'object' || stored === null || !('ok' in stored)) {
    return { result: null, clearCookie: null };
  }
  return {
    result: stored as BlingSyncResult,
    clearCookie: await syncResultCookie.serialize('', { maxAge: 0 }),
  };
}
