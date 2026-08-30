import type { User } from '@supabase/supabase-js';

import { isAdminEmail } from './admin-emails';
import {
  countAdminUsers,
  createAdminUser,
  insertAdminAuditEvent,
  isAdminUser,
} from './db/queries';
import { getServerEnv } from './env';

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
