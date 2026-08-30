// POST /api/b2b-register
// Creates/links a seller profile as pending and notifies GHENO via Resend.
// Auth optional: if Bearer present, binds to that user; otherwise creates auth user.

import { parseB2BRegistration } from '../b2b/schemas';
import { getServerEnv } from './env';
import { json, methodNotAllowed, readJson } from './http';
import { buildSellerRegistrationHtml, sendResendEmail } from './resend';
import {
  createEmailActionToken,
  getSellerByEmail,
  upsertSeller,
} from './db/queries';
import {
  buildApproveSellerToken,
  hashEmailActionTokenJti,
  verifyToken,
} from './signed-token';
import {
  createAuthAdminClient,
  findAuthUserIdByEmail,
  requireUser,
} from './supabase';

type RegisterBody = {
  empresa?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  mensagem?: string;
  website?: string; // honeypot
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST']);

  const raw = await readJson<RegisterBody>(req);
  if (!raw) return json({ error: 'invalid_body' }, 400);

  // Honeypot: bypass validation entirely and pretend success.
  if ((raw.website ?? '').trim()) {
    return json({ success: true, status: 'pending' });
  }

  const parsed = parseB2BRegistration(raw);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const data = parsed.data;

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const authAdmin = createAuthAdminClient();
  let existing;
  try {
    existing = await getSellerByEmail(data.email);
  } catch (lookupError) {
    console.error('seller lookup failed', lookupError);
    return json({ error: 'seller_lookup_failed' }, 500);
  }

  if (existing?.status === 'approved') {
    return json(
      {
        error: 'already_approved',
        message: 'Este e-mail já possui acesso. Use o login B2B.',
      },
      409,
    );
  }
  if (existing?.status === 'pending') {
    return json({
      success: true,
      status: 'pending',
      message: 'Cadastro já recebido. Aguarde a aprovação da GHENO.',
    });
  }

  // Prefer binding to the currently authenticated user when present.
  const maybeAuth = await requireUser(req);
  let userId: string | null =
    maybeAuth instanceof Response ? null : maybeAuth.user.id;
  const userEmail: string | null =
    maybeAuth instanceof Response
      ? null
      : (maybeAuth.user.email?.toLowerCase() ?? null);

  if (userEmail && userEmail !== data.email) {
    return json(
      {
        error: 'email_mismatch',
        message: 'O e-mail do formulário deve ser o mesmo da sessão.',
      },
      400,
    );
  }

  if (!userId) {
    // Create auth user without password (magic-link only).
    const created = await authAdmin.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: {
        company_name: data.empresa,
        source: 'b2b_register',
      },
    });

    if (created.error || !created.data.user) {
      const existingUserId = await findAuthUserIdByEmail(authAdmin, data.email);
      if (!existingUserId) {
        console.error('createUser failed', created.error);
        return json({ error: 'auth_create_failed' }, 500);
      }
      userId = existingUserId;
    } else {
      userId = created.data.user.id;
    }
  }

  let seller;
  try {
    seller = await upsertSeller({
      id: userId,
      email: data.email,
      companyName: data.empresa,
      cnpj: data.cnpj,
      phone: data.telefone,
      message: data.mensagem,
      status: 'pending',
      approvedAt: null,
      approvedBy: null,
      rejectedReason: null,
    });
  } catch (upsertError) {
    console.error('seller upsert failed', upsertError);
    return json({ error: 'seller_save_failed' }, 500);
  }

  let approveUrl: string | undefined;
  if (env.approvalLinkSecret && env.siteUrl) {
    const approvalToken = buildApproveSellerToken(
      { email: data.email },
      env.approvalLinkSecret,
    );
    const approvalPayload = verifyToken(
      approvalToken,
      env.approvalLinkSecret,
      'approve-seller',
    );
    if (!approvalPayload) {
      return json({ error: 'approval_token_create_failed' }, 500);
    }

    try {
      await createEmailActionToken({
        jtiHash: hashEmailActionTokenJti(approvalPayload.jti),
        purpose: approvalPayload.purpose,
        sellerId: seller.id,
        expiresAt: new Date(approvalPayload.exp).toISOString(),
      });
    } catch (tokenError) {
      console.error('approval token save failed', tokenError);
      return json({ error: 'approval_token_save_failed' }, 500);
    }

    approveUrl = `${env.siteUrl.replace(/\/$/, '')}/admin/approve?token=${encodeURIComponent(approvalToken)}`;
  }

  if (env.resendApiKey && env.resendToEmail) {
    const mailed = await sendResendEmail({
      to: env.resendToEmail,
      subject: `[B2B cadastro] ${data.empresa}`,
      replyTo: data.email,
      html: buildSellerRegistrationHtml({
        companyName: data.empresa,
        cnpj: data.cnpj,
        phone: data.telefone,
        email: data.email,
        message: data.mensagem,
        approveUrl,
      }),
    });
    if (!mailed.ok) {
      console.error('b2b-register notify skipped', mailed.reason);
    }
  } else {
    console.warn(
      'b2b-register: registration saved but GHENO alert not sent (set RESEND_API_KEY and RESEND_TO_EMAIL)',
    );
  }

  return json({
    success: true,
    status: seller.status,
    message:
      'Pré-cadastro recebido. Você poderá entrar com este e-mail após a aprovação.',
  });
}
