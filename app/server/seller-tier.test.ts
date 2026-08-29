import { describe, expect, it } from 'vitest';

import { resolveSellerTier, tierPriceColumn } from './seller-tier';

describe('resolveSellerTier', () => {
  it('maps volume to start, pro, or max tier', () => {
    expect(resolveSellerTier(0)).toBe('start');
    expect(resolveSellerTier(1000)).toBe('start');
    expect(resolveSellerTier(1001)).toBe('pro');
    expect(resolveSellerTier(4999)).toBe('pro');
    expect(resolveSellerTier(5000)).toBe('max');
  });
});

describe('tierPriceColumn', () => {
  it('maps each tier to its price column', () => {
    expect(tierPriceColumn('start')).toBe('priceStartCents');
    expect(tierPriceColumn('pro')).toBe('priceProCents');
    expect(tierPriceColumn('max')).toBe('priceMaxCents');
  });
});
