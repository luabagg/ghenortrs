import { useState, type KeyboardEvent } from 'react';
import { Form } from '@remix-run/react';

import { AdminProductDrawer } from '~/components/admin/admin-product-drawer';
import { Button } from '~/components/ui/button';
import type { AdminProductRow } from '~/server/db/queries';

export function AdminProductsTable({
  products,
  query,
}: {
  products: AdminProductRow[];
  query: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [detailProduct, setDetailProduct] = useState<AdminProductRow | null>(
    null,
  );

  function setSelected(id: number, selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function openWithKeyboard(
    event: KeyboardEvent<HTMLTableRowElement>,
    product: AdminProductRow,
  ) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setDetailProduct(product);
  }

  const selectedCount = selectedIds.size;

  return (
    <>
      <Form className={selectedCount > 0 ? 'pb-20' : undefined} method="post">
        <input name="q" type="hidden" value={query} />

        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-secondary">
              <tr>
                <th className="px-4 py-3 font-bold">
                  <span className="sr-only">Selecionar</span>
                </th>
                <th className="px-4 py-3 font-bold">SKU</th>
                <th className="px-4 py-3 font-bold">Produto</th>
                <th className="px-4 py-3 font-bold">Categoria</th>
                <th className="px-4 py-3 font-bold">Bling</th>
                <th className="px-4 py-3 font-bold">Catálogo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  aria-label={`Abrir ${product.name}`}
                  className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/70"
                  tabIndex={0}
                  onClick={() => setDetailProduct(product)}
                  onKeyDown={(event) => openWithKeyboard(event, product)}
                >
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Selecionar ${product.name}`}
                      checked={selectedIds.has(product.id)}
                      name="productIds"
                      type="checkbox"
                      value={product.id}
                      onChange={(event) =>
                        setSelected(product.id, event.currentTarget.checked)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {product.sku ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-primary">{product.name}</td>
                  <td className="px-4 py-3 text-secondary">
                    {product.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {product.active ? 'Ativo' : 'Inativo'}
                  </td>
                  <td className="px-4 py-3 text-primary">
                    {product.visibleB2b ? 'Visível' : 'Oculto'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCount > 0 ? (
          <div
            aria-label="Ações em massa"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/96 backdrop-blur"
            role="group"
          >
            <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-6 py-3 sm:px-10 lg:px-16">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-primary">
                  {selectedCount}{' '}
                  {selectedCount === 1
                    ? 'produto selecionado'
                    : 'produtos selecionados'}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Limpar seleção
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  name="intent"
                  type="submit"
                  value="bulk-show"
                  variant="secondary"
                >
                  Mostrar selecionados
                </Button>
                <Button
                  name="intent"
                  type="submit"
                  value="bulk-hide"
                  variant="secondary"
                >
                  Ocultar selecionados
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Form>

      <AdminProductDrawer
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </>
  );
}
