import { z } from 'zod';

import { parseAdminEmails } from './admin-emails';

export type ServerEnv = {
  siteUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  databaseUrl: string;
  resendApiKey: string | null;
  resendToEmail: string | null;
  resendFrom: string;
  blingClientId: string | null;
  blingClientSecret: string | null;
  blingRedirectUri: string | null;
  blingApiBase: string;
  blingAuthBase: string;
  approvalLinkSecret: string | null;
  adminBootstrapEmails: string[];
  minimumOrderQuantity: number;
};

function normalizeEnvValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

function optionalEnv() {
  return z.preprocess(normalizeEnvValue, z.string().optional());
}

function requiredEnv(name: string) {
  return z.preprocess(
    normalizeEnvValue,
    z.string({ error: `Missing required env: ${name}` }),
  );
}

const serverEnvSchema = z
  .object({
    SITE_URL: optionalEnv(),
    VITE_SITE_URL: optionalEnv(),
    SUPABASE_URL: requiredEnv('SUPABASE_URL'),
    SUPABASE_ANON_KEY: requiredEnv('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    DATABASE_URL: optionalEnv(),
    POSTGRES_URL: optionalEnv(),
    POSTGRES_PRISMA_URL: optionalEnv(),
    POSTGRES_URL_NON_POOLING: optionalEnv(),
    RESEND_API_KEY: optionalEnv(),
    RESEND_TO_EMAIL: optionalEnv(),
    RESEND_FROM: optionalEnv(),
    BLING_CLIENT_ID: optionalEnv(),
    BLING_CLIENT_SECRET: optionalEnv(),
    BLING_REDIRECT_URI: optionalEnv(),
    BLING_API_BASE: optionalEnv(),
    BLING_AUTH_BASE: optionalEnv(),
    B2B_APPROVAL_LINK_SECRET: optionalEnv(),
    ADMIN_BOOTSTRAP_EMAILS: optionalEnv(),
    B2B_MINIMUM_ORDER_QUANTITY: optionalEnv(),
  })
  .transform((env): ServerEnv => {
    const databaseUrl =
      env.DATABASE_URL ??
      env.POSTGRES_PRISMA_URL ??
      env.POSTGRES_URL ??
      env.POSTGRES_URL_NON_POOLING;
    if (!databaseUrl) {
      throw new Error(
        'Missing required env: DATABASE_URL (or POSTGRES_URL / POSTGRES_PRISMA_URL)',
      );
    }
    const minimumOrderQuantity = Number(env.B2B_MINIMUM_ORDER_QUANTITY ?? '6');
    return {
      siteUrl: env.SITE_URL ?? env.VITE_SITE_URL ?? 'http://localhost:5173',
      supabaseUrl: env.SUPABASE_URL,
      supabaseAnonKey: env.SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      databaseUrl,
      resendApiKey: env.RESEND_API_KEY ?? null,
      resendToEmail: env.RESEND_TO_EMAIL ?? null,
      resendFrom: env.RESEND_FROM ?? 'GHENO B2B <noreply@ghenortrs.com.br>',
      blingClientId: env.BLING_CLIENT_ID ?? null,
      blingClientSecret: env.BLING_CLIENT_SECRET ?? null,
      blingRedirectUri: env.BLING_REDIRECT_URI ?? null,
      blingApiBase: env.BLING_API_BASE ?? 'https://api.bling.com.br/Api/v3',
      blingAuthBase:
        env.BLING_AUTH_BASE ?? 'https://www.bling.com.br/Api/v3/oauth',
      approvalLinkSecret: env.B2B_APPROVAL_LINK_SECRET ?? null,
      adminBootstrapEmails: parseAdminEmails(env.ADMIN_BOOTSTRAP_EMAILS),
      minimumOrderQuantity:
        Number.isFinite(minimumOrderQuantity) && minimumOrderQuantity > 0
          ? minimumOrderQuantity
          : 6,
    };
  });

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}
