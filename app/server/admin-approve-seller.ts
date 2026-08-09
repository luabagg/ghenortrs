// GET/POST /api/admin-approve-seller
//
// Admin JSON API (header secret only):
//   POST + X-Admin-Secret + { email, status, reason? }
//
// Signed email approval flow (no long-lived secret in URL):
//   GET  ?token=...  → confirmation HTML only (never mutates)
//   POST application/x-www-form-urlencoded token=... → approve once

import {
  createSellerApproveToken,
  SELLER_APPROVE_PURPOSE,
  type SellerApprovePayload,
  verifyActionToken,
} from './action-token';
import { getServerEnv } from './env';
import {
  escHtml,
  handleOptions,
  html,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import { buildSellerApprovedHtml, sendResendEmail } from './resend';
import {
  createServiceClient,
  getSellerByEmail,
  type SellerRow,
  type SellerStatus,
} from './supabase';

type Body = {
  email?: string;
  status?: SellerStatus;
  reason?: string;
};

export type ApprovalNotificationOutcome =
  | 'sent'
  | 'failed'
  | 'not_configured'
  | 'skipped';

export type AdminApproveDeps = {
  getEnv: typeof getServerEnv;
  createServiceClient: typeof createServiceClient;
  getSellerByEmail: typeof getSellerByEmail;
  sendApprovalEmail: typeof sendSellerApprovedEmail;
  nowMs: () => number;
};

const defaultDeps: AdminApproveDeps = {
  getEnv: getServerEnv,
  createServiceClient,
  getSellerByEmail,
  sendApprovalEmail: sendSellerApprovedEmail,
  nowMs: () => Date.now(),
};

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401);
}

function readHeaderAdminSecret(req: Request): string | null {
  return (
    req.headers.get('x-admin-secret') ?? req.headers.get('X-Admin-Secret')
  );
}

async function sendSellerApprovedEmail(input: {
  email: string;
  companyName: string;
  siteUrl: string;
  resendApiKey: string | null;
}): Promise<ApprovalNotificationOutcome> {
  if (!input.resendApiKey) return 'not_configured';
  const loginUrl = `${input.siteUrl.replace(/\/$/, '')}/b2b`;
  const sent = await sendResendEmail({
    to: input.email,
    subject: 'Acesso B2B GHENO liberado',
    html: buildSellerApprovedHtml({
      companyName: input.companyName,
      loginUrl,
    }),
  });
  return sent.ok ? 'sent' : 'failed';
}

function approvalEmailMessage(
  notification: ApprovalNotificationOutcome,
  email: string,
): string {
  if (notification === 'sent') {
    return `Acesso liberado para ${email}. E-mail de acesso enviado.`;
  }
  if (notification === 'failed') {
    return `Acesso liberado para ${email}. O e-mail de acesso falhou; avise o lojista pelos canais de contato.`;
  }
  if (notification === 'not_configured') {
    return `Acesso liberado para ${email}. E-mail de acesso não configurado.`;
  }
  return `Acesso liberado para ${email}.`;
}

export function buildApproveConfirmationHtml(input: {
  email: string;
  companyName: string;
  token: string;
}): string {
  const email = escHtml(input.email);
  const company = escHtml(input.companyName);
  const token = escHtml(input.token);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aprovar cadastro B2B</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:480px;margin:40px auto;padding:0 16px;color:#111">
  <h1 style="font-size:1.25rem;margin:0 0 8px">Aprovar cadastro B2B</h1>
  <p style="color:#444;margin:0 0 16px">Confirme a liberação deste lojista. Esta ação altera o status para aprovado.</p>
  <dl style="margin:0 0 20px;line-height:1.5">
    <dt style="font-weight:600">Empresa</dt>
    <dd style="margin:0 0 8px">${company}</dd>
    <dt style="font-weight:600">E-mail</dt>
    <dd style="margin:0">${email}</dd>
  </dl>
  <form method="POST" action="/api/admin-approve-seller">
    <input type="hidden" name="token" value="${token}" />
    <button type="submit" style="background:#E81414;color:#fff;border:0;padding:10px 16px;border-radius:4px;font-weight:700;cursor:pointer">
      Confirmar aprovação
    </button>
  </form>
</body>
</html>`;
}

export function buildApproveResultHtml(input: {
  ok: boolean;
  title: string;
  message: string;
}): string {
  const color = input.ok ? '#0a7a32' : '#b00020';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(input.title)}</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:480px;margin:40px auto;padding:0 16px;color:#111">
  <h1 style="font-size:1.25rem;margin:0 0 8px;color:${color}">${escHtml(input.title)}</h1>
  <p style="color:#444;margin:0">${escHtml(input.message)}</p>
</body>
</html>`;
}

