import {
  createClient,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';

import { sellerPkceCode, stripPkceCode } from '@/b2b/auth-callback';
import {
  isB2BAuthConfigured,
  SITE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '@/b2b/config';

let client: SupabaseClient | null = null;
let consumeInFlight: Promise<void> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isB2BAuthConfigured()) return null;
  if (client) return client;
  client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Exchange is explicit in consumeSellerAuthCode. Auto-detect races
      // getSession() and can consume the one-time PKCE code twice.
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  });
  return client;
}

async function consumeSellerAuthCode(supabase: SupabaseClient): Promise<void> {
  if (typeof window === 'undefined') return;
  if (consumeInFlight) {
    await consumeInFlight;
    return;
  }

  consumeInFlight = (async () => {
    const url = new URL(window.location.href);
    const code = sellerPkceCode(url);
    if (!code) return;

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    window.history.replaceState(window.history.state, '', stripPkceCode(url));
    if (error) {
      console.error('seller PKCE exchange failed', error.message);
    }
  })();

  try {
    await consumeInFlight;
  } finally {
    consumeInFlight = null;
  }
}

export async function getBrowserSession(): Promise<Session | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  await consumeSellerAuthCode(supabase);
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

  // PKCE stores the verifier in this browser. Redirect must match the
  // origin that requested the link — never a baked localhost SITE_URL.
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : SITE_URL;
  if (!origin) {
    return { ok: false, error: 'auth_unconfigured' };
  }
  const redirectTo = `${origin.replace(/\/$/, '')}/b2b`;
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
