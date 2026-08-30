import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  serializeBlingSyncResult,
  syncBlingCatalog,
} from '~/server/bling-admin';
import { updateProductVisibleB2b } from '~/server/db/queries';
import { requireAdmin } from '~/server/require-admin.server';
import { action } from './admin.produtos';

vi.mock('~/server/bling-admin', () => ({
  getBlingConnectionStatus: vi.fn(),
  readBlingSyncResult: vi.fn(),
  serializeBlingSyncResult: vi.fn(),
  syncBlingCatalog: vi.fn(),
}));
vi.mock('~/server/bling-oauth-state', () => ({
  readBlingConnectResult: vi.fn(),
  serializeBlingConnectResult: vi.fn(),
  startBlingOAuth: vi.fn(),
}));
vi.mock('~/server/db/queries', () => ({
  ADMIN_PRODUCT_LIST_LIMIT: 200,
  listAdminProducts: vi.fn(),
  updateProductVisibleB2b: vi.fn(),
}));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));

const requireAdminMock = vi.mocked(requireAdmin);
const syncBlingCatalogMock = vi.mocked(syncBlingCatalog);

const admin = { id: 'admin-1', email: 'admin@example.com' };

function postIntent(fields: Record<string, string>): ActionFunctionArgs {
  const body = new URLSearchParams(fields);
  return {
    request: new Request('https://example.com/admin/produtos', {
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    }),
    context: {},
    params: {},
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  requireAdminMock.mockResolvedValue({
    user: admin,
    headers: new Headers(),
  } as never);
  vi.mocked(serializeBlingSyncResult).mockResolvedValue('bling_sync_result=x');
});

describe('/admin/produtos action', () => {
  it('runs the catalog sync for the signed-in admin', async () => {
    syncBlingCatalogMock.mockResolvedValue({
      ok: true,
      upserted: 12,
      syncedAt: '2026-08-30T10:00:00.000Z',
    });

    const response = await action(postIntent({ intent: 'sync-bling' }));

    expect(syncBlingCatalogMock).toHaveBeenCalledOnce();
    expect(syncBlingCatalogMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/admin/produtos');
  });

  it('refuses an unknown intent without touching Bling or products', async () => {
    const response = await action(postIntent({ intent: 'whatever' }));

    expect(response.status).toBe(400);
    expect(syncBlingCatalogMock).not.toHaveBeenCalled();
    expect(vi.mocked(updateProductVisibleB2b)).not.toHaveBeenCalled();
  });

  it('never syncs when the request is not an admin session', async () => {
    requireAdminMock.mockRejectedValue(redirect('/admin/login'));

    await expect(action(postIntent({ intent: 'sync-bling' }))).rejects.toEqual(
      expect.objectContaining({ status: 302 }),
    );
    expect(syncBlingCatalogMock).not.toHaveBeenCalled();
  });
});
