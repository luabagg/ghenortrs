import { useCallback, useMemo, useState } from 'react';

import { calculateOrderPricing, type OrderPricing } from '@/b2b/order-pricing';
import type { B2BCatalogProduct, QuoteSelectionItem } from '@/b2b/types';

export type OrderDraft = {
  items: QuoteSelectionItem[];
  pricing: OrderPricing;
  totalQuantity: number;
  quantityOf: (productId: number) => number;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

/**
 * One owner for the order the seller is building. Every surface that reads or
 * edits it - the row, the detail drawer, the review step - goes through here,
 * so adding a surface never means threading another pair of props.
 */
export function useOrderDraft(products: B2BCatalogProduct[]): OrderDraft {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const quantityOf = useCallback(
    (productId: number) => quantities[productId] ?? 0,
    [quantities],
  );

  const setQuantity = useCallback((productId: number, quantity: number) => {
    const next = Math.max(0, Math.floor(quantity) || 0);
    setQuantities((prev) => {
      if (next === 0) {
        // Drop the key so a cleared product never reaches the request body.
        const rest = { ...prev };
        delete rest[productId];
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const items = useMemo(
    () =>
      products
        .filter((product) => (quantities[product.id] ?? 0) > 0)
        .map((product) => ({
          product,
          quantity: quantities[product.id] ?? 0,
        })),
    [products, quantities],
  );

  const pricing = useMemo(
    () =>
      calculateOrderPricing(
        items.map((item) => ({
          quantity: item.quantity,
          prices: item.product.prices,
        })),
      ),
    [items],
  );

  return {
    items,
    pricing,
    totalQuantity: pricing.totalQuantity,
    quantityOf,
    setQuantity,
    clear,
  };
}
