import { useState } from 'react';

import { unitPriceForTier } from '@/b2b/order-pricing';
import type { B2BCatalogProduct } from '@/b2b/types';
import { B2BImageViewer } from '@/components/b2b/b2b-image-viewer';
import { ProductThumb } from '@/components/b2b/product-row';
import { QuantityStepper } from '@/components/b2b/quantity-stepper';
import { TIER_LABELS } from '@/components/b2b/tier-ladder';
import { Drawer } from '@/components/ui/drawer';
import { formatCentsToBRL } from '@/lib/br-money';
import { SELLER_TIERS, type SellerTier } from '@/server/seller-tier';

/**
 * Everything the row leaves out: the full description, the identifiers, and
 * all three table prices. The row stays scannable because this exists.
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
  const [expanded, setExpanded] = useState(false);

  if (!product) return null;

  const identifiers = [
    product.sku ? `SKU ${product.sku}` : null,
    product.category,
    product.unit ? `Unidade ${product.unit}` : null,
    product.stock === null ? null : `Estoque ${product.stock}`,
  ].filter(Boolean);

  return (
    <>
      <Drawer
        closeOnEscape={!expanded}
        footer={
          <QuantityStepper
            productName={product.name}
            quantity={quantity}
            onChange={onQuantityChange}
          />
        }
        open
        title={product.name}
        onClose={onClose}
      >
        {product.imageUrl ? (
          <button
            aria-label={`Ampliar a foto de ${product.name}`}
            className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            type="button"
            onClick={() => setExpanded(true)}
          >
            <ProductThumb className="h-48 w-full" src={product.imageUrl} />
          </button>
        ) : (
          <ProductThumb className="h-48 w-full" src={null} />
        )}

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
      </Drawer>

      {expanded && product.imageUrl ? (
        <B2BImageViewer
          alt={product.name}
          src={`${product.imageUrl}?size=full`}
          onClose={() => setExpanded(false)}
        />
      ) : null}
    </>
  );
}
