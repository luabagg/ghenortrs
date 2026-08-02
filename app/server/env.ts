export type ServerEnv = {
  siteUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  resendApiKey: string | null;
  resendToEmail: string | null;
  resendFrom: string;
  blingClientId: string | null;
  blingClientSecret: string | null;
  blingRedirectUri: string | null;
  blingApiBase: string;
  blingAuthBase: string;
  adminApproveSecret: string | null;
  defaultMinQuantity: number;
};

function read(name: string): string | null {
  const value = process.env[name];
  if (!value || !value.trim()) return null;
  return value.trim();
}

function requireEnv(name: string): string {
  const value = read(name);
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getServerEnv(): ServerEnv {
  const defaultMin = Number(process.env.B2B_DEFAULT_MIN_QUANTITY ?? '6');
  return {
    siteUrl: read('SITE_URL') ?? read('VITE_SITE_URL') ?? 'http://localhost:5173',
    supabaseUrl: requireEnv('SUPABASE_URL'),
    supabaseAnonKey: requireEnv('SUPABASE_ANON_KEY'),
    supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    resendApiKey: read('RESEND_API_KEY'),
    resendToEmail: read('RESEND_TO_EMAIL'),
    resendFrom:
      read('RESEND_FROM') ?? 'GHENO B2B <noreply@ghenortrs.com.br>',
    blingClientId: read('BLING_CLIENT_ID'),
    blingClientSecret: read('BLING_CLIENT_SECRET'),
    blingRedirectUri: read('BLING_REDIRECT_URI'),
    blingApiBase: read('BLING_API_BASE') ?? 'https://api.bling.com.br/Api/v3',
    blingAuthBase: read('BLING_AUTH_BASE') ?? 'https://www.bling.com.br/Api/v3/oauth',
    adminApproveSecret: read('B2B_ADMIN_APPROVE_SECRET'),
    defaultMinQuantity:
      Number.isFinite(defaultMin) && defaultMin > 0 ? defaultMin : 6,
  };
}

export function getOptionalServerEnv(): Partial<ServerEnv> & {
  siteUrl: string;
  resendFrom: string;
  blingApiBase: string;
  blingAuthBase: string;
  defaultMinQuantity: number;
} {
  try {
    return getServerEnv();
  } catch {
    const defaultMin = Number(process.env.B2B_DEFAULT_MIN_QUANTITY ?? '6');
    return {
      siteUrl: read('SITE_URL') ?? read('VITE_SITE_URL') ?? 'http://localhost:5173',
      supabaseUrl: read('SUPABASE_URL') ?? undefined,
      supabaseAnonKey: read('SUPABASE_ANON_KEY') ?? undefined,
      supabaseServiceRoleKey: read('SUPABASE_SERVICE_ROLE_KEY') ?? undefined,
      resendApiKey: read('RESEND_API_KEY'),
      resendToEmail: read('RESEND_TO_EMAIL'),
      resendFrom:
        read('RESEND_FROM') ?? 'GHENO B2B <noreply@ghenortrs.com.br>',
      blingClientId: read('BLING_CLIENT_ID'),
      blingClientSecret: read('BLING_CLIENT_SECRET'),
      blingRedirectUri: read('BLING_REDIRECT_URI'),
      blingApiBase: read('BLING_API_BASE') ?? 'https://api.bling.com.br/Api/v3',
      blingAuthBase:
        read('BLING_AUTH_BASE') ?? 'https://www.bling.com.br/Api/v3/oauth',
      adminApproveSecret: read('B2B_ADMIN_APPROVE_SECRET'),
      defaultMinQuantity:
        Number.isFinite(defaultMin) && defaultMin > 0 ? defaultMin : 6,
    };
  }
}