async function applyStatus(
  input: {
    email: string;
    status: SellerStatus;
    reason?: string;
    /** When set, require sellers.updated_at match (one-time token version). */
    expectedUpdatedAt?: string;
  },
  deps: AdminApproveDeps,
): Promise<Response> {
  const env = deps.getEnv();
  const service = deps.createServiceClient();
  const seller = await deps.getSellerByEmail(service, input.email);
  if (!seller) return json({ error: 'seller_not_found' }, 404);

  if (
    input.expectedUpdatedAt !== undefined &&
    seller.updated_at !== input.expectedUpdatedAt
  ) {
    return json({ error: 'token_stale' }, 409);
  }

  const patch =
    input.status === 'approved'
      ? {
          status: 'approved' as const,
          approved_at: new Date(deps.nowMs()).toISOString(),
          approved_by: 'admin-approve-seller',
          rejected_reason: null,
        }
      : {
          status: input.status,
          approved_at: null,
          approved_by: null,
          rejected_reason: input.reason ?? null,
        };

  let query = service.from('sellers').update(patch).eq('id', seller.id);
  if (input.expectedUpdatedAt !== undefined) {
    query = query.eq('updated_at', input.expectedUpdatedAt);
  }

  const { data, error } = await query.select('*').single();

  if (error || !data) {
    if (input.expectedUpdatedAt !== undefined) {
      // Concurrent update or already consumed token version.
      const fresh = await deps.getSellerByEmail(service, input.email);
      if (!fresh || fresh.updated_at !== input.expectedUpdatedAt) {
        return json({ error: 'token_stale' }, 409);
      }
    }
    console.error('approve update failed', error);
    return json({ error: 'update_failed' }, 500);
  }

  let notification: ApprovalNotificationOutcome = 'skipped';
  if (input.status === 'approved') {
    try {
      notification = await deps.sendApprovalEmail({
        email: seller.email,
        companyName: seller.company_name,
        siteUrl: env.siteUrl,
        resendApiKey: env.resendApiKey,
      });
    } catch (error) {
      // Status update already committed. Map thrown delivery errors to failed.
      console.error('approval email failed', error);
      notification = 'failed';
    }
  }

  // Successful status update is final. Email failure must not roll it back.
  return json({
    success: true,
    email: seller.email,
    status: data.status,
    notification,
  });
}

async function handleSignedTokenGet(
  token: string,
  deps: AdminApproveDeps,
): Promise<Response> {
  const env = deps.getEnv();
  if (!env.adminApproveSecret) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Configuração incompleta',
        message: 'Aprovação administrativa não está configurada.',
      }),
      503,
    );
  }

  const verified = await verifyActionToken<SellerApprovePayload>(
    token,
    env.adminApproveSecret,
    SELLER_APPROVE_PURPOSE,
    deps.nowMs(),
  );
  if (!verified.ok) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Link inválido',
        message: 'Este link de aprovação expirou ou é inválido.',
      }),
      400,
    );
  }

  const service = deps.createServiceClient();
  const seller = await deps.getSellerByEmail(service, verified.payload.email);
  if (!seller) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Cadastro não encontrado',
        message: 'Não há lojista com este e-mail.',
      }),
      404,
    );
  }
  if (seller.updated_at !== verified.payload.updatedAt) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Link já usado',
        message: 'Este link não é mais válido. Peça um novo alerta de cadastro.',
      }),
      409,
    );
  }

  // GET never mutates seller state — confirmation only.
  return html(
    buildApproveConfirmationHtml({
      email: seller.email,
      companyName: seller.company_name,
      token,
    }),
  );
}

