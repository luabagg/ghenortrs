import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

import type { Database, Enums, Tables } from './database.types';
import { getServerEnv } from './env';
import { getBearerToken, json } from './http';

export type SellerStatus = Enums<'seller_status'>;
export type SellerRow = Tables<'sellers'>;
export type BlingProductRow = Tables<'bling_products'>;

export function createServiceClient(): SupabaseClient<Database> {
  const env = getServerEnv();
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createUserClient(accessToken: string): SupabaseClient<Database> {
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

export async function getSellerById(
  service: SupabaseClient<Database>,
  id: string,
): Promise<SellerRow | null> {
  const { data, error } = await service
    .from('sellers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSellerByEmail(
  service: SupabaseClient<Database>,
  email: string,
): Promise<SellerRow | null> {
  const { data, error } = await service
    .from('sellers')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function requireApprovedSeller(
  req: Request,
): Promise<{ user: User; seller: SellerRow; accessToken: string } | Response> {
  const auth = await requireUser(req);
  if (auth instanceof Response) return auth;

  const service = createServiceClient();
  const seller = await getSellerById(service, auth.user.id);
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
