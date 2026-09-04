import {
  MAX_MINIMUM_SUBTOTAL_CENTS,
  PRO_MINIMUM_SUBTOTAL_CENTS,
} from '@/b2b/order-pricing';
import { formatCentsToBRL } from '@/lib/br-money';
import type { SellerTier } from '@/server/seller-tier';

export const TIER_LABELS: Record<SellerTier, string> = {
  start: 'Start',
  pro: 'Pro',
  max: 'Max',
};

const TIER_BANDS: Array<{ tier: SellerTier; range: string }> = [
  {
    tier: 'start',
    range: `Até ${formatCentsToBRL(PRO_MINIMUM_SUBTOTAL_CENTS - 1)}`,
  },
  {
    tier: 'pro',
    range: `${formatCentsToBRL(PRO_MINIMUM_SUBTOTAL_CENTS)} a ${formatCentsToBRL(MAX_MINIMUM_SUBTOTAL_CENTS - 1)}`,
  },
  {
    tier: 'max',
    range: `${formatCentsToBRL(MAX_MINIMUM_SUBTOTAL_CENTS)} ou mais`,
  },
];

/** Text-first band strip with hairline dividers, per the trust-bar rule. */
export function TierLadder({ activeTier }: { activeTier: SellerTier }) {
  return (
    <ul
      aria-label="Tabelas de preço"
      className="grid divide-y divide-border border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      {TIER_BANDS.map(({ tier, range }) => {
        const active = tier === activeTier;
        return (
          <li
            key={tier}
            aria-current={active ? 'true' : undefined}
            className="grid gap-1 px-4 py-3"
          >
            <span
              className={`font-body text-[13px] font-bold uppercase tracking-[0.12em] ${
                active ? 'text-accent' : 'text-secondary'
              }`}
            >
              Tabela {TIER_LABELS[tier]}
            </span>
            <span className="font-body text-[12px] leading-5 text-secondary">
              {range}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
