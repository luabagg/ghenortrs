import {
  createClient,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';

import {
  sellerImplicitTokens,
  sellerPkceCode,
  stripSellerAuthParams,
} from '@/b2b/auth-callback';
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
      // The handover is explicit in consumeSellerAuth. Auto-detect races
      // getSession() and can consume the one-time credential twice.
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  });
  return client;
}

/**
 * Accepts either link shape: the PKCE code the seller requested, or the
 * tokens an admin-generated access link leaves in the hash.
 */
async function consumeSellerAuth(supabase: SupabaseClient): Promise<void> {
  if (typeof window === 'undefined') return;
  if (consumeInFlight) {
    await consumeInFlight;
    return;
  }

  consumeInFlight = (async () => {
    const url = new URL(window.location.href);

    function finish(error: { message: string } | null): void {
      window.history.replaceState(
        window.history.state,
        '',
        stripSellerAuthParams(url),
      );
      if (error) console.error('seller sign-in failed', error.message);
    }

    const tokens = sellerImplicitTokens(url);
    if (tokens) {
      const { error } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
      finish(error);
      return;
    }

    const code = sellerPkceCode(url);
    if (!code) return;

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    finish(error);
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
  await consumeSellerAuth(supabase);
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
