import { useCallback, useEffect, useState } from 'react';

import { fetchB2BSession } from '@/b2b/api';
import { isB2BAuthConfigured } from '@/b2b/config';
import {
  getSupabaseBrowserClient,
  signOutBrowser,
} from '@/b2b/supabase-browser';
import type { B2BSessionResponse, SellerGate } from '@/b2b/types';

const emptySession: B2BSessionResponse = {
  authenticated: false,
  seller: null,
  gate: 'anonymous',
};

export function useB2BSession() {
  const configured = isB2BAuthConfigured();
  const [session, setSession] = useState<B2BSessionResponse>(emptySession);
  const [gate, setGate] = useState<SellerGate>(
    configured ? 'loading' : 'unconfigured',
  );
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((next: B2BSessionResponse) => {
    setSession(next);
    setGate(next.gate);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!configured) {
      setGate('unconfigured');
      setSession(emptySession);
      return;
    }
    try {
      const next = await fetchB2BSession();
      applySession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'session_failed');
      setGate('anonymous');
      setSession(emptySession);
    }
  }, [applySession, configured]);

  useEffect(() => {
    if (!configured) return;

    let cancelled = false;
    const supabase = getSupabaseBrowserClient();

    const load = () => {
      void fetchB2BSession()
        .then((next) => {
          if (cancelled) return;
          applySession(next);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : 'session_failed');
          setGate('anonymous');
          setSession(emptySession);
        });
    };

    // Defer so the effect body does not set state synchronously.
    const timer = window.setTimeout(load, 0);

    const subscription = supabase?.auth.onAuthStateChange(() => {
      window.setTimeout(load, 0);
    }).data.subscription;

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, [applySession, configured]);

  const signOut = useCallback(async () => {
    await signOutBrowser();
    setSession(emptySession);
    setGate(configured ? 'anonymous' : 'unconfigured');
  }, [configured]);

  return {
    configured,
    session,
    gate,
    error,
    refresh,
    signOut,
  };
}
