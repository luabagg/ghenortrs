// POST /api/b2b-register
// HTTP adapter: parse JSON/auth, call register service, map result.

import { parseB2BRegistration } from '../b2b/schemas';
import {
  bindingFromUser,
  mapRegisterResultToApi,
  registerSellerApplication,
} from './b2b-register-service';
import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from './http';
import { requireUser } from './supabase';

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

  // Honeypot: skip validation and pretend success.
  if ((raw.website ?? '').trim()) {
    return json({ success: true, status: 'pending', notification: 'sent' });
  }

  const parsed = parseB2BRegistration(raw);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const maybeAuth = await requireUser(req);
  const authenticatedUser =
    maybeAuth instanceof Response ? null : bindingFromUser(maybeAuth.user);

  const result = await registerSellerApplication({
    data: parsed.data,
    authenticatedUser,
  });
  const mapped = mapRegisterResultToApi(result);
  return json(mapped.body, mapped.status);
}
