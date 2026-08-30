import { describe, expect, it } from 'vitest';

import { isAdminEmail, parseAdminEmails } from './admin-emails';

describe('parseAdminEmails', () => {
  it('splits, trims, and lowercases a comma list', () => {
    expect(parseAdminEmails(' Ada@Gheno.com , , bob@gheno.com')).toEqual([
      'ada@gheno.com',
      'bob@gheno.com',
    ]);
    expect(parseAdminEmails('')).toEqual([]);
    expect(parseAdminEmails(undefined)).toEqual([]);
  });
});

describe('isAdminEmail', () => {
  it('requires a non-empty allowlist match', () => {
    expect(isAdminEmail('ada@gheno.com', ['ada@gheno.com'])).toBe(true);
    expect(isAdminEmail('ADA@gheno.com', ['ada@gheno.com'])).toBe(true);
    expect(isAdminEmail('loja@example.com', ['ada@gheno.com'])).toBe(false);
    expect(isAdminEmail('ada@gheno.com', [])).toBe(false);
    expect(isAdminEmail(null, ['ada@gheno.com'])).toBe(false);
  });
});
