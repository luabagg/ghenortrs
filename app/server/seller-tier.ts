export type SellerTier = 'start' | 'pro' | 'max';

export type TierPriceColumn =
  | 'priceStartCents'
  | 'priceProCents'
  | 'priceMaxCents';

export function resolveSellerTier(volume: number): SellerTier {
  if (volume >= 5000) return 'max';
  if (volume > 1000) return 'pro';
  return 'start';
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
