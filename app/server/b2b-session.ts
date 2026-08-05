// GET /api/b2b-session
// Returns auth + seller gate state for the current Bearer token.

import { handleOptions, json, methodNotAllowed } from './http';
import {
  createServiceClient,
  getSellerById,
  requireUser,
} from './supabase';


export default async function handler(req: Request): Promise<Response> {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'GET') return methodNotAllowed(['GET', 'OPTIONS']);

  const auth = await requireUser(req);
  if (auth instanceof Response) {
    // Unauthenticated is a valid gate state.
    if (auth.status === 401) {
      return json({
        authenticated: false,
        seller: null,
        gate: 'anonymous',
      });
    }
    return auth;
  }

  try {
    const service = createServiceClient();
    const seller = await getSellerById(service, auth.user.id);

    if (!seller) {
      return json({
        authenticated: true,
        email: auth.user.email ?? null,
        seller: null,
        gate: 'needs_registration',
      });
    }

    const gate =
      seller.status === 'approved'
        ? 'approved'
        : seller.status === 'pending'
          ? 'pending'
          : seller.status === 'rejected'
            ? 'rejected'
            : 'suspended';

    return json({
      authenticated: true,
      email: auth.user.email ?? seller.email,
      seller: {
        id: seller.id,
        email: seller.email,
        companyName: seller.company_name,
        status: seller.status,
        cnpj: seller.cnpj,
        phone: seller.phone,
      },
      gate,
    });
  } catch (error) {
    console.error('b2b-session failed', error);
    return json({ error: 'session_failed' }, 500);
  }
}
