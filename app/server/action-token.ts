// Server-only signed action tokens (HMAC SHA-256, base64url, JSON payload).
// Used for short-lived OAuth state and seller approval links.
// Never put the long-lived admin secret in URLs or client HTML.

export const BLING_OAUTH_STATE_PURPOSE = 'bling_oauth_state' as const;
export const SELLER_APPROVE_PURPOSE = 'seller_approve' as const;

export type ActionTokenPurpose =
  | typeof BLING_OAUTH_STATE_PURPOSE
  | typeof SELLER_APPROVE_PURPOSE;

type BasePayload = {
  purpose: ActionTokenPurpose;
  /** Unix epoch seconds. */
  exp: number;
};

export type BlingOAuthStatePayload = BasePayload & {
  purpose: typeof BLING_OAUTH_STATE_PURPOSE;
  nonce: string;
};

export type SellerApprovePayload = BasePayload & {
  purpose: typeof SELLER_APPROVE_PURPOSE;
  email: string;
  /** Seller row version: current sellers.updated_at ISO timestamp. */
  updatedAt: string;
};

export type ActionTokenPayload = BlingOAuthStatePayload | SellerApprovePayload;

export type VerifyActionTokenResult<T extends ActionTokenPayload> =
  | { ok: true; payload: T }
  | { ok: false; error: string };

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** Default OAuth state lifetime: 10 minutes. */
export const BLING_OAUTH_STATE_TTL_SECONDS = 10 * 60;

/** Default seller approval link lifetime: 24 hours. */
export const SELLER_APPROVE_TTL_SECONDS = 24 * 60 * 60;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const b64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + '='.repeat(padLen);
  if (typeof atob === 'function') {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsePayload(raw: unknown): ActionTokenPayload | null {
  if (!isRecord(raw)) return null;
  const purpose = raw.purpose;
  const exp = raw.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return null;

  if (purpose === BLING_OAUTH_STATE_PURPOSE) {
    if (typeof raw.nonce !== 'string' || raw.nonce.length === 0) return null;
    return {
      purpose: BLING_OAUTH_STATE_PURPOSE,
      nonce: raw.nonce,
      exp,
    };
  }

  if (purpose === SELLER_APPROVE_PURPOSE) {
    if (typeof raw.email !== 'string' || raw.email.length === 0) return null;
    if (typeof raw.updatedAt !== 'string' || raw.updatedAt.length === 0) {
      return null;
    }
    return {
      purpose: SELLER_APPROVE_PURPOSE,
      email: raw.email,
      updatedAt: raw.updatedAt,
      exp,
    };
  }

  return null;
}

export function nowUnixSeconds(nowMs: number = Date.now()): number {
  return Math.floor(nowMs / 1000);
}

export async function signActionToken(
  payload: ActionTokenPayload,
  secret: string,
): Promise<string> {
  if (!secret) throw new Error('action_token_secret_required');
  const body = bytesToBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncoder.encode(body),
  );
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifyActionToken<T extends ActionTokenPayload>(
  token: string,
  secret: string,
  expectedPurpose: T['purpose'],
  nowMs: number = Date.now(),
): Promise<VerifyActionTokenResult<T>> {
  if (!secret) return { ok: false, error: 'secret_required' };
  if (typeof token !== 'string' || token.length === 0) {
    return { ok: false, error: 'token_required' };
  }

  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, error: 'token_malformed' };
  }

  const [body, sig] = parts;
  let key: CryptoKey;
  try {
    key = await importHmacKey(secret);
  } catch {
    return { ok: false, error: 'secret_invalid' };
  }

  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64UrlToBytes(sig);
  } catch {
    return { ok: false, error: 'token_malformed' };
  }

  // Copy into a fresh ArrayBuffer-backed view for DOM lib BufferSource typing.
  const signatureBuffer = new Uint8Array(signatureBytes);

  let valid: boolean;
  try {
    valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      textEncoder.encode(body),
    );
  } catch {
    return { ok: false, error: 'token_invalid' };
  }
  if (!valid) return { ok: false, error: 'token_invalid' };

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(textDecoder.decode(base64UrlToBytes(body)));
  } catch {
    return { ok: false, error: 'payload_malformed' };
  }

  const payload = parsePayload(parsedJson);
  if (!payload) return { ok: false, error: 'payload_malformed' };
  if (payload.purpose !== expectedPurpose) {
    return { ok: false, error: 'purpose_mismatch' };
  }
  if (payload.exp <= nowUnixSeconds(nowMs)) {
    return { ok: false, error: 'token_expired' };
  }

  return { ok: true, payload: payload as T };
}

export async function createBlingOAuthStateToken(
  secret: string,
  options?: { ttlSeconds?: number; nowMs?: number; nonce?: string },
): Promise<{ token: string; payload: BlingOAuthStatePayload }> {
  const nowMs = options?.nowMs ?? Date.now();
  const ttl = options?.ttlSeconds ?? BLING_OAUTH_STATE_TTL_SECONDS;
  const payload: BlingOAuthStatePayload = {
    purpose: BLING_OAUTH_STATE_PURPOSE,
    nonce: options?.nonce ?? crypto.randomUUID(),
    exp: nowUnixSeconds(nowMs) + ttl,
  };
  const token = await signActionToken(payload, secret);
  return { token, payload };
}

export async function createSellerApproveToken(
  input: { email: string; updatedAt: string },
  secret: string,
  options?: { ttlSeconds?: number; nowMs?: number },
): Promise<{ token: string; payload: SellerApprovePayload }> {
  const nowMs = options?.nowMs ?? Date.now();
  const ttl = options?.ttlSeconds ?? SELLER_APPROVE_TTL_SECONDS;
  const payload: SellerApprovePayload = {
    purpose: SELLER_APPROVE_PURPOSE,
    email: input.email.trim().toLowerCase(),
    updatedAt: input.updatedAt,
    exp: nowUnixSeconds(nowMs) + ttl,
  };
  const token = await signActionToken(payload, secret);
  return { token, payload };
}
