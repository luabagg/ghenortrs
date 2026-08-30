import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { createSupabaseRequestClient } from '~/server/supabase-ssr.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers } = createSupabaseRequestClient(request);
  await supabase.auth.signOut();
  return redirect('/admin/login', { headers });
};
