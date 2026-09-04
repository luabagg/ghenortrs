import { describe, expect, it } from 'vitest';

import {
  calculateOrderPricing,
  MAX_MINIMUM_SUBTOTAL_CENTS,
  PRO_MINIMUM_SUBTOTAL_CENTS,
  resolveOrderTier,
} from './order-pricing';

const prices = {
  startCents: 10_000,
  proCents: 9_000,
  maxCents: 8_000,
};

describe('resolveOrderTier', () => {
  it.each([
    [0, 'start'],
    [PRO_MINIMUM_SUBTOTAL_CENTS - 1, 'start'],
    [PRO_MINIMUM_SUBTOTAL_CENTS, 'pro'],
    [MAX_MINIMUM_SUBTOTAL_CENTS - 1, 'pro'],
    [MAX_MINIMUM_SUBTOTAL_CENTS, 'max'],
  ] as const)(
    'maps a Start-price subtotal of %d cents to %s',
    (subtotal, tier) => {
      expect(resolveOrderTier(subtotal)).toBe(tier);
    },
  );
});

describe('calculateOrderPricing', () => {
  it('uses total units across different products and qualifies from Start prices', () => {
    expect(
      calculateOrderPricing([
        { quantity: 4, prices },
        {
          quantity: 6,
          prices: {
            startCents: 12_000,
            proCents: 10_500,
            maxCents: 9_000,
          },
        },
      ]),
    ).toEqual({
      tier: 'pro',
      totalQuantity: 10,
      startSubtotalCents: 112_000,
      totalCents: 99_000,
      nextTier: 'max',
      amountToNextTierCents: 388_000,
    });
  });

  it('returns the Max total without a next tier', () => {
    expect(calculateOrderPricing([{ quantity: 50, prices }])).toEqual({
      tier: 'max',
      totalQuantity: 50,
      startSubtotalCents: 500_000,
      totalCents: 400_000,
      nextTier: null,
      amountToNextTierCents: 0,
    });
  });
});
