import { useState } from 'react';

import type { B2BCatalogProduct } from '@/b2b/types';
import { QuantityStepper } from '@/components/b2b/quantity-stepper';
import { ProductDetailContent } from '@/components/catalog/product-detail-content';
import { Drawer } from '@/components/ui/drawer';
import type { SellerTier } from '@/server/seller-tier';

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
  return (
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
      <ProductDetailContent
        product={{
          ...product,
          prices: product.prices,
        }}
        showAppliedTier
        tier={tier}
        onImageExpandedChange={setExpanded}
      />
    </Drawer>
  );
}
