import type { ActionFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSellerById, updateSellerStatus } from '~/server/db/queries';
import type { SellerStatus } from '~/server/db/schema';
import { requireAdmin } from '~/server/require-admin.server';
import { action } from './admin._index';

vi.mock('~/server/db/queries', () => ({
  getSellerById: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
  listSellers: vi.fn(),
  updateSellerStatus: vi.fn(),
}));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));
vi.mock('~/server/seller-access-link', () => ({
  sendSellerCatalogAccessLink: vi.fn(),
}));

const getSellerByIdMock = vi.mocked(getSellerById);
const requireAdminMock = vi.mocked(requireAdmin);
const updateSellerStatusMock = vi.mocked(updateSellerStatus);

const admin = { id: 'admin-1', email: 'admin@example.com' };

function seller(status: SellerStatus) {
  return { id: 'seller-1', status } as never;
}

function postStatus(status: SellerStatus): ActionFunctionArgs {
  return {
    request: new Request('https://example.com/admin', {
      body: new URLSearchParams({ sellerId: 'seller-1', status }),
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
  updateSellerStatusMock.mockResolvedValue(seller('approved'));
});

describe('/admin seller status action', () => {
  it('recusa a lojista that was never approved', async () => {
    getSellerByIdMock.mockResolvedValue(seller('pending'));

    const response = await action(postStatus('rejected'));

    expect(response.status).toBe(302);
    expect(updateSellerStatusMock).toHaveBeenCalledWith('seller-1', {
      status: 'rejected',
      approvedAt: null,
      approvedBy: null,
      rejectedReason: null,
    });
  });

  it('refuses to recusar a lojista that is already approved', async () => {
    getSellerByIdMock.mockResolvedValue(seller('approved'));

    const response = await action(postStatus('rejected'));

    expect(response.status).toBe(409);
    expect(updateSellerStatusMock).not.toHaveBeenCalled();
  });

  it('suspends an approved lojista', async () => {
    getSellerByIdMock.mockResolvedValue(seller('approved'));

    const response = await action(postStatus('suspended'));

    expect(response.status).toBe(302);
    expect(updateSellerStatusMock).toHaveBeenCalledWith(
      'seller-1',
      expect.objectContaining({ status: 'suspended' }),
    );
  });

  it('reactivates a suspended lojista', async () => {
    getSellerByIdMock.mockResolvedValue(seller('suspended'));

    const response = await action(postStatus('approved'));

    expect(response.status).toBe(302);
    expect(updateSellerStatusMock).toHaveBeenCalledWith(
      'seller-1',
      expect.objectContaining({
        status: 'approved',
        approvedBy: admin.email,
      }),
    );
  });

  it('refuses to suspend a pending lojista', async () => {
    getSellerByIdMock.mockResolvedValue(seller('pending'));

    const response = await action(postStatus('suspended'));

    expect(response.status).toBe(409);
    expect(updateSellerStatusMock).not.toHaveBeenCalled();
  });
});
