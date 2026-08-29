import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { isB2BAuthConfigured } from '@/b2b/config';
import { b2bKeys, useB2BSessionQuery } from '@/b2b/queries';
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
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = useB2BSessionQuery();

  useEffect(() => {
    if (!configured) return;
    const supabase = getSupabaseBrowserClient();
    const subscription = supabase?.auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: b2bKeys.session });
    }).data.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, [configured, queryClient]);

  const refresh = useCallback(async () => {
    if (!configured) return;
    await refetch();
  }, [configured, refetch]);

  const signOut = useCallback(async () => {
    await signOutBrowser();
    queryClient.setQueryData(b2bKeys.session, emptySession);
    void queryClient.invalidateQueries({ queryKey: b2bKeys.session });
  }, [queryClient]);

  const session = isError ? emptySession : (data ?? emptySession);
  const gate: SellerGate = !configured
    ? 'unconfigured'
    : isPending
      ? 'loading'
      : session.gate;

  return {
    configured,
    session,
    gate,
    error: isError
      ? error instanceof Error
        ? error.message
        : 'session_failed'
      : null,
    refresh,
    signOut,
  };
}
