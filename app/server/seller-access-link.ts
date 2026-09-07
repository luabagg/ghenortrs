import {
  consumeEmailActionToken,
  getSellerByEmail,
  getSellerById,
  insertAdminAuditEvent,
  reserveRateLimitedEmailActionToken,
} from './db/queries';
import { getServerEnv } from './env';
import { buildSellerCatalogAccessHtml, sendResendEmail } from './resend';
import {
  buildSellerCatalogAccessToken,
  hashEmailActionTokenJti,
  verifyToken,
} from './signed-token';
import { createAuthAdminClient } from './supabase';

const ACCESS_DESTINATION_PATH = '/b2b/acesso';
const CATALOG_DESTINATION_PATH = '/b2b/catalogo';
// Five requests per minute allow recovery while limiting repeated email bursts.
const ACCESS_EMAIL_LIMIT = 5;
const ACCESS_EMAIL_WINDOW_MS = 60_000;

type Actor = {
  id: string;
  email?: string | null;
};

type AccessLinkResult = { ok: true } | { ok: false; error: string };

type ResolvedAccessToken = {
  seller: NonNullable<Awaited<ReturnType<typeof getSellerById>>>;
  jti: string;
};

function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/$/, '')}${path}`;
}

async function recordAccessLinkAudit(input: {
  sellerId: string;
  actor?: Actor;
  outcome: 'success' | 'failure';
}): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: input.actor?.id ?? null,
      actorEmail: input.actor?.email ?? null,
      action: 'seller.access_link.sent',
      targetSellerId: input.sellerId,
      metadata: { destinationPath: ACCESS_DESTINATION_PATH },
      outcome: input.outcome,
    });
  } catch (error) {
    console.error('catalog access-link audit failed', error);
  }
}

async function sendAccessEmail(input: {
  seller: ResolvedAccessToken['seller'];
  actor?: Actor;
}): Promise<AccessLinkResult> {
  const env = getServerEnv();
  if (!env.emailActionSecret) {
    return { ok: false, error: 'email_action_secret_not_configured' };
  }

  const token = buildSellerCatalogAccessToken(
    { sellerId: input.seller.id },
    env.emailActionSecret,
  );
  const payload = verifyToken(
    token,
    env.emailActionSecret,
    'seller-catalog-access',
  );
  if (!payload) return { ok: false, error: 'access_token_create_failed' };

  const reserved = await reserveRateLimitedEmailActionToken(
    {
      jtiHash: hashEmailActionTokenJti(payload.jti),
      purpose: payload.purpose,
      sellerId: input.seller.id,
      expiresAt: new Date(payload.exp).toISOString(),
    },
    new Date(Date.now() - ACCESS_EMAIL_WINDOW_MS).toISOString(),
    ACCESS_EMAIL_LIMIT,
  );
  if (!reserved) return { ok: false, error: 'rate_limited' };

  const accessUrl = `${absoluteUrl(env.siteUrl, ACCESS_DESTINATION_PATH)}?token=${encodeURIComponent(token)}`;
  const delivered = await sendResendEmail({
    to: input.seller.email,
    subject: 'Acesso ao catálogo B2B GHENO',
    html: buildSellerCatalogAccessHtml({
      companyName: input.seller.companyName,
      accessUrl,
    }),
  });
  if (!delivered.ok) {
    console.error('catalog access-link delivery failed', delivered.reason);
    await recordAccessLinkAudit({
      sellerId: input.seller.id,
      actor: input.actor,
      outcome: 'failure',
    });
    return { ok: false, error: 'delivery_failed' };
  }

  await recordAccessLinkAudit({
    sellerId: input.seller.id,
    actor: input.actor,
    outcome: 'success',
  });
  return { ok: true };
}

export async function sendSellerCatalogAccessLink(input: {
  sellerId: string;
  actor: Actor;
}): Promise<AccessLinkResult> {
  const seller = await getSellerById(input.sellerId);
  if (!seller) return { ok: false, error: 'seller_not_found' };
  if (seller.status !== 'approved') {
    return { ok: false, error: 'seller_not_approved' };
  }
  return sendAccessEmail({ seller, actor: input.actor });
}

/** Requests a login email without revealing account or approval state. */
export async function requestSellerCatalogAccessLink(
  email: string,
): Promise<AccessLinkResult> {
  let seller;
  try {
    seller = await getSellerByEmail(email.trim().toLowerCase());
  } catch (error) {
    console.error('catalog access-link seller lookup failed', error);
    return { ok: false, error: 'request_failed' };
  }

  if (!seller || seller.status !== 'approved') return { ok: true };

  try {
    const result = await sendAccessEmail({ seller });
    if (!result.ok) {
      console.error('catalog access-link request failed', result.error);
    }
  } catch (error) {
    console.error('catalog access-link request failed', error);
  }

  return { ok: true };
}

async function resolveAccessToken(
  token: string | null | undefined,
): Promise<ResolvedAccessToken | null> {
  const env = getServerEnv();
  if (!env.emailActionSecret) return null;
  const payload = verifyToken(
    token,
    env.emailActionSecret,
    'seller-catalog-access',
  );
  if (!payload?.jti || !payload.sellerId) return null;

  const seller = await getSellerById(payload.sellerId);
  if (!seller || seller.status !== 'approved') return null;
  return { seller, jti: payload.jti };
}

export async function inspectSellerCatalogAccessToken(
  token: string | null | undefined,
): Promise<{ ok: true; companyName: string } | { ok: false; error: string }> {
  const resolved = await resolveAccessToken(token);
  if (!resolved) return { ok: false, error: 'invalid_or_expired' };
  return { ok: true, companyName: resolved.seller.companyName };
}

export async function redeemSellerCatalogAccessToken(
  token: string | null | undefined,
): Promise<{ ok: true; actionLink: string } | { ok: false; error: string }> {
  const resolved = await resolveAccessToken(token);
  if (!resolved) return { ok: false, error: 'invalid_or_expired' };

  const consumed = await consumeEmailActionToken(
    hashEmailActionTokenJti(resolved.jti),
    new Date().toISOString(),
  );
  if (!consumed) return { ok: false, error: 'used_or_expired' };

  const env = getServerEnv();
  const generated = await createAuthAdminClient().auth.admin.generateLink({
    type: 'magiclink',
    email: resolved.seller.email,
    options: {
      redirectTo: absoluteUrl(env.siteUrl, CATALOG_DESTINATION_PATH),
    },
  });
  const actionLink = generated.data.properties?.action_link;
  if (generated.error || !actionLink) {
    console.error(
      'catalog access-link generation failed',
      generated.error?.message ?? 'missing action link',
    );
    return { ok: false, error: 'link_generation_failed' };
  }

  return { ok: true, actionLink };
}
