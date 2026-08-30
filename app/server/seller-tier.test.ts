import { describe, expect, it } from 'vitest';

import { parseSellerTier, tierPriceColumn } from './seller-tier';

describe('parseSellerTier', () => {
  it('accepts start, pro, and max and defaults invalid values', () => {
    expect(parseSellerTier('start')).toBe('start');
    expect(parseSellerTier('PRO')).toBe('pro');
    expect(parseSellerTier(' max ')).toBe('max');
    expect(parseSellerTier(null)).toBe('start');
    expect(parseSellerTier('gold', 'pro')).toBe('pro');
  });
});

describe('tierPriceColumn', () => {
  it('maps each tier to its price column', () => {
    expect(tierPriceColumn('start')).toBe('priceStartCents');
    expect(tierPriceColumn('pro')).toBe('priceProCents');
    expect(tierPriceColumn('max')).toBe('priceMaxCents');
  });
});
