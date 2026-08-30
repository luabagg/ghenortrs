import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  buildApproveSellerToken,
  signToken,
  verifyToken,
} from './signed-token';

function signRaw(payload: unknown): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${createHmac('sha256', SECRET).update(body).digest('base64url')}`;
}

const SECRET = 'test-admin-secret';

describe('signed tokens', () => {
  it('round-trips an approve-seller token', () => {
    const token = buildApproveSellerToken(
      { email: 'Loja@Example.com' },
      SECRET,
    );
    const payload = verifyToken(token, SECRET, 'approve-seller');
    expect(payload).toMatchObject({
      purpose: 'approve-seller',
      email: 'loja@example.com',
      status: 'approved',
    });
  });

  it('includes a unique jti in each approval token', () => {
    const first = buildApproveSellerToken({ email: 'a@b.com' }, SECRET);
    const second = buildApproveSellerToken({ email: 'a@b.com' }, SECRET);

    expect(first).not.toEqual(second);
    expect(verifyToken(first, SECRET, 'approve-seller')).toMatchObject({
      jti: expect.any(String),
      status: 'approved',
    });
  });

  it('rejects a signed token with a different purpose', () => {
    const token = signRaw({ purpose: 'other', exp: Date.now() + 60_000 });
    expect(verifyToken(token, SECRET, 'approve-seller')).toBeNull();
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
        jti: 'expired-approval-token',
        exp: Date.now() - 1,
      },
      SECRET,
    );
    expect(verifyToken(token, SECRET, 'approve-seller')).toBeNull();
  });

  it('rejects a token signed with another secret', () => {
    const token = buildApproveSellerToken(
      { email: 'loja@example.com' },
      SECRET,
    );
    expect(verifyToken(token, 'other-secret', 'approve-seller')).toBeNull();
  });
});
