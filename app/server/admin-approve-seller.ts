// POST /api/admin-approve-seller
// Header: X-Admin-Secret: $B2B_ADMIN_APPROVE_SECRET
// Body: { "email": "...", "status": "approved" | "rejected", "reason"?: "..." }
// GET /api/admin-approve-seller?token=... redirects to /admin/approve (HTML).

import { getSellerByEmail, updateSellerStatus } from './db/queries';
import type { SellerStatus } from './db/schema';
import { getServerEnv } from './env';
import { json, methodNotAllowed, readAdminSecret, readJson } from './http';
import { buildSellerApprovedHtml, sendResendEmail } from './resend';

type Body = {
  email?: string;
  status?: SellerStatus;
  reason?: string;
};

const STATUSES: SellerStatus[] = [
  'approved',
  'rejected',
  'suspended',
  'pending',
];

export type ApplySellerStatusResult =
  | {
      ok: true;
      email: string;
      status: SellerStatus;
      companyName: string;
    }
  | { ok: false; error: string; httpStatus: number };

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401);
}

function isSellerStatus(value: string): value is SellerStatus {
  return STATUSES.includes(value as SellerStatus);
}

export async function applySellerStatus(input: {
  email: string;
  status: SellerStatus;
  reason?: string;
  approvedBy?: string;
}): Promise<ApplySellerStatusResult> {
  const env = getServerEnv();
  const seller = await getSellerByEmail(input.email);
  if (!seller) {
    return { ok: false, error: 'seller_not_found', httpStatus: 404 };
  }

  const patch =
    input.status === 'approved'
      ? {
          status: 'approved' as const,
          approvedAt: new Date().toISOString(),
          approvedBy: input.approvedBy ?? 'admin-approve-seller',
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
    console.error('approve update failed', error);
    return { ok: false, error: 'update_failed', httpStatus: 500 };
  }
  if (!data) {
    return { ok: false, error: 'update_failed', httpStatus: 500 };
  }

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

export function approveResultToJson(result: ApplySellerStatusResult): Response {
  if (!result.ok) {
    return json({ error: result.error }, result.httpStatus);
  }
  return json({
    success: true,
    email: result.email,
    status: result.status,
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return methodNotAllowed(['GET', 'POST']);
  }

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }
  if (!env.adminApproveSecret) {
    return json({ error: 'admin_secret_not_configured' }, 503);
  }

  if (req.method === 'GET') {
    const token = new URL(req.url).searchParams.get('token');
    if (!token) return unauthorized();
    // One-click email links land on the HTML page, not raw JSON.
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/admin/approve?token=${encodeURIComponent(token)}`,
      },
    });
  }

  const secret = readAdminSecret(req);
  if (!secret || secret !== env.adminApproveSecret) return unauthorized();

  const body = await readJson<Body>(req);
  if (!body?.email) return json({ error: 'email_required' }, 400);
  const status = body.status ?? 'approved';
  if (!isSellerStatus(status)) {
    return json({ error: 'status_invalid' }, 400);
  }

  return approveResultToJson(
    await applySellerStatus({
      email: body.email.trim().toLowerCase(),
      status,
      reason: body.reason,
    }),
  );
}
