// GET /api/b2b-session
// Returns auth + seller gate state for the current Bearer token.

import { json, methodNotAllowed } from './http';
import { getSellerById } from './db/queries';
import { resolveSellerTier } from './seller-tier';
import { requireUser } from './supabase';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET']);

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
    const seller = await getSellerById(auth.user.id);

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
        companyName: seller.companyName,
        status: seller.status,
        cnpj: seller.cnpj,
        phone: seller.phone,
      },
      tier: resolveSellerTier(seller.volume),
      volume: seller.volume,
      gate,
    });
  } catch (error) {
    console.error('b2b-session failed', error);
    return json({ error: 'session_failed' }, 500);
  }
}
