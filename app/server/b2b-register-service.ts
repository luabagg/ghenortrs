// B2B seller registration application service.
// HTTP adapters map Request/Response. This module owns seller decisions.

import type { User } from '@supabase/supabase-js';

import type { B2BRegisterRequestData } from '../b2b/schemas';
import { buildSellerApproveUrl } from './admin-approve-seller';
import { getServerEnv, type ServerEnv } from './env';
import {
  buildSellerRegistrationHtml,
  sendResendEmail,
} from './resend';
import {
  createServiceClient,
  getSellerByEmail,
  type SellerRow,
} from './supabase';

export type NotificationOutcome = 'sent' | 'failed' | 'not_configured';

export type AuthenticatedUserBinding = {
  id: string;
  email: string | null;
} | null;

export type RegisterSellerResult =
  | { kind: 'server_not_configured' }
  | {
      kind: 'already_approved';
      message: string;
    }
  | {
      kind: 'registration_blocked';
      status: 'rejected' | 'suspended';
      message: string;
    }
  | {
      kind: 'email_mismatch';
      message: string;
    }
  | { kind: 'auth_create_failed' }
  | { kind: 'seller_save_failed' }
  | {
      kind: 'registered';
      status: 'pending';
      existingPending: boolean;
      notification: NotificationOutcome;
      message: string;
      sellerEmail: string;
    };

export type RegistrationAlertInput = {
  companyName: string;
  cnpj: string;
  phone: string;
  email: string;
  message: string;
  approveUrl?: string;
  toEmail: string;
};

export type B2BRegisterDeps = {
  getEnv: () => ServerEnv;
  createServiceClient: typeof createServiceClient;
  getSellerByEmail: typeof getSellerByEmail;
  buildApproveUrl: typeof buildSellerApproveUrl;
  sendRegistrationAlert: (
    input: RegistrationAlertInput,
  ) => Promise<{ ok: true } | { ok: false; reason: string }>;
  listAuthUsersPage: (
    service: ReturnType<typeof createServiceClient>,
    page: number,
    perPage: number,
  ) => Promise<{
    users: Array<{ id: string; email?: string | null }>;
    nextPage: number | null;
    lastPage: number;
    total: number;
    error: { message?: string } | null;
  }>;
  createAuthUser: (
    service: ReturnType<typeof createServiceClient>,
    input: {
      email: string;
      companyName: string;
    },
  ) => Promise<
    | { ok: true; userId: string }
    | { ok: false; error: { message?: string } | null }
  >;
  upsertPendingSeller: (
    service: ReturnType<typeof createServiceClient>,
    payload: {
      id: string;
      email: string;
      company_name: string;
      cnpj: string;
      phone: string;
      message: string;
    },
  ) => Promise<{ seller: SellerRow | null; error: { message?: string } | null }>;
};

const ALREADY_APPROVED_MESSAGE =
  'Este e-mail já possui acesso. Use o login B2B.';

const BLOCKED_MESSAGE =
  'Este e-mail não está autorizado a solicitar novo cadastro. Fale com a GHENO pelos canais de contato.';

const EMAIL_MISMATCH_MESSAGE =
  'O e-mail do formulário deve ser o mesmo da sessão.';

const REGISTERED_SENT_MESSAGE =
  'Pré-cadastro recebido. Você poderá entrar com este e-mail após a aprovação.';

const PENDING_RESENT_MESSAGE =
  'Cadastro já recebido. Reenviamos o alerta para a GHENO. Aguarde a aprovação.';

const REGISTERED_FAILED_MESSAGE =
  'Recebemos seu cadastro, mas o aviso à GHENO falhou. Tente enviar de novo ou fale pelos canais de contato.';

const REGISTERED_NOT_CONFIGURED_MESSAGE =
  'Recebemos seu cadastro, mas o aviso automático não está configurado. Fale com a GHENO pelos canais de contato.';

const AUTH_USER_PAGE_SIZE = 200;

export function bindingFromUser(user: User): NonNullable<AuthenticatedUserBinding> {
  return {
    id: user.id,
    email: user.email?.toLowerCase() ?? null,
  };
}

async function defaultSendRegistrationAlert(
  input: RegistrationAlertInput,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  return sendResendEmail({
    to: input.toEmail,
    subject: `[B2B cadastro] ${input.companyName}`,
    replyTo: input.email,
    html: buildSellerRegistrationHtml({
      companyName: input.companyName,
      cnpj: input.cnpj,
      phone: input.phone,
      email: input.email,
      message: input.message,
      approveUrl: input.approveUrl,
    }),
  });
}

async function defaultListAuthUsersPage(
  service: ReturnType<typeof createServiceClient>,
  page: number,
  perPage: number,
) {
  const listed = await service.auth.admin.listUsers({ page, perPage });
  if (listed.error) {
    return {
      users: [] as Array<{ id: string; email?: string | null }>,
      nextPage: null,
      lastPage: 0,
      total: 0,
      error: listed.error,
    };
  }
  return {
    users: listed.data.users,
    nextPage: listed.data.nextPage,
    lastPage: listed.data.lastPage,
    total: listed.data.total,
    error: null,
  };
}

