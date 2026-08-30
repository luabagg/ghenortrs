import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { listAdminAuditEvents } from '~/server/db/queries';
import { requireAdmin } from '~/server/require-admin.server';
import { formatAuditMetadata, loader } from './admin.atividade';

vi.mock('~/server/db/queries', () => ({ listAdminAuditEvents: vi.fn() }));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));

const listAdminAuditEventsMock = vi.mocked(listAdminAuditEvents);
const requireAdminMock = vi.mocked(requireAdmin);

function get(): LoaderFunctionArgs {
  return {
    request: new Request('https://example.com/admin/atividade'),
    context: {},
    params: {},
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  requireAdminMock.mockResolvedValue({
    user: { id: 'admin-1', email: 'admin@example.com' },
    headers: new Headers(),
  } as never);
  listAdminAuditEventsMock.mockResolvedValue([]);
});

describe('formatAuditMetadata', () => {
  it('shows only allowlisted fields', () => {
    expect(
      formatAuditMetadata({ tier: 'pro', updated: 3, visibleB2b: false }),
    ).toBe('tier: pro · updated: 3 · visibleB2b: false');
  });

  it('drops anything that is not allowlisted', () => {
    expect(
      formatAuditMetadata({
        accessToken: 'abc',
        actionLink: 'https://example.com/x',
        oauthCode: '123',
        secret: 'shh',
        updated: 1,
      }),
    ).toBe('updated: 1');
  });

  it('returns nothing for empty or non-object metadata', () => {
    expect(formatAuditMetadata({})).toBe('');
    expect(formatAuditMetadata(null)).toBe('');
    expect(formatAuditMetadata(['secret'])).toBe('');
  });
});

describe('/admin/atividade loader', () => {
  it('lists events with a safe summary', async () => {
    listAdminAuditEventsMock.mockResolvedValue([
      {
        id: 'event-1',
        actorUserId: 'admin-1',
        actorEmail: 'admin@example.com',
        action: 'price_list.import',
        targetSellerId: null,
        targetProductId: null,
        metadata: { tier: 'pro', updated: 4, accessToken: 'abc' },
        outcome: 'success',
        createdAt: '2026-08-30T13:00:00.000Z',
      },
    ]);

    const response = await loader(get());
    const { events } = await response.json();

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      action: 'price_list.import',
      actor: 'admin@example.com',
      details: 'tier: pro · updated: 4',
      outcome: 'success',
    });
    expect(JSON.stringify(events)).not.toContain('abc');
  });

  it('never lists events without an admin session', async () => {
    requireAdminMock.mockRejectedValue(redirect('/admin/login'));

    await expect(loader(get())).rejects.toEqual(
      expect.objectContaining({ status: 302 }),
    );
    expect(listAdminAuditEventsMock).not.toHaveBeenCalled();
  });
});
