import {
  consumeEmailActionToken,
  getSellerByEmail,
  insertAdminAuditEvent,
  updateSellerStatus,
} from './db/queries';
import type { SellerStatus } from './db/schema';
import { getServerEnv } from './env';
import { json } from './http';
import { buildSellerApprovedHtml, sendResendEmail } from './resend';
import { hashEmailActionTokenJti, verifyToken } from './signed-token';

export type ApplySellerStatusResult =
  | {
      ok: true;
      email: string;
      status: SellerStatus;
      companyName: string;
    }
  | { ok: false; error: string; httpStatus: number };

function failure(error: string, httpStatus: number): ApplySellerStatusResult {
  return { ok: false, error, httpStatus };
}

export async function applySellerStatus(input: {
  email: string;
  status: SellerStatus;
  reason?: string;
  approvedBy?: string;
}): Promise<ApplySellerStatusResult> {
  const env = getServerEnv();
  const seller = await getSellerByEmail(input.email);
  if (!seller) return failure('seller_not_found', 404);

  if (input.status === 'approved' && seller.status === 'approved') {
    return {
      ok: true,
      email: seller.email,
      status: seller.status,
      companyName: seller.companyName,
    };
  }

  const patch =
    input.status === 'approved'
      ? {
          status: 'approved' as const,
          approvedAt: new Date().toISOString(),
          approvedBy: input.approvedBy ?? 'approval-link',
          rejectedReason: null,
        }
      : {
          status: input.status,
          approvedAt: null,
          approvedBy: null,
          rejectedReason: input.reason ?? null,
        };

  let data;
  try {
    data = await updateSellerStatus(seller.id, patch);
  } catch (error) {
    console.error('seller status update failed', error);
    return failure('update_failed', 500);
  }
  if (!data) return failure('update_failed', 500);

  if (input.status === 'approved' && env.resendApiKey) {
    const loginUrl = `${env.siteUrl.replace(/\/$/, '')}/b2b`;
    await sendResendEmail({
      to: seller.email,
      subject: 'Acesso B2B GHENO liberado',
      html: buildSellerApprovedHtml({
        companyName: seller.companyName,
        loginUrl,
      }),
    });
  }

  return {
    ok: true,
    email: seller.email,
    status: data.status,
    companyName: seller.companyName,
  };
}

export async function confirmEmailSellerApproval(
  token: string | null | undefined,
): Promise<ApplySellerStatusResult> {
  let env;
  try {
    env = getServerEnv();
  } catch {
    return failure('server_not_configured', 503);
  }
  if (!env.approvalLinkSecret) {
    return failure('approval_link_secret_not_configured', 503);
  }

  const payload = verifyToken(token, env.approvalLinkSecret, 'approve-seller');
  if (!payload || payload.status !== 'approved' || !payload.jti) {
    return failure('unauthorized', 401);
  }

  let consumed;
  try {
    consumed = await consumeEmailActionToken(
      hashEmailActionTokenJti(payload.jti),
      new Date().toISOString(),
    );
  } catch (error) {
    console.error('approval token consumption failed', error);
    return failure('update_failed', 500);
  }
  if (!consumed) return failure('token_used', 409);

  const result = await applySellerStatus({
    email: payload.email,
    status: 'approved',
    approvedBy: 'approval-link',
  });
  if (!result.ok) return result;

  try {
    await insertAdminAuditEvent({
      action: 'seller.approval_link.consumed',
      targetSellerId: consumed.sellerId,
    });
  } catch (error) {
    console.error('approval audit event failed', error);
  }

  return result;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return json({ error: 'gone' }, 410);
  }

  const token = new URL(req.url).searchParams.get('token');
  if (!token) return json({ error: 'gone' }, 410);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/admin/approve?token=${encodeURIComponent(token)}`,
    },
  });
}
