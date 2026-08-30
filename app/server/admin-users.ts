import type { User } from '@supabase/supabase-js';

import { isAdminEmail } from './admin-emails';
import {
  countAdminUsers,
  createAdminUser,
  deleteAdminUser,
  insertAdminAuditEvent,
  isAdminUser,
} from './db/queries';
import { getServerEnv } from './env';
import { createAuthAdminClient, findAuthUserIdByEmail } from './supabase';

type Actor = {
  id: string;
  email?: string | null;
};

export type AdminRoleError =
  | 'invalid_email'
  | 'user_not_found'
  | 'already_admin'
  | 'last_admin'
  | 'not_admin';

export type AdminRoleResult =
  | { ok: true }
  | { ok: false; error: AdminRoleError };

export async function ensureAdminUser(
  user: Pick<User, 'id' | 'email'>,
): Promise<boolean> {
  if (await isAdminUser(user.id)) return true;
  if ((await countAdminUsers()) > 0) return false;

  const email = user.email?.trim().toLowerCase();
  if (!email || !isAdminEmail(email, getServerEnv().adminBootstrapEmails)) {
    return false;
  }

  await createAdminUser({ userId: user.id, email });
  await insertAdminAuditEvent({
    actorUserId: user.id,
    actorEmail: email,
    action: 'admin.bootstrap',
  });
  return true;
}

async function recordRoleAudit(
  actor: Actor,
  action: 'admin.role.granted' | 'admin.role.revoked',
  metadata: { targetUserId: string; targetEmail?: string },
): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: actor.id,
      actorEmail: actor.email ?? null,
      action,
      metadata,
    });
  } catch (error) {
    console.error('admin role audit failed', error);
  }
}

/** Grants the admin role to an existing Supabase user. */
export async function addAdmin(input: {
  actor: Actor;
  email: string;
}): Promise<AdminRoleResult> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes('@')) return { ok: false, error: 'invalid_email' };

  const userId = await findAuthUserIdByEmail(createAuthAdminClient(), email);
  if (!userId) return { ok: false, error: 'user_not_found' };
  if (await isAdminUser(userId)) return { ok: false, error: 'already_admin' };

  await createAdminUser({ userId, email, createdBy: input.actor.id });
  await recordRoleAudit(input.actor, 'admin.role.granted', {
    targetEmail: email,
    targetUserId: userId,
  });
  return { ok: true };
}

/** Revokes the admin role. The last administrator cannot be removed. */
export async function removeAdmin(input: {
  actor: Actor;
  userId: string;
}): Promise<AdminRoleResult> {
  if ((await countAdminUsers()) <= 1) return { ok: false, error: 'last_admin' };
  if (!(await deleteAdminUser(input.userId))) {
    return { ok: false, error: 'not_admin' };
  }

  await recordRoleAudit(input.actor, 'admin.role.revoked', {
    targetUserId: input.userId,
  });
  return { ok: true };
}
