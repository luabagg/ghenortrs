import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { isAdminEmail } from '~/server/admin-emails';
import { getServerEnv } from '~/server/env';
import { createSupabaseRequestClient } from '~/server/supabase-ssr.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return redirect('/admin/login');
  }

  const { supabase, headers } = createSupabaseRequestClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirect('/admin/login', { headers });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email, getServerEnv().adminEmails)) {
    await supabase.auth.signOut();
    return redirect('/admin/login?error=forbidden', { headers });
  }

  return redirect('/admin', { headers });
};
