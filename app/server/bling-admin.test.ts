import { beforeEach, describe, expect, it, vi } from 'vitest';

import { syncBlingProductsToCache } from './bling';
import { getBlingConnectionStatus, syncBlingCatalog } from './bling-admin';
import { insertAdminAuditEvent, readBlingTokenStatus } from './db/queries';

vi.mock('./bling', () => ({ syncBlingProductsToCache: vi.fn() }));
vi.mock('./db/queries', () => ({
  insertAdminAuditEvent: vi.fn(),
  readBlingTokenStatus: vi.fn(),
}));
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const readBlingTokenStatusMock = vi.mocked(readBlingTokenStatus);
const syncBlingProductsToCacheMock = vi.mocked(syncBlingProductsToCache);

const actor = { id: 'admin-1', email: 'admin@example.com' };

beforeEach(() => {
  vi.resetAllMocks();
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('getBlingConnectionStatus', () => {
  it('reports disconnected without persisted tokens', async () => {
    readBlingTokenStatusMock.mockResolvedValue(null);

    await expect(getBlingConnectionStatus()).resolves.toEqual({
      connected: false,
      expiresAt: null,
    });
  });

  it('reports the stored expiry without reading token columns', async () => {
    readBlingTokenStatusMock.mockResolvedValue({
      expiresAt: '2026-09-01T10:00:00.000Z',
      updatedAt: '2026-08-30T10:00:00.000Z',
    });

    await expect(getBlingConnectionStatus()).resolves.toEqual({
      connected: true,
      expiresAt: '2026-09-01T10:00:00.000Z',
    });
  });
});

describe('syncBlingCatalog', () => {
  it('audits the upsert count after a successful sync', async () => {
    syncBlingProductsToCacheMock.mockResolvedValue({ upserted: 12 });

    const result = await syncBlingCatalog({ actor });

    expect(syncBlingProductsToCacheMock).toHaveBeenCalledOnce();
    expect(syncBlingProductsToCacheMock).toHaveBeenCalledWith();
    expect(result).toMatchObject({ ok: true, upserted: 12 });
    expect(insertAdminAuditEventMock).toHaveBeenCalledOnce();
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'bling.catalog.sync',
        actorUserId: 'admin-1',
        metadata: { upserted: 12 },
        outcome: 'success',
      }),
    );
  });

  it('reports a generic failure and audits it', async () => {
    syncBlingProductsToCacheMock.mockRejectedValue(new Error('Bling API 401'));

    const result = await syncBlingCatalog({ actor });

    expect(result).toEqual({ ok: false, error: 'sync_failed' });
    expect(insertAdminAuditEventMock).toHaveBeenCalledOnce();
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'bling.catalog.sync',
        outcome: 'failure',
      }),
    );
  });
});