async function handleSignedTokenPost(
  token: string,
  deps: AdminApproveDeps,
): Promise<Response> {
  const env = deps.getEnv();
  if (!env.adminApproveSecret) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Configuração incompleta',
        message: 'Aprovação administrativa não está configurada.',
      }),
      503,
    );
  }

  const verified = await verifyActionToken<SellerApprovePayload>(
    token,
    env.adminApproveSecret,
    SELLER_APPROVE_PURPOSE,
    deps.nowMs(),
  );
  if (!verified.ok) {
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Link inválido',
        message: 'Este link de aprovação expirou ou é inválido.',
      }),
      400,
    );
  }

  const result = await applyStatus(
    {
      email: verified.payload.email,
      status: 'approved',
      expectedUpdatedAt: verified.payload.updatedAt,
    },
    deps,
  );

  if (result.headers.get('content-type')?.includes('application/json')) {
    const body = (await result.clone().json()) as {
      error?: string;
      success?: boolean;
      email?: string;
      status?: string;
      notification?: ApprovalNotificationOutcome;
    };
    if (result.ok && body.success) {
      const email = body.email ?? verified.payload.email;
      const notification = body.notification ?? 'skipped';
      return html(
        buildApproveResultHtml({
          ok: true,
          title: 'Cadastro aprovado',
          message: approvalEmailMessage(notification, email),
        }),
      );
    }
    if (body.error === 'token_stale') {
      return html(
        buildApproveResultHtml({
          ok: false,
          title: 'Link já usado',
          message:
            'Este link não é mais válido. O cadastro pode já ter sido alterado.',
        }),
        409,
      );
    }
    if (body.error === 'seller_not_found') {
      return html(
        buildApproveResultHtml({
          ok: false,
          title: 'Cadastro não encontrado',
          message: 'Não há lojista com este e-mail.',
        }),
        404,
      );
    }
    return html(
      buildApproveResultHtml({
        ok: false,
        title: 'Falha na aprovação',
        message: 'Não foi possível atualizar o cadastro. Tente de novo.',
      }),
      result.status,
    );
  }

  return result;
}

export async function buildSellerApproveUrl(input: {
  siteUrl: string;
  email: string;
  updatedAt: string;
  adminSecret: string;
  nowMs?: number;
}): Promise<string> {
  const { token } = await createSellerApproveToken(
    { email: input.email, updatedAt: input.updatedAt },
    input.adminSecret,
    { nowMs: input.nowMs },
  );
  const base = input.siteUrl.replace(/\/$/, '');
  return `${base}/api/admin-approve-seller?token=${encodeURIComponent(token)}`;
}

export async function handleAdminApproveSeller(
  req: Request,
  deps: AdminApproveDeps = defaultDeps,
): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== 'POST' && req.method !== 'GET') {
    return methodNotAllowed(['GET', 'POST', 'OPTIONS']);
  }

  let env;
  try {
    env = deps.getEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }
  if (!env.adminApproveSecret) {
    return json({ error: 'admin_secret_not_configured' }, 503);
  }

  const url = new URL(req.url);
  const tokenFromQuery = (url.searchParams.get('token') ?? '').trim();

  if (req.method === 'GET') {
    if (!tokenFromQuery) {
      return json({ error: 'token_required' }, 400);
    }
    return handleSignedTokenGet(tokenFromQuery, deps);
  }

  // POST: form token approval or admin JSON with header secret.
  const contentType = req.headers.get('content-type') ?? '';
  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const form = await req.formData();
    const token = String(form.get('token') ?? '').trim();
    if (!token) {
      return html(
        buildApproveResultHtml({
          ok: false,
          title: 'Token ausente',
          message: 'Envie o formulário a partir do link de aprovação.',
        }),
        400,
      );
    }
    return handleSignedTokenPost(token, deps);
  }

  // JSON body path: header secret only (no query secret).
  const secret = readHeaderAdminSecret(req);
  if (!secret || secret !== env.adminApproveSecret) return unauthorized();

  const body = await readJson<Body>(req);
  if (!body?.email) return json({ error: 'email_required' }, 400);
  const status = (body.status ?? 'approved') as SellerStatus;
  if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
    return json({ error: 'status_invalid' }, 400);
  }

  return applyStatus(
    {
      email: body.email.trim().toLowerCase(),
      status,
      reason: body.reason,
    },
    deps,
  );
}

/** @internal test helper — load seller snapshot shape */
export type { SellerRow };

export default async function handler(req: Request): Promise<Response> {
  return handleAdminApproveSeller(req);
}
