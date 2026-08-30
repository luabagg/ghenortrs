import { redirect } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { isAdminEmail } from './admin-emails';
import { getServerEnv } from './env';
import { createSupabaseRequestClient } from './supabase-ssr.server';

export async function requireAdmin(request: Request): Promise<{
  user: User;
  supabase: SupabaseClient;
  headers: Headers;
}> {
  const { supabase, headers } = createSupabaseRequestClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/admin/login', { headers });
  }

  const env = getServerEnv();
  if (!isAdminEmail(user.email, env.adminEmails)) {
    await supabase.auth.signOut();
    throw redirect('/admin/login?error=forbidden', { headers });
  }

  return { user, supabase, headers };
}
