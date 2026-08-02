// POST /api/b2b-register
// Creates/links a seller profile as pending and notifies GHENO via Resend.
// Auth optional: if Bearer present, binds to that user; otherwise creates auth user.

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
import {
  createServiceClient,
  getSellerByEmail,
  requireUser,
  type SellerRow,
} from './supabase';


type RegisterBody = {
  empresa?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  mensagem?: string;
  website?: string; // honeypot
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function validate(body: RegisterBody):
  | { ok: true; data: Required<Omit<RegisterBody, 'website'>> }
  | { ok: false; error: string } {
  const empresa = (body.empresa ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const cnpj = digitsOnly(body.cnpj ?? '');
  const telefone = digitsOnly(body.telefone ?? '');
  const mensagem = (body.mensagem ?? '').trim();

  if (!empresa) return { ok: false, error: 'empresa_required' };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'email_invalid' };
  }
  if (cnpj.length !== 14) return { ok: false, error: 'cnpj_invalid' };
  if (telefone.length < 10 || telefone.length > 11) {
    return { ok: false, error: 'telefone_invalid' };
  }

  return {
    ok: true,
    data: { empresa, email, cnpj, telefone, mensagem },
  };
}

export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return methodNotAllowed(['POST', 'OPTIONS']);

  const raw = await readJson<RegisterBody>(req);
  if (!raw) return json({ error: 'invalid_body' }, 400);

  // Honeypot
  if ((raw.website ?? '').trim()) {
    return json({ success: true, status: 'pending' });
  }

  const parsed = validate(raw);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  let env;
  try {
    env = getServerEnv();
  } catch {
    return json({ error: 'server_not_configured' }, 503);
  }

  const service = createServiceClient();
  const existing = await getSellerByEmail(service, parsed.data.email);

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
  let userEmail: string | null =
    maybeAuth instanceof Response
      ? null
      : (maybeAuth.user.email?.toLowerCase() ?? null);

  if (userEmail && userEmail !== parsed.data.email) {
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
      email: parsed.data.email,
      email_confirm: true,
      user_metadata: {
        company_name: parsed.data.empresa,
        source: 'b2b_register',
      },
    });

    if (created.error || !created.data.user) {
      // User may already exist in auth without seller row.
      const listed = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = listed.data.users.find(
        (user) => user.email?.toLowerCase() === parsed.data.email,
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
    email: parsed.data.email,
    company_name: parsed.data.empresa,
    cnpj: parsed.data.cnpj,
    phone: parsed.data.telefone,
    message: parsed.data.mensagem,
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
      ? `${env.siteUrl.replace(/\/$/, '')}/api/admin-approve-seller?email=${encodeURIComponent(parsed.data.email)}&secret=${encodeURIComponent(env.adminApproveSecret)}`
      : undefined;

  if (env.resendApiKey && env.resendToEmail) {
    await sendResendEmail({
      to: env.resendToEmail,
      subject: `[B2B cadastro] ${parsed.data.empresa}`,
      replyTo: parsed.data.email,
      html: buildSellerRegistrationHtml({
        companyName: parsed.data.empresa,
        cnpj: parsed.data.cnpj,
        phone: parsed.data.telefone,
        email: parsed.data.email,
        message: parsed.data.mensagem,
        approveUrl,
      }),
    });
  }

  return json({
    success: true,
    status: (seller as SellerRow).status,
    message:
      'Pré-cadastro recebido. Você poderá entrar com este e-mail após a aprovação.',
  });
}
