/**
 * Captures Supabase's magic-link failure redirect so the app can show a
 * clear Portuguese message instead of silently dropping the error.
 *
 * Supabase's email link verification runs on Supabase's own domain and
 * redirects back to `emailRedirectTo` (here, `/b2b`). On success it appends
 * `?code=...` (PKCE); on failure — expired, already used, or invalid link —
 * it appends an error to the URL **hash**: `#error=...&error_code=...
 * &error_description=...` (see Supabase's redirect-urls guide). The
 * Supabase client also inspects the URL on init (`detectSessionInUrl`), so
 * `captureAuthRedirectError` must run before that client is ever created —
 * it is called once, synchronously, in `entry.client.tsx` — to read and
 * strip the raw hash first.
 */

export type AuthRedirectError = {
  code: string | null;
  description: string | null;
};

let pendingError: AuthRedirectError | null = null;

function parseHashParams(hash: string): URLSearchParams {
  return new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
}

export function captureAuthRedirectError(): void {
  if (typeof window === 'undefined') return;

  const params = parseHashParams(window.location.hash);
  const error = params.get('error');
  if (!error) return;

  pendingError = {
    code: params.get('error_code'),
    description: params.get('error_description'),
  };

  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(window.history.state, '', url.toString());
}

/**
 * `useSyncExternalStore` bindings so React can read this module-level value
 * safely across SSR/hydration: `getServerSnapshot` always returns `null`
 * (the server never sees the redirect hash), and React reconciles to the
 * real client snapshot right after hydration without a manual effect.
 */
export function subscribeAuthRedirectError(): () => void {
  // The value is set once (before hydration) and only ever cleared
  // afterwards; there is no later external event to subscribe to.
  return () => {};
}

export function getAuthRedirectErrorSnapshot(): AuthRedirectError | null {
  return pendingError;
}

export function getAuthRedirectErrorServerSnapshot(): AuthRedirectError | null {
  return null;
}

/** Clears the captured error so revisiting the page won't show it again. */
export function clearAuthRedirectError(): void {
  pendingError = null;
}

const ERROR_COPY: Record<string, string> = {
  otp_expired: 'O link de acesso expirou. Solicite um novo link abaixo.',
  access_denied:
    'Não foi possível confirmar o link de acesso. Solicite um novo link abaixo.',
};

export function describeAuthRedirectError(error: AuthRedirectError): string {
  return (
    (error.code ? ERROR_COPY[error.code] : undefined) ??
    'Este link de acesso é inválido ou já foi usado. Solicite um novo link abaixo.'
  );
}
