import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSellerById, insertAdminAuditEvent } from './db/queries';
import { getServerEnv } from './env';
import { buildSellerCatalogAccessHtml, sendResendEmail } from './resend';
import { createAuthAdminClient } from './supabase';
import { sendSellerCatalogAccessLink } from './seller-access-link';

vi.mock('./db/queries', () => ({
  getSellerById: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
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

const createAuthAdminClientMock = vi.mocked(createAuthAdminClient);
const getSellerByIdMock = vi.mocked(getSellerById);
const getServerEnvMock = vi.mocked(getServerEnv);
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const buildSellerCatalogAccessHtmlMock = vi.mocked(
  buildSellerCatalogAccessHtml,
);
const sendResendEmailMock = vi.mocked(sendResendEmail);

beforeEach(() => {
  vi.resetAllMocks();
  getServerEnvMock.mockReturnValue({
    siteUrl: 'https://gheno.example',
  } as ReturnType<typeof getServerEnv>);
  buildSellerCatalogAccessHtmlMock.mockReturnValue('<html>access</html>');
  sendResendEmailMock.mockResolvedValue({ ok: true });
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('sendSellerCatalogAccessLink', () => {
  it('sends a Supabase magic link only for an approved seller', async () => {
    const generateLink = vi.fn().mockResolvedValue({
      data: { properties: { action_link: 'https://supabase.example/link' } },
      error: null,
    });
    createAuthAdminClientMock.mockReturnValue({
      auth: { admin: { generateLink } },
    } as never);
    getSellerByIdMock.mockResolvedValue(approved as never);

    await expect(
      sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
    ).resolves.toEqual({ ok: true });

    expect(generateLink).toHaveBeenCalledWith({
      type: 'magiclink',
      email: approved.email,
      options: { redirectTo: 'https://gheno.example/b2b/catalogo' },
    });
    expect(sendResendEmailMock).toHaveBeenCalledWith({
      to: approved.email,
      subject: 'Acesso ao catálogo B2B GHENO',
      html: '<html>access</html>',
    });
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith({
      actorUserId: actor.id,
      actorEmail: actor.email,
      action: 'seller.access_link.sent',
      targetSellerId: approved.id,
      metadata: { destinationPath: '/b2b/catalogo' },
      outcome: 'success',
    });
  });

  it.each(['pending', 'rejected', 'suspended'] as const)(
    'refuses %s sellers',
    async (status) => {
      getSellerByIdMock.mockResolvedValue({ ...approved, status } as never);

      await expect(
        sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
      ).resolves.toEqual({ ok: false, error: 'seller_not_approved' });
      expect(createAuthAdminClientMock).not.toHaveBeenCalled();
    },
  );
});
