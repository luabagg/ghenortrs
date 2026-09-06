import { B2BImageViewer } from '~/components/b2b/b2b-image-viewer';
import { ProductThumb } from '~/components/b2b/product-row';
import { TIER_LABELS } from '~/components/b2b/tier-dropdown';
import { formatCentsToBRL } from '~/lib/br-money';
import { SELLER_TIERS, type SellerTier } from '~/server/seller-tier';
import { useState } from 'react';

export type ProductDetailModel = {
  name: string;
  imageUrl: string | null;
  sku: string | null;
  category: string | null;
  unit: string | null;
  stock: number | null;
  description: string;
  prices: {
    startCents: number | null;
    proCents: number | null;
    maxCents: number | null;
  };
};

export function ProductDetailContent({
  product,
  tier,
  showAppliedTier = false,
  onImageExpandedChange,
}: {
  product: ProductDetailModel;
  tier?: SellerTier;
  showAppliedTier?: boolean;
  onImageExpandedChange?: (expanded: boolean) => void;
}) {
  const [expanded, setExpandedState] = useState(false);
  const setExpanded = (value: boolean) => {
    setExpandedState(value);
    onImageExpandedChange?.(value);
  };
  const identifiers = [
    product.sku ? `SKU ${product.sku}` : null,
    product.category,
    product.unit ? `Unidade ${product.unit}` : null,
    product.stock === null ? null : `Estoque ${product.stock}`,
  ].filter(Boolean);
  const prices = {
    startCents: product.prices.startCents,
    proCents: product.prices.proCents,
    maxCents: product.prices.maxCents,
  };

  return (
    <div>
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
          const active = showAppliedTier && value === tier;
          const cents = prices[`${value}Cents` as keyof typeof prices];
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
                {cents === null ? '—' : formatCentsToBRL(cents)}
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

      {expanded && product.imageUrl ? (
        <B2BImageViewer
          alt={product.name}
          src={`${product.imageUrl}?size=full`}
          onClose={() => setExpanded(false)}
        />
      ) : null}
    </div>
  );
}
