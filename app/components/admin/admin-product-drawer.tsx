import { useEffect, useRef, useState } from 'react';

import type { AdminProductRow } from '~/server/db/queries';
import { ProductDetailContent } from '~/components/catalog/product-detail-content';
import { Button } from '~/components/ui/button';
import { Drawer } from '~/components/ui/drawer';
import { Link, useFetcher } from '@remix-run/react';

export function AdminProductDrawer({ product }: { product: AdminProductRow }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fetcher = useFetcher<{
    product: AdminProductRow & {
      description: string;
      imageUrl: string | null;
      unit: string | null;
      stock: number | null;
      priceStartCents: number | null;
      priceProCents: number | null;
      priceMaxCents: number | null;
    };
  }>();
  const { data, load, state } = fetcher;
  const requestedProductId = useRef<number | null>(null);
  useEffect(() => {
    if (
      open &&
      !data &&
      state === 'idle' &&
      requestedProductId.current !== product.id
    ) {
      requestedProductId.current = product.id;
      load(`/admin/produtos/${product.id}`);
    }
  }, [data, load, open, product.id, state]);
  const detail = data?.product;
  return (
    <>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        Detalhes
      </Button>
      {open ? (
        <Drawer
          open
          title={product.name}
          closeOnEscape={!expanded}
          onClose={() => setOpen(false)}
        >
          {detail ? (
            <ProductDetailContent
              onImageExpandedChange={setExpanded}
              product={{
                name: detail.name,
                imageUrl: detail.imageUrl,
                sku: detail.sku,
                category: detail.category,
                unit: detail.unit,
                stock: detail.stock,
                description: detail.description,
                prices: {
                  startCents: detail.priceStartCents,
                  proCents: detail.priceProCents,
                  maxCents: detail.priceMaxCents,
                },
              }}
            />
          ) : (
            <p
              aria-live="polite"
              className="text-sm text-secondary"
              role="status"
            >
              Carregando detalhes do produto…
            </p>
          )}
          <Link
            className="mt-6 inline-block text-sm text-primary underline"
            to={`/admin/produtos/${product.id}`}
          >
            Editar preços e visibilidade
          </Link>
        </Drawer>
      ) : null}
    </>
  );
}
