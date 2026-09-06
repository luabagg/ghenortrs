import {
  MAX_MINIMUM_SUBTOTAL_CENTS,
  MINIMUM_ORDER_SUBTOTAL_CENTS,
  PRO_MINIMUM_SUBTOTAL_CENTS,
} from '@/b2b/order-pricing';
import { Button } from '@/components/ui/button';
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
    range: `${formatCentsToBRL(MINIMUM_ORDER_SUBTOTAL_CENTS)} a ${formatCentsToBRL(PRO_MINIMUM_SUBTOTAL_CENTS - 1)}`,
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TierDropdown({
  activeTier,
  open,
  onToggle,
}: {
  activeTier: SellerTier;
  open: boolean;
  onToggle: () => void;
}) {
  const activeLabel = TIER_LABELS[activeTier];

  return (
    <div className="relative min-w-0">
      <Button
        aria-controls="b2b-tier-options"
        aria-expanded={open}
        aria-label={`Tabela atual: ${activeLabel}. ${open ? 'Ocultar' : 'Mostrar'} tabelas de preço`}
        className="w-full justify-between px-3 sm:px-5"
        type="button"
        variant="secondary"
        onClick={onToggle}
      >
        <span className="truncate">Tabela {activeLabel}</span>
        <ChevronIcon open={open} />
      </Button>

      {open ? (
        <ul
          aria-label="Tabelas de preço"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 grid w-[calc(200%+0.5rem)] divide-y divide-border border border-border bg-surface sm:w-[28rem]"
          id="b2b-tier-options"
        >
          {TIER_BANDS.map(({ tier, range }) => {
            const active = tier === activeTier;
            return (
              <li
                key={tier}
                aria-current={active ? 'true' : undefined}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3"
              >
                <span
                  className={`font-body text-[13px] font-bold uppercase tracking-[0.12em] ${
                    active ? 'text-accent' : 'text-secondary'
                  }`}
                >
                  Tabela {TIER_LABELS[tier]}
                </span>
                <span className="text-right font-body text-[12px] leading-5 text-secondary">
                  {range}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
