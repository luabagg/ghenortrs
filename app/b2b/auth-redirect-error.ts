/**
 * Capture Supabase magic-link failure from the URL hash.
 * Show a clear Portuguese message. Do not drop the error silently.
 *
 * Supabase verifies on its domain, then redirects to `emailRedirectTo` (`/b2b`).
 * Success appends `?code=...` (PKCE).
 * Failure appends `#error=...&error_code=...&error_description=...`.
 *
 * Call `captureAuthRedirectError` once in `entry.client.tsx` before any
 * Supabase client. The client also reads the URL on init (`detectSessionInUrl`).
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
 * `useSyncExternalStore` bindings for this module value across SSR/hydration.
 * `getServerSnapshot` always returns `null`. React reconciles after hydration.
 */
export function subscribeAuthRedirectError(): () => void {
  // Set once before hydration. Cleared later. No other event to subscribe.
  return () => {};
}

export function getAuthRedirectErrorSnapshot(): AuthRedirectError | null {
  return pendingError;
}

export function getAuthRedirectErrorServerSnapshot(): AuthRedirectError | null {
  return null;
}

/** Clear the captured error so a revisit does not show it again. */
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
