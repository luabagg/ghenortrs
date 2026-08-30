export type SellerTier = 'start' | 'pro' | 'max';

export const SELLER_TIERS = ['start', 'pro', 'max'] as const;

export type TierPriceColumn =
  | 'priceStartCents'
  | 'priceProCents'
  | 'priceMaxCents';

export function isSellerTier(value: string): value is SellerTier {
  return (SELLER_TIERS as readonly string[]).includes(value);
}

export function parseSellerTier(
  value: string | null | undefined,
  fallback: SellerTier = 'start',
): SellerTier {
  const normalized = value?.trim().toLowerCase() ?? '';
  return isSellerTier(normalized) ? normalized : fallback;
}

export function tierPriceColumn(tier: SellerTier): TierPriceColumn {
  switch (tier) {
    case 'start':
      return 'priceStartCents';
    case 'pro':
      return 'priceProCents';
    case 'max':
      return 'priceMaxCents';
  }
}
