export const B2B_DEFAULT_MIN_QUANTITY = Number(
  import.meta.env.VITE_B2B_DEFAULT_MIN_QUANTITY ?? 6,
);

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as
  | string
  | undefined;

export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  (typeof window !== 'undefined' ? window.location.origin : '');

export function isB2BAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  // Prefer same-origin /api in production (Vercel).
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalized}`;
  }
  const base = (import.meta.env.VITE_SITE_URL as string | undefined) ?? '';
  return `${base.replace(/\/$/, '')}${normalized}`;
}
