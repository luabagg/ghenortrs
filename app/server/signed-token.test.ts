import { describe, expect, it } from 'vitest';

import {
  buildApproveSellerToken,
  buildBlingOAuthState,
  isValidBlingOAuthState,
  signToken,
  verifyToken,
} from './signed-token';

const SECRET = 'test-admin-secret';

describe('signed tokens', () => {
  it('round-trips an approve-seller token', () => {
    const token = buildApproveSellerToken(
      { email: 'Loja@Example.com', status: 'approved' },
      SECRET,
    );
    const payload = verifyToken(token, SECRET, 'approve-seller');
    expect(payload).toMatchObject({
      purpose: 'approve-seller',
      email: 'loja@example.com',
      status: 'approved',
    });
  });

  it('rejects a tampered payload', () => {
    const token = buildApproveSellerToken(
      { email: 'loja@example.com' },
      SECRET,
    );
    const [body] = token.split('.');
    const mutated = Buffer.from(
      JSON.stringify({
        purpose: 'approve-seller',
        email: 'attacker@example.com',
        status: 'approved',
        exp: Date.now() + 60_000,
      }),
    ).toString('base64url');
    expect(
      verifyToken(
        `${mutated}.${token.split('.')[1]}`,
        SECRET,
        'approve-seller',
      ),
    ).toBeNull();
    expect(body).toBeTruthy();
  });

  it('rejects an expired token', () => {
    const token = signToken(
      {
        purpose: 'approve-seller',
        email: 'loja@example.com',
        status: 'approved',
        exp: Date.now() - 1,
      },
      SECRET,
    );
    expect(verifyToken(token, SECRET, 'approve-seller')).toBeNull();
  });

  it('rejects a token with the wrong purpose', () => {
    const token = buildBlingOAuthState(SECRET);
    expect(verifyToken(token, SECRET, 'approve-seller')).toBeNull();
    expect(verifyToken(token, SECRET, 'bling-oauth')?.purpose).toBe(
      'bling-oauth',
    );
  });

  it('rejects a token signed with another secret', () => {
    const token = buildApproveSellerToken(
      { email: 'loja@example.com' },
      SECRET,
    );
    expect(verifyToken(token, 'other-secret', 'approve-seller')).toBeNull();
  });
});

describe('isValidBlingOAuthState', () => {
  const inviteState = '8266a30ac9295e271929c957358a9e7c';

  it('accepts a signed start-flow state', () => {
    expect(isValidBlingOAuthState(buildBlingOAuthState(SECRET), SECRET)).toBe(
      true,
    );
  });

  it('rejects Bling invite hex when no invite state is configured', () => {
    expect(isValidBlingOAuthState(inviteState, SECRET)).toBe(false);
    expect(isValidBlingOAuthState(inviteState, SECRET, null)).toBe(false);
  });

  it('accepts the configured Bling invite state', () => {
    expect(isValidBlingOAuthState(inviteState, SECRET, inviteState)).toBe(true);
  });

  it('rejects a different invite state', () => {
    expect(
      isValidBlingOAuthState(
        inviteState,
        SECRET,
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      ),
    ).toBe(false);
  });

  it('rejects an expired signed state even when invite state is set', () => {
    const expired = signToken(
      {
        purpose: 'bling-oauth',
        nonce: 'n',
        exp: Date.now() - 1,
      },
      SECRET,
    );
    expect(isValidBlingOAuthState(expired, SECRET, inviteState)).toBe(false);
  });
});
