import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  countAdminUsers,
  createAdminUser,
  insertAdminAuditEvent,
  isAdminUser,
} from './db/queries';
import { getServerEnv } from './env';
import { ensureAdminUser } from './admin-users';

vi.mock('./db/queries', () => ({
  countAdminUsers: vi.fn(),
  createAdminUser: vi.fn(),
  insertAdminAuditEvent: vi.fn(),
  isAdminUser: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));

const countAdminUsersMock = vi.mocked(countAdminUsers);
const createAdminUserMock = vi.mocked(createAdminUser);
const insertAdminAuditEventMock = vi.mocked(insertAdminAuditEvent);
const isAdminUserMock = vi.mocked(isAdminUser);
const getServerEnvMock = vi.mocked(getServerEnv);

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
