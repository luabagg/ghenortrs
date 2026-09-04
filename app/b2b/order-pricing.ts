import type { SellerTier } from '@/server/seller-tier';

export const PRO_MINIMUM_SUBTOTAL_CENTS = 100_000;
export const MAX_MINIMUM_SUBTOTAL_CENTS = 500_000;

export type B2BTierPrices = {
  startCents: number;
  proCents: number;
  maxCents: number;
};

export type PricedOrderItem = {
  quantity: number;
  prices: B2BTierPrices;
};

export type OrderPricing = {
  tier: SellerTier;
  totalQuantity: number;
  startSubtotalCents: number;
  totalCents: number;
  nextTier: Exclude<SellerTier, 'start'> | null;
  amountToNextTierCents: number;
};

export function resolveOrderTier(startSubtotalCents: number): SellerTier {
  if (startSubtotalCents >= MAX_MINIMUM_SUBTOTAL_CENTS) return 'max';
  if (startSubtotalCents >= PRO_MINIMUM_SUBTOTAL_CENTS) return 'pro';
  return 'start';
}

export function unitPriceForTier(
  prices: B2BTierPrices,
  tier: SellerTier,
): number {
  switch (tier) {
    case 'start':
      return prices.startCents;
    case 'pro':
      return prices.proCents;
    case 'max':
      return prices.maxCents;
  }
}

export function calculateOrderPricing(items: PricedOrderItem[]): OrderPricing {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const startSubtotalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.prices.startCents,
    0,
  );
  const tier = resolveOrderTier(startSubtotalCents);
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * unitPriceForTier(item.prices, tier),
    0,
  );

  if (tier === 'max') {
    return {
      tier,
      totalQuantity,
      startSubtotalCents,
      totalCents,
      nextTier: null,
      amountToNextTierCents: 0,
    };
  }

  const nextTier = tier === 'start' ? 'pro' : 'max';
  const nextThreshold =
    nextTier === 'pro'
      ? PRO_MINIMUM_SUBTOTAL_CENTS
      : MAX_MINIMUM_SUBTOTAL_CENTS;

  return {
    tier,
    totalQuantity,
    startSubtotalCents,
    totalCents,
    nextTier,
    amountToNextTierCents: Math.max(0, nextThreshold - startSubtotalCents),
  };
}
