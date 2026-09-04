import type { ChangeEvent } from 'react';

import {
  MAX_MINIMUM_SUBTOTAL_CENTS,
  PRO_MINIMUM_SUBTOTAL_CENTS,
  unitPriceForTier,
  type OrderPricing,
} from '@/b2b/order-pricing';
import type { B2BCatalogProduct } from '@/b2b/types';
import { formatCentsToBRL } from '@/lib/br-money';
import type { SellerTier } from '@/server/seller-tier';
import { Input } from '@/components/ui/input';

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
 * Bling hosts the file; we cache only its URL. The empty alt is deliberate.
 * The product name sits beside the thumb, so announcing it twice adds noise.
 * The placeholder keeps the same footprint so rows stay aligned.
 */
function ProductThumb({ src, name }: { src: string | null; name: string }) {
  const frame =
    'size-16 shrink-0 rounded-sm border border-border bg-background-soft';

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`${frame} grid place-items-center font-body text-[11px] text-secondary`}
      >
        sem foto
      </div>
    );
  }

  return (
    <img
      alt=""
      className={`${frame} object-cover`}
      height={64}
      loading="lazy"
      src={src}
      title={name}
      width={64}
    />
  );
}

export function ProductRow({
  product,
  quantity,
  tier,
  onQuantityChange,
}: {
  product: B2BCatalogProduct;
  quantity: number;
  tier: SellerTier;
  onQuantityChange: (next: number) => void;
}) {
  const unitPriceCents = unitPriceForTier(product.prices, tier);
  const meta = [
    product.sku ? `SKU ${product.sku}` : null,
    product.category,
    product.stock === null ? null : `estoque ${product.stock}`,
  ].filter(Boolean);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    onQuantityChange(Math.max(0, Math.floor(Number(event.target.value) || 0)));
  }

  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_8rem] sm:items-start sm:gap-6">
      <div className="flex items-start gap-3">
        <ProductThumb name={product.name} src={product.imageUrl} />
        <div className="grid gap-1">
          <p className="font-body text-[14px] font-bold leading-5 text-primary">
            {product.name}
          </p>
          {meta.length > 0 ? (
            <p className="font-body text-[12px] leading-5 text-secondary">
              {meta.join(' · ')}
            </p>
          ) : null}
          {product.description ? (
            <p className="max-w-prose font-body text-[12px] leading-5 text-secondary">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-1 sm:text-right">
        <p className="font-body text-[14px] font-bold leading-5 text-primary">
          {formatCentsToBRL(unitPriceCents)}
          {product.unit ? (
            <span className="font-medium text-secondary">
              {' '}
              / {product.unit}
            </span>
          ) : null}
        </p>
        {tier === 'max' ? null : (
          <p className="font-body text-[12px] leading-5 text-secondary">
            Max {formatCentsToBRL(product.prices.maxCents)}
          </p>
        )}
      </div>

      <Input
        aria-label={`Quantidade de ${product.name}`}
        min={0}
        step={1}
        type="number"
        value={quantity}
        onChange={onChange}
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
