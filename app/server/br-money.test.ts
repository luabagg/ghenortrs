import { describe, expect, it } from 'vitest';

import { parseBrMoneyToCents } from './br-money';

describe('parseBrMoneyToCents', () => {
  it('parses Brazilian money strings to integer cents', () => {
    expect(parseBrMoneyToCents('61,49')).toBe(6149);
    expect(parseBrMoneyToCents('R$ 1.234,56')).toBe(123456);
    expect(parseBrMoneyToCents('')).toBeNull();
  });
});
