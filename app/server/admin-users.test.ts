import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  countAdminUsers,
  createAdminUser,
  deleteAdminUser,
  insertAdminAuditEvent,
  isAdminUser,
} from './db/queries';
import { getServerEnv } from './env';
import { addAdmin, ensureAdminUser, removeAdmin } from './admin-users';
import { createAuthAdminClient, findAuthUserIdByEmail } from './supabase';

vi.mock('./db/queries', () => ({
  countAdminUsers: vi.fn(),
  createAdminUser: vi.fn(),
  deleteAdminUser: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
  isAdminUser: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
vi.mock('./supabase', () => ({
  createAuthAdminClient: vi.fn(),
  findAuthUserIdByEmail: vi.fn(),
}));

const countAdminUsersMock = vi.mocked(countAdminUsers);
const createAdminUserMock = vi.mocked(createAdminUser);
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const isAdminUserMock = vi.mocked(isAdminUser);
const getServerEnvMock = vi.mocked(getServerEnv);
const deleteAdminUserMock = vi.mocked(deleteAdminUser);
const findAuthUserIdByEmailMock = vi.mocked(findAuthUserIdByEmail);

const bootstrapUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'bootstrap@gheno.com',
};
const otherUser = {
  id: '00000000-0000-0000-0000-000000000002',
  email: 'other@gheno.com',
};

beforeEach(() => {
  vi.resetAllMocks();
  getServerEnvMock.mockReturnValue({
    adminBootstrapEmails: [bootstrapUser.email],
  } as ReturnType<typeof getServerEnv>);
  isAdminUserMock.mockResolvedValue(false);
  countAdminUsersMock.mockResolvedValue(0);
  createAdminUserMock.mockResolvedValue(undefined);
  insertAdminAuditEventMock.mockResolvedValue({} as never);
});

describe('ensureAdminUser', () => {
  it('bootstraps only the configured first admin while no role exists', async () => {
    expect(await ensureAdminUser(bootstrapUser)).toBe(true);
    expect(await ensureAdminUser(otherUser)).toBe(false);

    expect(createAdminUserMock).toHaveBeenCalledWith({
      userId: bootstrapUser.id,
      email: bootstrapUser.email,
    });
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith({
      actorUserId: bootstrapUser.id,
      actorEmail: bootstrapUser.email,
      action: 'admin.bootstrap',
    });
  });

  it('does not consult bootstrap emails after an admin exists', async () => {
    countAdminUsersMock.mockResolvedValue(1);

    expect(await ensureAdminUser(bootstrapUser)).toBe(false);
    expect(createAdminUserMock).not.toHaveBeenCalled();
    expect(insertAdminAuditEventMock).not.toHaveBeenCalled();
  });

  it('allows a user with an existing role', async () => {
    isAdminUserMock.mockResolvedValue(true);

    expect(await ensureAdminUser(otherUser)).toBe(true);
    expect(countAdminUsersMock).not.toHaveBeenCalled();
  });
});

describe('admin role management', () => {
  const actor = { id: bootstrapUser.id, email: bootstrapUser.email };
  const authAdmin = {};

  beforeEach(() => {
    vi.mocked(createAuthAdminClient).mockReturnValue(authAdmin as never);
  });

  it('grants the role to an existing Supabase user', async () => {
    findAuthUserIdByEmailMock.mockResolvedValue(otherUser.id);
    isAdminUserMock.mockResolvedValue(false);

    await expect(
      addAdmin({ actor, email: ' Other@Gheno.com ' }),
    ).resolves.toEqual({ ok: true });

    expect(findAuthUserIdByEmailMock).toHaveBeenCalledWith(
      authAdmin,
      'other@gheno.com',
    );
    expect(createAdminUserMock).toHaveBeenCalledWith({
      userId: otherUser.id,
      email: 'other@gheno.com',
      createdBy: actor.id,
    });
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'admin.role.granted' }),
    );
  });

  it('refuses an email without a Supabase user', async () => {
    findAuthUserIdByEmailMock.mockResolvedValue(null);

    await expect(
      addAdmin({ actor, email: 'ghost@gheno.com' }),
    ).resolves.toEqual({ ok: false, error: 'user_not_found' });
    expect(createAdminUserMock).not.toHaveBeenCalled();
  });

  it('refuses a user that already holds the role', async () => {
    findAuthUserIdByEmailMock.mockResolvedValue(otherUser.id);
    isAdminUserMock.mockResolvedValue(true);

    await expect(addAdmin({ actor, email: otherUser.email })).resolves.toEqual({
      ok: false,
      error: 'already_admin',
    });
    expect(createAdminUserMock).not.toHaveBeenCalled();
  });

  it('prevents deleting the final administrator', async () => {
    countAdminUsersMock.mockResolvedValue(1);

    await expect(removeAdmin({ actor, userId: actor.id })).resolves.toEqual({
      ok: false,
      error: 'last_admin',
    });
    expect(deleteAdminUserMock).not.toHaveBeenCalled();
  });

  it('revokes the role and audits it', async () => {
    countAdminUsersMock.mockResolvedValue(2);
    deleteAdminUserMock.mockResolvedValue(true);

    await expect(removeAdmin({ actor, userId: otherUser.id })).resolves.toEqual(
      { ok: true },
    );
    expect(insertAdminAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'admin.role.revoked',
        metadata: { targetUserId: otherUser.id },
      }),
    );
  });

  it('reports a user that does not hold the role', async () => {
    countAdminUsersMock.mockResolvedValue(2);
    deleteAdminUserMock.mockResolvedValue(false);

    await expect(removeAdmin({ actor, userId: otherUser.id })).resolves.toEqual(
      { ok: false, error: 'not_admin' },
    );
  });
});
