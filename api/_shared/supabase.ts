import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

import { getServerEnv } from './env';
import { getBearerToken, json } from './http';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type SellerRow = {
  id: string;
  email: string;
  company_name: string;
  cnpj: string;
  phone: string;
  message: string;
  status: SellerStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type BlingProductRow = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  image_url: string | null;
  price_cents: number | null;
  stock: number | null;
  unit: string | null;
  min_quantity: number;
  active: boolean;
  category: string | null;
  search_terms: string;
  synced_at: string;
};

export function createServiceClient(): SupabaseClient {
  const env = getServerEnv();
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createUserClient(accessToken: string): SupabaseClient {
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

export async function getSellerById(
  service: SupabaseClient,
  id: string,
): Promise<SellerRow | null> {
  const { data, error } = await service
    .from('sellers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as SellerRow | null) ?? null;
}

export async function getSellerByEmail(
  service: SupabaseClient,
  email: string,
): Promise<SellerRow | null> {
  const { data, error } = await service
    .from('sellers')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return (data as SellerRow | null) ?? null;
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
