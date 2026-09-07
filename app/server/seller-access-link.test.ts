import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  consumeEmailActionToken,
  getSellerByEmail,
  getSellerById,
  insertAdminAuditEvent,
  reserveRateLimitedEmailActionToken,
} from './db/queries';
import { getServerEnv } from './env';
import { buildSellerCatalogAccessHtml, sendResendEmail } from './resend';
import {
  inspectSellerCatalogAccessToken,
  redeemSellerCatalogAccessToken,
  requestSellerCatalogAccessLink,
  sendSellerCatalogAccessLink,
} from './seller-access-link';
import { createAuthAdminClient } from './supabase';

vi.mock('./db/queries', () => ({
  consumeEmailActionToken: vi.fn(),
  getSellerByEmail: vi.fn(),
  getSellerById: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
  reserveRateLimitedEmailActionToken: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
vi.mock('./resend', () => ({
  buildSellerCatalogAccessHtml: vi.fn(),
  sendResendEmail: vi.fn(),
}));
vi.mock('./supabase', () => ({ createAuthAdminClient: vi.fn() }));

const approved = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'seller@example.com',
  companyName: 'Seller Co',
  status: 'approved',
};
const actor = {
  id: '00000000-0000-0000-0000-000000000010',
  email: 'admin@example.com',
};
const secret = 'email-action-secret';

const consumeEmailActionTokenMock = vi.mocked(consumeEmailActionToken);
const createAuthAdminClientMock = vi.mocked(createAuthAdminClient);
const getSellerByEmailMock = vi.mocked(getSellerByEmail);
const getSellerByIdMock = vi.mocked(getSellerById);
const getServerEnvMock = vi.mocked(getServerEnv);
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const reserveRateLimitedEmailActionTokenMock = vi.mocked(
  reserveRateLimitedEmailActionToken,
);
const buildSellerCatalogAccessHtmlMock = vi.mocked(
  buildSellerCatalogAccessHtml,
);
const sendResendEmailMock = vi.mocked(sendResendEmail);

beforeEach(() => {
  vi.resetAllMocks();
  getServerEnvMock.mockReturnValue({
    emailActionSecret: secret,
    siteUrl: 'https://gheno.example',
  } as ReturnType<typeof getServerEnv>);
  buildSellerCatalogAccessHtmlMock.mockReturnValue('<html>access</html>');
  sendResendEmailMock.mockResolvedValue({ ok: true });
  insertAdminAuditEventMock.mockResolvedValue({} as never);
  reserveRateLimitedEmailActionTokenMock.mockResolvedValue(true);
});

describe('seller catalog access links', () => {
  it('sends a scan-safe application link through Resend', async () => {
    getSellerByIdMock.mockResolvedValue(approved as never);

    await expect(
      sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
    ).resolves.toEqual({ ok: true });

    expect(createAuthAdminClientMock).not.toHaveBeenCalled();
    expect(buildSellerCatalogAccessHtmlMock).toHaveBeenCalledWith({
      companyName: approved.companyName,
      accessUrl: expect.stringMatching(
        /^https:\/\/gheno\.example\/b2b\/acesso\?token=.+/,
      ),
    });
    expect(sendResendEmailMock).toHaveBeenCalledWith({
      to: approved.email,
      subject: 'Acesso ao catálogo B2B GHENO',
      html: '<html>access</html>',
    });
  });

  it('stops after five reserved access emails per minute', async () => {
    getSellerByIdMock.mockResolvedValue(approved as never);
    reserveRateLimitedEmailActionTokenMock.mockResolvedValue(false);

    await expect(
      sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
    ).resolves.toEqual({ ok: false, error: 'rate_limited' });

    expect(sendResendEmailMock).not.toHaveBeenCalled();
  });

  it.each(['pending', 'rejected', 'suspended'] as const)(
    'refuses %s sellers',
    async (status) => {
      getSellerByIdMock.mockResolvedValue({ ...approved, status } as never);

      await expect(
        sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
      ).resolves.toEqual({ ok: false, error: 'seller_not_approved' });
      expect(sendResendEmailMock).not.toHaveBeenCalled();
    },
  );

  it('does not reveal whether a public email is approved', async () => {
    getSellerByEmailMock.mockResolvedValue(null);

    await expect(
      requestSellerCatalogAccessLink('missing@example.com'),
    ).resolves.toEqual({ ok: true });
    expect(sendResendEmailMock).not.toHaveBeenCalled();

    getSellerByEmailMock.mockResolvedValue({
      ...approved,
      status: 'pending',
    } as never);
    await expect(
      requestSellerCatalogAccessLink(approved.email),
    ).resolves.toEqual({ ok: true });
    expect(sendResendEmailMock).not.toHaveBeenCalled();
  });

  it('validates without generating a Supabase link on page load', async () => {
    getSellerByIdMock.mockResolvedValue(approved as never);
    await sendSellerCatalogAccessLink({ sellerId: approved.id, actor });
    const accessUrl = vi.mocked(buildSellerCatalogAccessHtml).mock.calls[0][0]
      .accessUrl;
    const token = new URL(accessUrl).searchParams.get('token');

    await expect(inspectSellerCatalogAccessToken(token)).resolves.toEqual({
      ok: true,
      companyName: approved.companyName,
    });
    expect(createAuthAdminClientMock).not.toHaveBeenCalled();
  });

  it('consumes the application token before generating a Supabase link', async () => {
    getSellerByIdMock.mockResolvedValue(approved as never);
    await sendSellerCatalogAccessLink({ sellerId: approved.id, actor });
    const accessUrl = vi.mocked(buildSellerCatalogAccessHtml).mock.calls[0][0]
      .accessUrl;
    const token = new URL(accessUrl).searchParams.get('token');
    consumeEmailActionTokenMock.mockResolvedValue({
      sellerId: approved.id,
    } as never);
    const generateLink = vi.fn().mockResolvedValue({
      data: { properties: { action_link: 'https://supabase.example/link' } },
      error: null,
    });
    createAuthAdminClientMock.mockReturnValue({
      auth: { admin: { generateLink } },
    } as never);

    await expect(redeemSellerCatalogAccessToken(token)).resolves.toEqual({
      ok: true,
      actionLink: 'https://supabase.example/link',
    });

    expect(consumeEmailActionTokenMock).toHaveBeenCalledOnce();
    expect(
      consumeEmailActionTokenMock.mock.invocationCallOrder[0],
    ).toBeLessThan(generateLink.mock.invocationCallOrder[0]);
    expect(generateLink).toHaveBeenCalledWith({
      type: 'magiclink',
      email: approved.email,
      options: { redirectTo: 'https://gheno.example/b2b/catalogo' },
    });
  });
});
