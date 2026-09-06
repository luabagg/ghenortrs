import type { SellerTier } from '@/server/seller-tier';

export const MINIMUM_ORDER_SUBTOTAL_CENTS = 50_000;
export const PRO_MINIMUM_SUBTOTAL_CENTS = 150_000;
export const MAX_MINIMUM_SUBTOTAL_CENTS = 400_000;

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
  minimumOrderSubtotalCents: number;
  amountToMinimumSubtotalCents: number;
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

  const amountToMinimumSubtotalCents = Math.max(
    0,
    MINIMUM_ORDER_SUBTOTAL_CENTS - startSubtotalCents,
  );

  if (tier === 'max') {
    return {
      tier,
      totalQuantity,
      startSubtotalCents,
      totalCents,
      nextTier: null,
      amountToNextTierCents: 0,
      minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      amountToMinimumSubtotalCents,
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
    minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
    amountToMinimumSubtotalCents,
  };
}