async function defaultCreateAuthUser(
  service: ReturnType<typeof createServiceClient>,
  input: { email: string; companyName: string },
): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: { message?: string } | null }
> {
  const created = await service.auth.admin.createUser({
    email: input.email,
    email_confirm: true,
    user_metadata: {
      company_name: input.companyName,
      source: 'b2b_register',
    },
  });
  if (created.error || !created.data.user) {
    return { ok: false, error: created.error };
  }
  return { ok: true, userId: created.data.user.id };
}

async function defaultUpsertPendingSeller(
  service: ReturnType<typeof createServiceClient>,
  payload: {
    id: string;
    email: string;
    company_name: string;
    cnpj: string;
    phone: string;
    message: string;
  },
): Promise<{ seller: SellerRow | null; error: { message?: string } | null }> {
  const { data: seller, error } = await service
    .from('sellers')
    .upsert(
      {
        id: payload.id,
        email: payload.email,
        company_name: payload.company_name,
        cnpj: payload.cnpj,
        phone: payload.phone,
        message: payload.message,
        status: 'pending' as const,
        approved_at: null,
        approved_by: null,
        rejected_reason: null,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();
  return { seller, error };
}

export const defaultB2BRegisterDeps: B2BRegisterDeps = {
  getEnv: getServerEnv,
  createServiceClient,
  getSellerByEmail,
  buildApproveUrl: buildSellerApproveUrl,
  sendRegistrationAlert: defaultSendRegistrationAlert,
  listAuthUsersPage: defaultListAuthUsersPage,
  createAuthUser: defaultCreateAuthUser,
  upsertPendingSeller: defaultUpsertPendingSeller,
};

/**
 * Page through Supabase Admin listUsers until email is found or pages end.
 * Uses official pagination metadata (nextPage / lastPage / total).
 */
export async function findAuthUserIdByEmail(
  service: ReturnType<typeof createServiceClient>,
  email: string,
  deps: Pick<B2BRegisterDeps, 'listAuthUsersPage'>,
): Promise<string | null> {
  const normalized = email.toLowerCase();
  let page = 1;

  for (;;) {
    const listed = await deps.listAuthUsersPage(
      service,
      page,
      AUTH_USER_PAGE_SIZE,
    );
    if (listed.error) {
      console.error('listUsers failed', listed.error);
      return null;
    }

    const found = listed.users.find(
      (user) => user.email?.toLowerCase() === normalized,
    );
    if (found) return found.id;

    if (listed.nextPage == null) return null;
    if (listed.lastPage > 0 && page >= listed.lastPage) return null;
    if (listed.nextPage <= page) return null;
    page = listed.nextPage;
  }
}

function registeredMessage(
  existingPending: boolean,
  notification: NotificationOutcome,
): string {
  if (notification === 'failed') return REGISTERED_FAILED_MESSAGE;
  if (notification === 'not_configured') {
    return REGISTERED_NOT_CONFIGURED_MESSAGE;
  }
  return existingPending ? PENDING_RESENT_MESSAGE : REGISTERED_SENT_MESSAGE;
}

async function notifyRegistration(input: {
  env: ServerEnv;
  seller: Pick<
    SellerRow,
    | 'company_name'
    | 'cnpj'
    | 'phone'
    | 'email'
    | 'message'
    | 'updated_at'
  >;
  deps: B2BRegisterDeps;
}): Promise<NotificationOutcome> {
  const { env, seller, deps } = input;
  if (!env.resendApiKey || !env.resendToEmail) return 'not_configured';

  // After seller persistence, alert failures must not throw HTTP 500.
  try {
    let approveUrl: string | undefined;
    if (env.adminApproveSecret && env.siteUrl && seller.updated_at) {
      approveUrl = await deps.buildApproveUrl({
        siteUrl: env.siteUrl,
        email: seller.email,
        updatedAt: seller.updated_at,
        adminSecret: env.adminApproveSecret,
      });
    }

    // Always send the persisted seller snapshot, never live form fields.
    const sent = await deps.sendRegistrationAlert({
      companyName: seller.company_name,
      cnpj: seller.cnpj,
      phone: seller.phone,
      email: seller.email,
      message: seller.message,
      approveUrl,
      toEmail: env.resendToEmail,
    });
    return sent.ok ? 'sent' : 'failed';
  } catch (error) {
    console.error('registration alert failed', error);
    return 'failed';
  }
}

/**
 * Register or recover a pending seller and attempt the GHENO alert.
 * Does not parse HTTP. Callers validate input and map the result.
 */
export async function registerSellerApplication(
  input: {
    data: B2BRegisterRequestData;
    authenticatedUser: AuthenticatedUserBinding;
  },
  deps: B2BRegisterDeps = defaultB2BRegisterDeps,
): Promise<RegisterSellerResult> {
  let env: ServerEnv;
  try {
    env = deps.getEnv();
  } catch {
    return { kind: 'server_not_configured' };
  }

  const service = deps.createServiceClient();
  const existing = await deps.getSellerByEmail(service, input.data.email);

  if (existing?.status === 'approved') {
    return {
      kind: 'already_approved',
      message: ALREADY_APPROVED_MESSAGE,
    };
  }

  if (existing?.status === 'rejected' || existing?.status === 'suspended') {
    return {
      kind: 'registration_blocked',
      status: existing.status,
      message: BLOCKED_MESSAGE,
    };
  }

  if (existing?.status === 'pending') {
    // Existing pending is not updated; alert uses the DB snapshot only.
    const notification = await notifyRegistration({
      env,
      seller: existing,
      deps,
    });
    return {
      kind: 'registered',
      status: 'pending',
      existingPending: true,
      notification,
      message: registeredMessage(true, notification),
      sellerEmail: existing.email,
    };
  }

  const authUser = input.authenticatedUser;
  if (authUser?.email && authUser.email !== input.data.email) {
    return {
      kind: 'email_mismatch',
      message: EMAIL_MISMATCH_MESSAGE,
    };
  }

  let userId: string | null = authUser?.id ?? null;
  if (!userId) {
    const created = await deps.createAuthUser(service, {
      email: input.data.email,
      companyName: input.data.empresa,
    });
    if (created.ok) {
      userId = created.userId;
    } else {
      // Auth user may already exist without a seller row.
      userId = await findAuthUserIdByEmail(service, input.data.email, deps);
      if (!userId) {
        console.error('createUser failed', created.error);
        return { kind: 'auth_create_failed' };
      }
    }
  }

  const { seller, error: upsertError } = await deps.upsertPendingSeller(
    service,
    {
      id: userId,
      email: input.data.email,
      company_name: input.data.empresa,
      cnpj: input.data.cnpj,
      phone: input.data.telefone,
      message: input.data.mensagem,
    },
  );

  if (upsertError || !seller) {
    console.error('seller upsert failed', upsertError);
    return { kind: 'seller_save_failed' };
  }

  const notification = await notifyRegistration({
    env,
    seller,
    deps,
  });

  return {
    kind: 'registered',
    status: 'pending',
    existingPending: false,
    notification,
    message: registeredMessage(false, notification),
    sellerEmail: seller.email,
  };
}

/** Map application result to public API JSON body + HTTP status. */
export function mapRegisterResultToApi(result: RegisterSellerResult): {
  status: number;
  body: Record<string, unknown>;
} {
  switch (result.kind) {
    case 'server_not_configured':
      return { status: 503, body: { error: 'server_not_configured' } };
    case 'already_approved':
      return {
        status: 409,
        body: {
          error: 'already_approved',
          message: result.message,
        },
      };
    case 'registration_blocked':
      return {
        status: 403,
        body: {
          error: 'registration_blocked',
          status: result.status,
          message: result.message,
        },
      };
    case 'email_mismatch':
      return {
        status: 400,
        body: {
          error: 'email_mismatch',
          message: result.message,
        },
      };
    case 'auth_create_failed':
      return { status: 500, body: { error: 'auth_create_failed' } };
    case 'seller_save_failed':
      return { status: 500, body: { error: 'seller_save_failed' } };
    case 'registered': {
      const complete = result.notification === 'sent';
      return {
        // 200 = fully complete (alert sent). 202 = accepted/persisted, alert incomplete.
        status: complete ? 200 : 202,
        body: {
          success: true,
          persisted: true,
          complete,
          status: result.status,
          notification: result.notification,
          existingPending: result.existingPending,
          message: result.message,
        },
      };
    }
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}

export type RemixRegisterActionData = {
  status: 'success' | 'partial-success' | 'error' | 'no-config';
  message?: string;
  gateHint?: string;
};

/** Map application result for the Remix /b2b form action. */
export function mapRegisterResultToRemix(
  result: RegisterSellerResult,
): RemixRegisterActionData {
  switch (result.kind) {
    case 'server_not_configured':
      return { status: 'no-config' };
    case 'already_approved':
      return {
        status: 'error',
        message: result.message,
        gateHint: 'login',
      };
    case 'registration_blocked':
      return {
        status: 'error',
        message: result.message,
      };
    case 'email_mismatch':
      return {
        status: 'error',
        message: result.message,
      };
    case 'auth_create_failed':
      return { status: 'error', message: 'auth_create_failed' };
    case 'seller_save_failed':
      return { status: 'error', message: 'seller_save_failed' };
    case 'registered':
      if (result.notification === 'sent') {
        return {
          status: 'success',
          message: result.message,
          gateHint: result.status,
        };
      }
      return {
        status: 'partial-success',
        message: result.message,
        gateHint: result.status,
      };
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
