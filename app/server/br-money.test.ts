import { describe, expect, it } from 'vitest';

import { formatCentsToBRL, parseBrMoneyToCents } from './br-money';

describe('parseBrMoneyToCents', () => {
  it('parses Brazilian money strings to integer cents', () => {
    expect(parseBrMoneyToCents('61,49')).toBe(6149);
    expect(parseBrMoneyToCents('R$ 1.234,56')).toBe(123456);
    expect(parseBrMoneyToCents('')).toBeNull();
  });
});

describe('formatCentsToBRL', () => {
  it('formats integer cents as Brazilian reais', () => {
    expect(formatCentsToBRL(6149)).toBe('R$ 61,49');
    expect(formatCentsToBRL(123456)).toBe('R$ 1.234,56');
    expect(formatCentsToBRL(0)).toBe('R$ 0,00');
  });
});
