import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';

export type ApproveSellerToken = {
  purpose: 'approve-seller';
  email: string;
  status: 'approved';
  jti: string;
  exp: number;
};

export type BlingOAuthState = {
  purpose: 'bling-oauth';
  nonce: string;
  exp: number;
};

export type SignedPayload = ApproveSellerToken | BlingOAuthState;

const DEFAULT_APPROVE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_OAUTH_TTL_MS = 15 * 60 * 1000;

function toBase64Url(value: Buffer | string): string {
  const buffer = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  return buffer.toString('base64url');
}

function signBody(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('base64url');
}

function signaturesMatch(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signToken(payload: SignedPayload, secret: string): string {
  const body = toBase64Url(JSON.stringify(payload));
  return `${body}.${signBody(body, secret)}`;
}

export function verifyToken<T extends SignedPayload['purpose']>(
  token: string | null | undefined,
  secret: string,
  purpose: T,
  now = Date.now(),
): Extract<SignedPayload, { purpose: T }> | null {
  if (!token || !secret) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (!signaturesMatch(signature, signBody(body, secret))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as SignedPayload;
    if (payload.purpose !== purpose) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    return payload as Extract<SignedPayload, { purpose: T }>;
  } catch {
    return null;
  }
}

export function buildApproveSellerToken(
  input: { email: string; ttlMs?: number },
  secret: string,
): string {
  return signToken(
    {
      purpose: 'approve-seller',
      email: input.email.trim().toLowerCase(),
      status: 'approved',
      jti: randomUUID(),
      exp: Date.now() + (input.ttlMs ?? DEFAULT_APPROVE_TTL_MS),
    },
    secret,
  );
}

export function hashEmailActionTokenJti(jti: string): string {
  return createHash('sha256').update(jti).digest('hex');
}

export function buildBlingOAuthState(
  secret: string,
  ttlMs = DEFAULT_OAUTH_TTL_MS,
): string {
  return signToken(
    {
      purpose: 'bling-oauth',
      nonce: crypto.randomUUID(),
      exp: Date.now() + ttlMs,
    },
    secret,
  );
}

/** Start-flow HMAC state, or the static `state` from Bling's invite URL. */
export function isValidBlingOAuthState(
  state: string | null | undefined,
  secret: string,
  inviteState?: string | null,
): boolean {
  if (verifyToken(state, secret, 'bling-oauth')) return true;
  if (!state || !inviteState) return false;
  return signaturesMatch(state, inviteState);
}
