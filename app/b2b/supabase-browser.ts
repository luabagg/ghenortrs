import {
  createClient,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';

import {
  isB2BAuthConfigured,
  SITE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '@/b2b/config';

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isB2BAuthConfigured()) return null;
  if (client) return client;
  client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });
  return client;
}

export async function getBrowserSession(): Promise<Session | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requestMagicLink(email: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: 'auth_unconfigured' };
  }

  const redirectTo = `${SITE_URL.replace(/\/$/, '')}/b2b`;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signOutBrowser(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}
