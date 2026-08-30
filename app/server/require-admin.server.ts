import { redirect } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { ensureAdminUser } from './admin-users';
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

  if (!(await ensureAdminUser(user))) {
    await supabase.auth.signOut();
    throw redirect('/admin/login?error=forbidden', { headers });
  }

  return { user, supabase, headers };
}
