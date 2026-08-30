/**
 * Sellers reach the app through two different link shapes.
 *
 * 1. A link the seller requested themselves is PKCE: it lands on
 *    `emailRedirectTo` (`/b2b?code=`). If that URL is not on the Supabase
 *    allowlist, Auth falls back to Site URL (`/?code=`). The homepage never
 *    creates a browser client, so the code is never exchanged.
 * 2. A link an admin generated (the Enviar acesso button) cannot be PKCE,
 *    because no verifier exists in the seller's browser. Supabase verifies it
 *    on its own domain and returns the session in the URL **hash**:
 *    `/b2b/catalogo#access_token=…&refresh_token=…`.
 *
 * Admin (`/admin/login/callback`) and Bling OAuth keep their own handlers.
 */

const SELLER_AUTH_HOME = '/b2b';

export function isForeignAuthCallbackPath(pathname: string): boolean {
  return (
    pathname === '/admin/login/callback' ||
    pathname.startsWith('/admin/login/callback/') ||
    pathname === '/api/bling-oauth-callback' ||
    pathname.startsWith('/api/bling-oauth-callback/')
  );
}

function isSellerAuthPath(pathname: string): boolean {
  return (
    pathname === SELLER_AUTH_HOME || pathname.startsWith(`${SELLER_AUTH_HOME}/`)
  );
}

export function sellerPkceCode(url: URL): string | null {
  if (isForeignAuthCallbackPath(url.pathname)) return null;
  const code = url.searchParams.get('code');
  return code && code.trim() ? code : null;
}

export function sellerAuthCallbackRedirect(url: URL): string | null {
  const code = sellerPkceCode(url);
  if (!code) return null;
  if (isSellerAuthPath(url.pathname)) return null;
  return `${SELLER_AUTH_HOME}${url.search}${url.hash}`;
}

export type SellerAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function parseHashParams(hash: string): URLSearchParams {
  return new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
}

/** Session handed over in the hash by an admin-generated access link. */
export function sellerImplicitTokens(url: URL): SellerAuthTokens | null {
  if (isForeignAuthCallbackPath(url.pathname)) return null;

  const params = parseHashParams(url.hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

/** Drops the one-time credential so a refresh cannot replay it. */
export function stripSellerAuthParams(url: URL): string {
  const next = new URL(url.href);
  next.searchParams.delete('code');
  next.hash = '';
  const search = next.searchParams.toString();
  return `${next.pathname}${search ? `?${search}` : ''}`;
}
