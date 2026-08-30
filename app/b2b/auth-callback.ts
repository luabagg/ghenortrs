/**
 * Seller magic-link PKCE lands on `emailRedirectTo` (`/b2b?code=`).
 * If that URL is not on the Supabase allowlist, Auth falls back to Site URL
 * (`/?code=`). Homepage never creates a browser client, so the code is never
 * exchanged and the session never persists.
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
  return pathname === SELLER_AUTH_HOME || pathname.startsWith(`${SELLER_AUTH_HOME}/`);
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

export function stripPkceCode(url: URL): string {
  const next = new URL(url.href);
  next.searchParams.delete('code');
  const search = next.searchParams.toString();
  return `${next.pathname}${search ? `?${search}` : ''}${next.hash}`;
}
