import { getSellerById, insertAdminAuditEvent } from './db/queries';
import { getServerEnv } from './env';
import { buildSellerCatalogAccessHtml, sendResendEmail } from './resend';
import { createAuthAdminClient } from './supabase';

const CATALOG_DESTINATION_PATH = '/b2b/catalogo';

type Actor = {
  id: string;
  email?: string | null;
};

type SendSellerCatalogAccessLinkResult =
  | { ok: true }
  | { ok: false; error: string };

function catalogRedirectUrl(siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, '')}${CATALOG_DESTINATION_PATH}`;
}

async function recordAccessLinkAudit(input: {
  sellerId: string;
  actor: Actor;
  outcome: 'success' | 'failure';
}): Promise<void> {
  try {
    await insertAdminAuditEvent({
      actorUserId: input.actor.id,
      actorEmail: input.actor.email ?? null,
      action: 'seller.access_link.sent',
      targetSellerId: input.sellerId,
      metadata: { destinationPath: CATALOG_DESTINATION_PATH },
      outcome: input.outcome,
    });
  } catch (error) {
    console.error('catalog access-link audit failed', error);
  }
}

export async function sendSellerCatalogAccessLink(input: {
  sellerId: string;
  actor: Actor;
}): Promise<SendSellerCatalogAccessLinkResult> {
  const seller = await getSellerById(input.sellerId);
  if (!seller) return { ok: false, error: 'seller_not_found' };
  if (seller.status !== 'approved') {
    return { ok: false, error: 'seller_not_approved' };
  }

  const redirectTo = catalogRedirectUrl(getServerEnv().siteUrl);
  const generated = await createAuthAdminClient().auth.admin.generateLink({
    type: 'magiclink',
    email: seller.email,
    options: { redirectTo },
  });
  const actionLink = generated.data.properties?.action_link;
  if (generated.error || !actionLink) {
    await recordAccessLinkAudit({
      sellerId: seller.id,
      actor: input.actor,
      outcome: 'failure',
    });
    return { ok: false, error: 'link_generation_failed' };
  }

  const delivered = await sendResendEmail({
    to: seller.email,
    subject: 'Acesso ao catálogo B2B GHENO',
    html: buildSellerCatalogAccessHtml({
      companyName: seller.companyName,
      actionLink,
    }),
  });
  if (!delivered.ok) {
    await recordAccessLinkAudit({
      sellerId: seller.id,
      actor: input.actor,
      outcome: 'failure',
    });
    return { ok: false, error: 'delivery_failed' };
  }

  await recordAccessLinkAudit({
    sellerId: seller.id,
    actor: input.actor,
    outcome: 'success',
  });
  return { ok: true };
}
