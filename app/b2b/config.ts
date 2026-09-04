function readPublicEnv(name: string): string | undefined {
  // Remix/Vite expose public vars as process.env and import.meta.env.
  const fromProcess =
    typeof process !== 'undefined' ? process.env[name] : undefined;
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();

  try {
    const meta = import.meta.env as Record<string, string | undefined>;
    const value = meta[name];
    if (value && value.trim()) return value.trim();
  } catch {
    // import.meta may be unavailable in some Node contexts
  }
  return undefined;
}

export const B2B_MINIMUM_ORDER_QUANTITY = Number(
  readPublicEnv('VITE_B2B_DEFAULT_MIN_QUANTITY') ??
    readPublicEnv('B2B_DEFAULT_MIN_QUANTITY') ??
    6,
);

export const SUPABASE_URL =
  readPublicEnv('VITE_SUPABASE_URL') ?? readPublicEnv('SUPABASE_URL');

export const SUPABASE_ANON_KEY =
  readPublicEnv('VITE_SUPABASE_ANON_KEY') ?? readPublicEnv('SUPABASE_ANON_KEY');

export const SITE_URL =
  readPublicEnv('VITE_SITE_URL') ??
  readPublicEnv('SITE_URL') ??
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
  const base = SITE_URL || '';
  return `${base.replace(/\/$/, '')}${normalized}`;
}
