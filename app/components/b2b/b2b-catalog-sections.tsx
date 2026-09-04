import {
  MAX_MINIMUM_SUBTOTAL_CENTS,
  PRO_MINIMUM_SUBTOTAL_CENTS,
  unitPriceForTier,
  type OrderPricing,
} from '@/b2b/order-pricing';
import type { B2BCatalogProduct } from '@/b2b/types';
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
    <ul className="grid divide-y divide-border border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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

/**
 * Bling hosts the file; we cache only its URL. The empty alt is deliberate:
 * the product name sits beside the thumb, so announcing it twice adds noise.
 * The placeholder keeps the footprint so rows stay aligned.
 */
export function ProductThumb({
  src,
  className = 'size-20',
}: {
  src: string | null;
  className?: string;
}) {
  const frame = `${className} shrink-0 rounded-sm border border-border bg-background-soft`;

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`${frame} grid place-items-center text-center font-body text-[11px] leading-4 text-secondary`}
      >
        sem foto
      </div>
    );
  }

  return (
    <img alt="" className={`${frame} object-cover`} loading="lazy" src={src} />
  );
}

/**
 * The price the order pays now. The Max price sits under it in accent, the way
 * a storefront marks a better price the buyer has not unlocked yet.
 */
export function PriceBlock({
  prices,
  tier,
  align = 'right',
}: {
  prices: B2BCatalogProduct['prices'];
  tier: SellerTier;
  align?: 'left' | 'right';
}) {
  return (
    <div className={`grid gap-0.5 ${align === 'right' ? 'sm:text-right' : ''}`}>
      <p className="font-body text-[15px] font-bold leading-5 text-primary">
        {formatCentsToBRL(unitPriceForTier(prices, tier))}
      </p>
      {tier === 'max' ? null : (
        <p className="font-body text-[12px] font-bold leading-4 text-accent">
          Max {formatCentsToBRL(prices.maxCents)}
        </p>
      )}
    </div>
  );
}

/**
 * Empty state is a single Adicionar button. Once the order holds the product
 * it becomes a stepper whose middle stays typable, because a wholesale order
 * of 60 units should not need 60 taps.
 */
export function QuantityStepper({
  quantity,
  productName,
  onChange,
}: {
  quantity: number;
  productName: string;
  onChange: (next: number) => void;
}) {
  if (quantity <= 0) {
    return (
      <Button
        aria-label={`Adicionar ${productName} ao pedido`}
        className="w-full sm:w-32"
        type="button"
        variant="outline"
        onClick={() => onChange(1)}
      >
        Adicionar
      </Button>
    );
  }

  return (
    <div className="flex h-12 w-full items-center justify-between rounded-md border border-accent sm:w-32">
      <StepButton
        label={`Remover uma unidade de ${productName}`}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </StepButton>
      <input
        aria-label={`Quantidade de ${productName}`}
        className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-center font-body text-[15px] font-bold text-primary focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        inputMode="numeric"
        min={0}
        step={1}
        type="number"
        value={quantity}
        onChange={(event) =>
          onChange(Math.max(0, Math.floor(Number(event.target.value) || 0)))
        }
      />
      <StepButton
        label={`Adicionar uma unidade de ${productName}`}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </StepButton>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-full w-10 shrink-0 place-items-center font-body text-[18px] leading-none text-accent transition-colors hover:bg-accent/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ProductRow({
  product,
  quantity,
  tier,
  onQuantityChange,
  onOpenDetail,
}: {
  product: B2BCatalogProduct;
  quantity: number;
  tier: SellerTier;
  onQuantityChange: (next: number) => void;
  onOpenDetail: () => void;
}) {
  const meta = [
    product.category,
    product.stock === null ? null : `estoque ${product.stock}`,
  ].filter(Boolean);

  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_8rem] sm:items-center sm:gap-6">
      <button
        aria-haspopup="dialog"
        className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        type="button"
        onClick={onOpenDetail}
      >
        <ProductThumb src={product.imageUrl} />
        <span className="grid gap-1">
          <span className="font-body text-[14px] font-bold leading-5 text-primary">
            {product.name}
          </span>
          {meta.length > 0 ? (
            <span className="font-body text-[12px] leading-5 text-secondary">
              {meta.join(' · ')}
            </span>
          ) : null}
          <span className="font-body text-[12px] leading-5 text-secondary underline underline-offset-2">
            Ver detalhes
          </span>
        </span>
      </button>

      <PriceBlock prices={product.prices} tier={tier} />

      <QuantityStepper
        productName={product.name}
        quantity={quantity}
        onChange={onQuantityChange}
      />
    </li>
  );
}

export function OrderSummary({
  pricing,
  minimumOrderQuantity,
}: {
  pricing: OrderPricing;
  minimumOrderQuantity: number;
}) {
  const missingUnits = Math.max(
    0,
    minimumOrderQuantity - pricing.totalQuantity,
  );

  return (
    <dl className="grid gap-3 border border-border bg-surface p-4 sm:grid-cols-2">
      <SummaryRow
        label="Unidades"
        value={
          missingUnits > 0
            ? `${pricing.totalQuantity} de ${minimumOrderQuantity} (faltam ${missingUnits})`
            : String(pricing.totalQuantity)
        }
      />
      <SummaryRow label="Tabela aplicada" value={TIER_LABELS[pricing.tier]} />
      <SummaryRow
        label="Base da tabela"
        value={formatCentsToBRL(pricing.startSubtotalCents)}
      />
      <SummaryRow
        label="Total do pedido"
        value={formatCentsToBRL(pricing.totalCents)}
      />
      <div className="sm:col-span-2">
        <p className="font-body text-[12px] leading-5 text-secondary">
          {pricing.nextTier
            ? `Some ${formatCentsToBRL(pricing.amountToNextTierCents)} à base da tabela para chegar na tabela ${TIER_LABELS[pricing.nextTier]}.`
            : 'Você está na melhor tabela, a Max.'}
        </p>
      </div>
    </dl>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
        {label}
      </dt>
      <dd className="font-body text-[14px] leading-5 text-primary">{value}</dd>
    </div>
  );
}
