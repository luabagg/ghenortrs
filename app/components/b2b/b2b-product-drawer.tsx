import { useEffect, useRef } from 'react';

import { unitPriceForTier } from '@/b2b/order-pricing';
import type { B2BCatalogProduct } from '@/b2b/types';
import {
  ProductThumb,
  QuantityStepper,
  TIER_LABELS,
} from '@/components/b2b/b2b-catalog-sections';
import { formatCentsToBRL } from '@/lib/br-money';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';
import { SELLER_TIERS, type SellerTier } from '@/server/seller-tier';

/**
 * Everything the row leaves out: the full Bling description, the identifiers,
 * and all three table prices. The row stays scannable because this exists.
 */
export function B2BProductDrawer({
  product,
  quantity,
  tier,
  onQuantityChange,
  onClose,
}: {
  product: B2BCatalogProduct | null;
  quantity: number;
  tier: SellerTier;
  onQuantityChange: (next: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = product !== null;

  useBodyScrollLock(open);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!product) return null;

  const identifiers = [
    product.sku ? `SKU ${product.sku}` : null,
    product.category,
    product.unit ? `Unidade ${product.unit}` : null,
    product.stock === null ? null : `Estoque ${product.stock}`,
  ].filter(Boolean);

  return (
    <div
      aria-label={product.name}
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
    >
      <button
        aria-label="Fechar detalhes"
        className="absolute inset-0 bg-overlay/70"
        tabIndex={-1}
        type="button"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full flex-col border-l border-border-strong bg-surface sm:max-w-md">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="font-heading text-[22px] leading-tight tracking-[-0.03em] text-primary">
            {product.name}
          </h2>
          <button
            ref={closeRef}
            aria-label="Fechar detalhes"
            className="shrink-0 font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            type="button"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          data-scroll-lock-scrollable
        >
          <ProductThumb className="h-48 w-full" src={product.imageUrl} />

          {identifiers.length > 0 ? (
            <p className="mt-4 font-body text-[12px] leading-5 text-secondary">
              {identifiers.join(' · ')}
            </p>
          ) : null}

          <h3 className="mt-6 font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
            Tabelas de preço
          </h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {SELLER_TIERS.map((value) => {
              const active = value === tier;
              return (
                <li
                  key={value}
                  aria-current={active ? 'true' : undefined}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <span
                    className={`font-body text-[13px] ${active ? 'font-bold text-primary' : 'text-secondary'}`}
                  >
                    {TIER_LABELS[value]}
                    {active ? ' · aplicada agora' : ''}
                  </span>
                  <span
                    className={`font-body text-[14px] font-bold ${active ? 'text-primary' : 'text-secondary'}`}
                  >
                    {formatCentsToBRL(unitPriceForTier(product.prices, value))}
                  </span>
                </li>
              );
            })}
          </ul>

          {product.description ? (
            <>
              <h3 className="mt-6 font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
                Descrição
              </h3>
              <p className="mt-2 whitespace-pre-line font-body text-[13px] leading-6 text-secondary">
                {product.description}
              </p>
            </>
          ) : null}
        </div>

        <div className="border-t border-border px-5 py-4">
          <QuantityStepper
            productName={product.name}
            quantity={quantity}
            onChange={onQuantityChange}
          />
        </div>
      </div>
    </div>
  );
}
