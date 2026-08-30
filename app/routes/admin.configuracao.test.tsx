import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addAdmin, removeAdmin } from '~/server/admin-users';
import { requireAdmin } from '~/server/require-admin.server';
import { action } from './admin.configuracao';

vi.mock('~/server/admin-users', () => ({
  addAdmin: vi.fn(),
  removeAdmin: vi.fn(),
}));
vi.mock('~/server/db/queries', () => ({ listAdminUsers: vi.fn() }));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));

const addAdminMock = vi.mocked(addAdmin);
const removeAdminMock = vi.mocked(removeAdmin);
const requireAdminMock = vi.mocked(requireAdmin);

const admin = { id: 'admin-1', email: 'admin@example.com' };

function post(fields: Record<string, string>): ActionFunctionArgs {
  return {
    request: new Request('https://example.com/admin/configuracao', {
      body: new URLSearchParams(fields),
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
});

describe('/admin/configuracao action', () => {
  it('grants the role for the signed-in admin', async () => {
    addAdminMock.mockResolvedValue({ ok: true });

    const response = await action(
      post({ email: 'new@example.com', intent: 'add-admin' }),
    );

    expect(addAdminMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      email: 'new@example.com',
    });
    expect(response.status).toBe(200);
  });

  it('reports that the final administrator cannot be removed', async () => {
    removeAdminMock.mockResolvedValue({ ok: false, error: 'last_admin' });

    const response = await action(
      post({ intent: 'remove-admin', userId: admin.id }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'last_admin',
    });
  });

  it('refuses an unknown intent', async () => {
    const response = await action(post({ intent: 'whatever' }));

    expect(response.status).toBe(400);
    expect(addAdminMock).not.toHaveBeenCalled();
    expect(removeAdminMock).not.toHaveBeenCalled();
  });

  it('never changes roles without an admin session', async () => {
    requireAdminMock.mockRejectedValue(redirect('/admin/login'));

    await expect(
      action(post({ email: 'new@example.com', intent: 'add-admin' })),
    ).rejects.toEqual(expect.objectContaining({ status: 302 }));
    expect(addAdminMock).not.toHaveBeenCalled();
  });
});
