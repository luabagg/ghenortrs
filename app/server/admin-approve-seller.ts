// POST /api/admin-approve-seller
// Header: X-Admin-Secret: $B2B_ADMIN_APPROVE_SECRET
// Body: { "email": "...", "status": "approved" | "rejected", "reason"?: "..." }
// Also supports GET ?email=&secret=&status=approved for one-click email links.

import { getServerEnv } from './env';
import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import {
  buildSellerApprovedHtml,
  sendResendEmail,
} from './resend';
import {
  createServiceClient,
  getSellerByEmail,
  type SellerStatus,
} from './supabase';


type Body = {
  email?: string;
  status?: SellerStatus;
  reason?: string;
};

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401);
}

function readSecret(req: Request, url: URL): string | null {
  return (
    req.headers.get('x-admin-secret') ??
    req.headers.get('X-Admin-Secret') ??
    url.searchParams.get('secret')
  );
}

async function applyStatus(input: {
  email: string;
  status: SellerStatus;
  reason?: string;
}): Promise<Response> {
  const env = getServerEnv();
  const service = createServiceClient();
  const seller = await getSellerByEmail(service, input.email);
  if (!seller) return json({ error: 'seller_not_found' }, 404);

  const patch =
    input.status === 'approved'
      ? {
          status: 'approved' as const,
          approved_at: new Date().toISOString(),
          approved_by: 'admin-approve-seller',
          rejected_reason: null,
        }
      : {
          status: input.status,
          approved_at: null,
          approved_by: null,
          rejected_reason: input.reason ?? null,
        };

  const { data, error } = await service
    .from('sellers')
    .update(patch)
    .eq('id', seller.id)
    .select('*')
    .single();

  if (error || !data) {
    console.error('approve update failed', error);
    return json({ error: 'update_failed' }, 500);
  }

  if (input.status === 'approved' && env.resendApiKey) {
    const loginUrl = `${env.siteUrl.replace(/\/$/, '')}/b2b`;
    await sendResendEmail({
      to: seller.email,
      subject: 'Acesso B2B GHENO liberado',
      html: buildSellerApprovedHtml({
        companyName: seller.company_name,
        loginUrl,
      }),
    });
  }

  return json({
    success: true,
    email: seller.email,
    status: data.status,
  });
}

export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== 'POST' && req.method !== 'GET') {
    return methodNotAllowed(['GET', 'POST', 'OPTIONS']);
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

  const url = new URL(req.url);
  const secret = readSecret(req, url);
  if (!secret || secret !== env.adminApproveSecret) return unauthorized();

  if (req.method === 'GET') {
    const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();
    const status = (url.searchParams.get('status') ?? 'approved') as SellerStatus;
    if (!email) return json({ error: 'email_required' }, 400);
    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return json({ error: 'status_invalid' }, 400);
    }
    return applyStatus({ email, status });
  }

  const body = await readJson<Body>(req);
  if (!body?.email) return json({ error: 'email_required' }, 400);
  const status = (body.status ?? 'approved') as SellerStatus;
  if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
    return json({ error: 'status_invalid' }, 400);
  }

  return applyStatus({
    email: body.email.trim().toLowerCase(),
    status,
    reason: body.reason,
  });
}
