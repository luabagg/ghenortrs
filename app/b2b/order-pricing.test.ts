import { describe, expect, it } from 'vitest';

import {
  calculateOrderPricing,
  MAX_MINIMUM_SUBTOTAL_CENTS,
  MINIMUM_ORDER_SUBTOTAL_CENTS,
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
    [49_999, 'start'],
    [MINIMUM_ORDER_SUBTOTAL_CENTS, 'start'],
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
  it.each([
    [49_999, 1],
    [50_000, 0],
  ] as const)(
    'reports how many cents are missing from the R$500 merchandise minimum at %d cents',
    (startCents, missingCents) => {
      expect(
        calculateOrderPricing([
          {
            quantity: 1,
            prices: {
              startCents,
              proCents: Math.max(0, startCents - 1_000),
              maxCents: Math.max(0, startCents - 2_000),
            },
          },
        ]),
      ).toMatchObject({
        startSubtotalCents: startCents,
        minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
        amountToMinimumSubtotalCents: missingCents,
      });
    },
  );

  it('lets a single R$500 item qualify for review without changing the tier', () => {
    expect(
      calculateOrderPricing([
        {
          quantity: 1,
          prices: { startCents: 50_000, proCents: 45_000, maxCents: 40_000 },
        },
      ]),
    ).toEqual({
      tier: 'start',
      totalQuantity: 1,
      startSubtotalCents: 50_000,
      totalCents: 50_000,
      nextTier: 'pro',
      amountToNextTierCents: 100_000,
      minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      amountToMinimumSubtotalCents: 0,
    });
  });

  it('uses total units across different products and qualifies Pro from Start prices before discounts', () => {
    expect(
      calculateOrderPricing([
        { quantity: 3, prices },
        {
          quantity: 10,
          prices: {
            startCents: 12_000,
            proCents: 10_500,
            maxCents: 9_000,
          },
        },
      ]),
    ).toEqual({
      tier: 'pro',
      totalQuantity: 13,
      startSubtotalCents: 150_000,
      totalCents: 132_000,
      nextTier: 'max',
      amountToNextTierCents: 250_000,
      minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      amountToMinimumSubtotalCents: 0,
    });
  });

  it('returns the Max total without a next tier', () => {
    expect(calculateOrderPricing([{ quantity: 40, prices }])).toEqual({
      tier: 'max',
      totalQuantity: 40,
      startSubtotalCents: 400_000,
      totalCents: 320_000,
      nextTier: null,
      amountToNextTierCents: 0,
      minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      amountToMinimumSubtotalCents: 0,
    });
  });
});
