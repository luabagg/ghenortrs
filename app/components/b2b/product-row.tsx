import { useState } from 'react';

import { unitPriceForTier } from '@/b2b/order-pricing';
import type { B2BCatalogProduct } from '@/b2b/types';
import { QuantityStepper } from '@/components/b2b/quantity-stepper';
import { formatCentsToBRL } from '@/lib/br-money';
import type { SellerTier } from '@/server/seller-tier';

/**
 * Bling signs its image links and they expire, so a cached URL can start
 * returning 403. Fall back to the placeholder instead of an empty frame.
 */
export function ProductThumb({
  src,
  className = 'size-20',
}: {
  src: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const frame = `${className} shrink-0 rounded-sm border border-border bg-background-soft`;

  if (!src || failed) {
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
    <img
      alt=""
      className={`${frame} object-cover`}
      loading="lazy"
      src={src}
      onError={() => setFailed(true)}
    />
  );
}

/** The price the order pays now, with the best reachable price under it. */
export function PriceBlock({
  prices,
  tier,
}: {
  prices: B2BCatalogProduct['prices'];
  tier: SellerTier;
}) {
  return (
    <div className="grid gap-0.5 sm:text-right">
      <p className="font-body text-[15px] font-bold leading-5 text-primary">
        {formatCentsToBRL(unitPriceForTier(prices, tier))}
      </p>
      {tier === 'max' ? null : (
        <p className="font-body text-[12px] leading-4 text-secondary">
          Melhor valor:{' '}
          <span className="font-bold text-accent">
            {formatCentsToBRL(prices.maxCents)}
          </span>
        </p>
      )}
    </div>
  );
}

/**
 * The whole row opens the detail sheet. The name carries the button so screen
 * readers announce something meaningful; the overlay stretches the hit area
 * across the row without nesting the stepper inside a button.
 */
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
    <li className="group relative grid cursor-pointer gap-3 py-4 transition-colors hover:bg-surface/60 sm:grid-cols-[1fr_auto_8rem] sm:items-center sm:gap-6">
      <div className="flex items-center gap-3">
        <ProductThumb src={product.imageUrl} />
        <div className="grid gap-1">
          <button
            aria-haspopup="dialog"
            className="text-left font-body text-[14px] font-bold leading-5 text-primary after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline group-hover:underline"
            type="button"
            onClick={onOpenDetail}
          >
            {product.name}
          </button>
          {meta.length > 0 ? (
            <p className="font-body text-[12px] leading-5 text-secondary">
              {meta.join(' · ')}
            </p>
          ) : null}
        </div>
      </div>

      <PriceBlock prices={product.prices} tier={tier} />

      {/* Above the row overlay so the stepper stays independently clickable. */}
      <div className="relative z-10 cursor-auto">
        <QuantityStepper
          productName={product.name}
          quantity={quantity}
          onChange={onQuantityChange}
        />
      </div>
    </li>
  );
}

export function ProductRowSkeleton() {
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_8rem] sm:items-center sm:gap-6">
      <div className="flex items-center gap-3">
        <div className="size-20 shrink-0 animate-pulse rounded-sm bg-surface-elevated" />
        <div className="grid gap-2">
          <div className="h-4 w-56 max-w-[60vw] animate-pulse rounded-sm bg-surface-elevated" />
          <div className="h-3 w-28 animate-pulse rounded-sm bg-surface-elevated" />
        </div>
      </div>
      <div className="h-4 w-24 animate-pulse rounded-sm bg-surface-elevated sm:justify-self-end" />
      <div className="h-12 w-full animate-pulse rounded-md bg-surface-elevated sm:w-32" />
    </li>
  );
}
