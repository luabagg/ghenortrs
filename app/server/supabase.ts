import { createClient, type User } from '@supabase/supabase-js';

import { getSellerById } from './db/queries';
import type { SellerRow, SellerStatus } from './db/schema';
import { getServerEnv } from './env';
import { getBearerToken, json } from './http';

export type { SellerRow, SellerStatus };

type AuthAdmin = {
  auth: {
    admin: {
      createUser: (input: {
        email: string;
        email_confirm?: boolean;
        user_metadata?: Record<string, string>;
      }) => Promise<{
        data: { user: { id: string } | null };
        error: { message: string } | null;
      }>;
      listUsers: (input: { page: number; perPage: number }) => Promise<{
        data: { users: Array<{ id: string; email?: string | null }> };
      }>;
      generateLink: (input: {
        type: 'magiclink';
        email: string;
        options: { redirectTo: string };
      }) => Promise<{
        data: { properties: { action_link?: string } | null };
        error: { message: string } | null;
      }>;
    };
  };
};

export function createAuthAdminClient(): AuthAdmin {
  const env = getServerEnv();
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function findAuthUserIdByEmail(
  admin: AuthAdmin,
  email: string,
): Promise<string | null> {
  const normalized = email.toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const listed = await admin.auth.admin.listUsers({ page, perPage: 200 });
    const found = listed.data.users.find(
      (user) => user.email?.toLowerCase() === normalized,
    );
    if (found) return found.id;
    if (listed.data.users.length < 200) return null;
  }
  return null;
}

export function createUserClient(accessToken: string) {
  const env = getServerEnv();
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function requireUser(
  req: Request,
): Promise<{ user: User; accessToken: string } | Response> {
  const accessToken = getBearerToken(req);
  if (!accessToken) return json({ error: 'Unauthorized' }, 401);

  const client = createUserClient(accessToken);
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return json({ error: 'Unauthorized' }, 401);
  return { user: data.user, accessToken };
}

export async function requireApprovedSeller(
  req: Request,
): Promise<{ user: User; seller: SellerRow; accessToken: string } | Response> {
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;

  const seller = await getSellerById(auth.user.id);
  if (!seller) {
    return json(
      {
        error: 'seller_not_registered',
        message: 'Conta autenticada sem cadastro comercial.',
      },
      403,
    );
  }
  if (seller.status !== 'approved') {
    return json(
      {
        error: 'seller_not_approved',
        status: seller.status,
        message: 'Cadastro ainda não liberado para o catálogo B2B.',
      },
      403,
    );
  }
  return { user: auth.user, seller, accessToken: auth.accessToken };
}
