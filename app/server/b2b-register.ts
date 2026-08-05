// POST /api/b2b-register
// Creates/links a seller profile as pending and notifies GHENO via Resend.
// Auth optional: if Bearer present, binds to that user; otherwise creates auth user.

import { parseB2BRegistration } from '../b2b/schemas';
import { getServerEnv } from './env';
import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import {
  buildSellerRegistrationHtml,
  sendResendEmail,
} from './resend';
import { createServiceClient, getSellerByEmail, requireUser } from './supabase';

type RegisterBody = {
  empresa?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  mensagem?: string;
  website?: string; // honeypot
};

export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return methodNotAllowed(['POST', 'OPTIONS']);

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

  const service = createServiceClient();
  const existing = await getSellerByEmail(service, data.email);

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
    const created = await service.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: {
        company_name: data.empresa,
        source: 'b2b_register',
      },
    });

    if (created.error || !created.data.user) {
      // User may already exist in auth without seller row.
      const listed = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = listed.data.users.find(
        (user) => user.email?.toLowerCase() === data.email,
      );
      if (!found) {
        console.error('createUser failed', created.error);
        return json({ error: 'auth_create_failed' }, 500);
      }
      userId = found.id;
    } else {
      userId = created.data.user.id;
    }
  }

  const sellerPayload = {
    id: userId,
    email: data.email,
    company_name: data.empresa,
    cnpj: data.cnpj,
    phone: data.telefone,
    message: data.mensagem,
    status: 'pending' as const,
    approved_at: null,
    approved_by: null,
    rejected_reason: null,
  };

  const { data: seller, error: upsertError } = await service
    .from('sellers')
    .upsert(sellerPayload, { onConflict: 'id' })
    .select('*')
    .single();

  if (upsertError || !seller) {
    console.error('seller upsert failed', upsertError);
    return json({ error: 'seller_save_failed' }, 500);
  }

  const approveUrl =
    env.adminApproveSecret && env.siteUrl
      ? `${env.siteUrl.replace(/\/$/, '')}/api/admin-approve-seller?email=${encodeURIComponent(data.email)}&secret=${encodeURIComponent(env.adminApproveSecret)}`
      : undefined;

  if (env.resendApiKey && env.resendToEmail) {
    await sendResendEmail({
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
  }

  return json({
    success: true,
    status: seller.status,
    message:
      'Pré-cadastro recebido. Você poderá entrar com este e-mail após a aprovação.',
  });
}
