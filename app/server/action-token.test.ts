import { describe, expect, it } from 'vitest';

import {
  BLING_OAUTH_STATE_PURPOSE,
  createBlingOAuthStateToken,
  createSellerApproveToken,
  SELLER_APPROVE_PURPOSE,
  signActionToken,
  verifyActionToken,
  type BlingOAuthStatePayload,
  type SellerApprovePayload,
} from './action-token';

const SECRET = 'test-admin-secret-for-hmac';
const OTHER_SECRET = 'other-admin-secret';

describe('action-token', () => {
  it('round-trips a valid bling oauth state token', async () => {
    const nowMs = 1_700_000_000_000;
    const { token, payload } = await createBlingOAuthStateToken(SECRET, {
      nowMs,
      nonce: 'nonce-1',
      ttlSeconds: 600,
    });

    const verified = await verifyActionToken<BlingOAuthStatePayload>(
      token,
      SECRET,
      BLING_OAUTH_STATE_PURPOSE,
      nowMs + 1_000,
    );

    expect(verified).toEqual({ ok: true, payload });
    expect(payload.nonce).toBe('nonce-1');
    expect(payload.purpose).toBe(BLING_OAUTH_STATE_PURPOSE);
  });

  it('rejects tampered payload bytes', async () => {
    const { token } = await createSellerApproveToken(
      { email: 'loja@example.com', updatedAt: '2026-01-01T00:00:00.000Z' },
      SECRET,
    );
    const [body, sig] = token.split('.');
    const tamperedBody = `${body!.slice(0, -2)}aa`;
    const tampered = `${tamperedBody}.${sig}`;

    const verified = await verifyActionToken(
      tampered,
      SECRET,
      SELLER_APPROVE_PURPOSE,
    );
    expect(verified.ok).toBe(false);
    if (!verified.ok) expect(verified.error).toBe('token_invalid');
  });

  it('rejects wrong purpose', async () => {
    const { token } = await createBlingOAuthStateToken(SECRET, {
      nonce: 'n',
    });
    const verified = await verifyActionToken(
      token,
      SECRET,
      SELLER_APPROVE_PURPOSE,
    );
    expect(verified.ok).toBe(false);
    if (!verified.ok) expect(verified.error).toBe('purpose_mismatch');
  });

  it('rejects expired tokens', async () => {
    const nowMs = 1_700_000_000_000;
    const { token } = await createSellerApproveToken(
      { email: 'loja@example.com', updatedAt: '2026-01-01T00:00:00.000Z' },
      SECRET,
      { nowMs, ttlSeconds: 60 },
    );

    const verified = await verifyActionToken<SellerApprovePayload>(
      token,
      SECRET,
      SELLER_APPROVE_PURPOSE,
      nowMs + 61_000,
    );
    expect(verified.ok).toBe(false);
    if (!verified.ok) expect(verified.error).toBe('token_expired');
  });

  it('rejects wrong secret and malformed tokens', async () => {
    const { token } = await createBlingOAuthStateToken(SECRET);
    const wrongSecret = await verifyActionToken(
      token,
      OTHER_SECRET,
      BLING_OAUTH_STATE_PURPOSE,
    );
    expect(wrongSecret.ok).toBe(false);

    const malformed = await verifyActionToken(
      'not-a-token',
      SECRET,
      BLING_OAUTH_STATE_PURPOSE,
    );
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.error).toBe('token_malformed');
  });

  it('rejects structurally malformed payload with a valid signature', async () => {
    // Deliberate test-only cast: sign JSON that passes TypeScript only via cast,
    // but fails structural parse (missing required nonce).
    const token = await signActionToken(
      {
        purpose: BLING_OAUTH_STATE_PURPOSE,
        exp: Math.floor(Date.now() / 1000) + 100,
      } as unknown as BlingOAuthStatePayload,
      SECRET,
    );

    const verified = await verifyActionToken(
      token,
      SECRET,
      BLING_OAUTH_STATE_PURPOSE,
    );
    expect(verified.ok).toBe(false);
    if (!verified.ok) expect(verified.error).toBe('payload_malformed');
  });
});
