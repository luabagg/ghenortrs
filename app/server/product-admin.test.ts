import { beforeEach, describe, expect, it, vi } from 'vitest';

import { insertAdminAuditEvent, updateProductsVisibleB2b } from './db/queries';
import { setProductsVisibility } from './product-admin';

vi.mock('./db/queries', () => ({
  insertAdminAuditEvent: vi.fn(),
  updateProductsVisibleB2b: vi.fn(),
}));

const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const updateProductsVisibleB2bMock = vi.mocked(updateProductsVisibleB2b);

const actor = { id: 'admin-1', email: 'admin@example.com' };

beforeEach(() => {
  vi.resetAllMocks();
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('setProductsVisibility', () => {
  it('hides exactly the requested products and audits the counts', async () => {
    updateProductsVisibleB2bMock.mockResolvedValue(2);

    await expect(
      setProductsVisibility({
        actor,
        ids: [1, 2],
        query: 'pad',
        visibleB2b: false,
      }),
    ).resolves.toEqual({ updated: 2 });

    expect(updateProductsVisibleB2bMock).toHaveBeenCalledWith([1, 2], false);
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'product.visibility',
        actorUserId: 'admin-1',
        metadata: {
          query: 'pad',
          requested: 2,
          updated: 2,
          visibleB2b: false,
        },
        outcome: 'success',
        targetProductId: null,
      }),
    );
  });

  it('records the product when a single row changes', async () => {
    updateProductsVisibleB2bMock.mockResolvedValue(1);

    await setProductsVisibility({
      actor,
      ids: [7],
      query: '',
      visibleB2b: true,
    });

    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ targetProductId: 7 }),
    );
  });

  it('marks a partial change as a failure', async () => {
    updateProductsVisibleB2bMock.mockResolvedValue(1);

    await setProductsVisibility({
      actor,
      ids: [1, 2],
      query: '',
      visibleB2b: true,
    });

    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ outcome: 'failure' }),
    );
  });
});
