import {
  createClient,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

import type { Database, Enums, Tables } from './database.types';
import { getSellerById, type SellerRow } from './db/sellers';
import { getServerEnv } from './env';
import { getBearerToken, json } from './http';

export type SellerStatus = Enums<'seller_status'>;
export type { SellerRow };
export type BlingProductRow = Tables<'bling_products'>;
export { getSellerById, getSellerByEmail } from './db/sellers';

export function createServiceClient(): SupabaseClient<Database> {
  const env = getServerEnv();
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createUserClient(
  accessToken: string,
): SupabaseClient<Database> {
  const env = getServerEnv();
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
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
