import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { buildApproveSellerToken } from '~/server/signed-token';
import { action, loader } from './admin.approve';
import {
  consumeEmailActionToken,
  getSellerByEmail,
  insertAdminAuditEvent,
  updateSellerStatus,
} from '~/server/db/queries';
import { getServerEnv } from '~/server/env';

vi.mock('~/server/db/queries', () => ({
  consumeEmailActionToken: vi.fn(),
  getSellerByEmail: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
  updateSellerStatus: vi.fn(),
}));
vi.mock('~/server/env', () => ({ getServerEnv: vi.fn() }));
vi.mock('~/server/resend', () => ({ sendResendEmail: vi.fn() }));

const secret = 'approval-link-secret';
const seller = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'seller@example.com',
  companyName: 'Seller Co',
  status: 'pending' as const,
  approvedAt: null,
  approvedBy: null,
  rejectedReason: null,
};

const consumeEmailActionTokenMock = vi.mocked(consumeEmailActionToken);
const getSellerByEmailMock = vi.mocked(getSellerByEmail);
const getServerEnvMock = vi.mocked(getServerEnv);
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const updateSellerStatusMock = vi.mocked(updateSellerStatus);

beforeEach(() => {
  vi.resetAllMocks();
  getServerEnvMock.mockReturnValue({
    approvalLinkSecret: secret,
    resendApiKey: null,
    siteUrl: 'https://example.com',
  } as ReturnType<typeof getServerEnv>);
  getSellerByEmailMock.mockResolvedValue(seller as never);
  updateSellerStatusMock.mockResolvedValue({
    ...seller,
    status: 'approved',
  } as never);
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('/admin/approve', () => {
  it('does not mutate seller status while rendering the approval page', async () => {
    const token = buildApproveSellerToken({ email: seller.email }, secret);
    const response = await loader({
      request: new Request(`https://example.com/admin/approve?token=${token}`),
    } as LoaderFunctionArgs);

    expect(await response.json()).toMatchObject({
      ok: true,
      email: seller.email,
      status: 'pending',
    });
    expect(updateSellerStatusMock).not.toHaveBeenCalled();
  });

  it('consumes a valid approval token before approving exactly once', async () => {
    const token = buildApproveSellerToken({ email: seller.email }, secret);
    consumeEmailActionTokenMock
      .mockResolvedValueOnce({ sellerId: seller.id } as never)
      .mockResolvedValueOnce(null);

    const form = () =>
      new URLSearchParams({ intent: 'confirm-approval', token }).toString();
    const first = await action({
      request: new Request('https://example.com/admin/approve', {
        method: 'POST',
        body: form(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    } as ActionFunctionArgs);
    const second = await action({
      request: new Request('https://example.com/admin/approve', {
        method: 'POST',
        body: form(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    } as ActionFunctionArgs);

    expect(await first.json()).toMatchObject({ ok: true, status: 'approved' });
    expect(await second.json()).toMatchObject({
      ok: false,
      error: 'token_used',
    });
    expect(updateSellerStatusMock).toHaveBeenCalledTimes(1);
    expect(consumeEmailActionTokenMock).toHaveBeenCalledTimes(2);
    expect(
      consumeEmailActionTokenMock.mock.invocationCallOrder[0],
    ).toBeLessThan(updateSellerStatusMock.mock.invocationCallOrder[0]);
  });
});
