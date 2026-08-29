import { describe, expect, it } from 'vitest';

import { findAuthUserIdByEmail } from './supabase';

function fakeAdmin(pages: Array<Array<{ id: string; email?: string | null }>>) {
  return {
    auth: {
      admin: {
        createUser: async () => ({
          data: { user: null },
          error: { message: 'unused' },
        }),
        listUsers: async ({ page }: { page: number; perPage: number }) => ({
          data: { users: pages[page - 1] ?? [] },
        }),
      },
    },
  };
}

describe('findAuthUserIdByEmail', () => {
  it('finds a user beyond the first page', async () => {
    const page1 = Array.from({ length: 200 }, (_, index) => ({
      id: `u-${index}`,
      email: `user${index}@example.com`,
    }));
    const admin = fakeAdmin([
      page1,
      [{ id: 'found', email: 'loja@example.com' }],
    ]);

    await expect(
      findAuthUserIdByEmail(admin, 'Loja@Example.com'),
    ).resolves.toBe('found');
  });

  it('returns null when the email is absent', async () => {
    const admin = fakeAdmin([[{ id: 'a', email: 'other@example.com' }]]);
    await expect(
      findAuthUserIdByEmail(admin, 'loja@example.com'),
    ).resolves.toBeNull();
  });
});
