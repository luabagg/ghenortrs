import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Drawer } from '~/components/ui/drawer';
import { formatCentsToBRL } from '~/lib/br-money';
import type {
  AdminProductDetailRow,
  AdminProductRow,
} from '~/server/db/queries';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_price: 'Informe um preço válido.',
  price_update_failed: 'Não foi possível atualizar o preço.',
};

type DrawerData =
  | { product: AdminProductDetailRow }
  | { ok: true }
  | { ok: false; error: string };

export function AdminProductDrawer({
  product,
  onClose,
}: {
  product: AdminProductRow | null;
  onClose: () => void;
}) {
  const fetcher = useFetcher<DrawerData>();
  const { data, load } = fetcher;
  const path = product ? `/admin/produtos/${product.id}` : null;

  useEffect(() => {
    if (path) load(path);
  }, [load, path]);

  useEffect(() => {
    if (data && 'ok' in data && data.ok && path) load(path);
  }, [data, load, path]);

  if (!product || !path) return null;

  const detail =
    data && 'product' in data && data.product.id === product.id
      ? data.product
      : null;

  const error =
    data && 'error' in data
      ? (ERROR_MESSAGES[data.error] ?? 'Não foi possível salvar.')
      : null;

  return (
    <Drawer open title={product.name} onClose={onClose}>
      {detail ? (
        <div className="grid gap-6">
          {detail.imageUrl ? (
            <img
              alt={detail.name}
              className="h-48 w-full rounded-sm border border-border object-contain"
              src={`/api/b2b-product-image/${detail.id}`}
            />
          ) : null}

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Field label="SKU" value={detail.sku ?? '—'} />
            <Field label="Categoria" value={detail.category ?? '—'} />
            <Field label="Unidade" value={detail.unit ?? '—'} />
            <Field
              label="Estoque"
              value={detail.stock === null ? '—' : String(detail.stock)}
            />
            <Field label="Preço no Bling" value={money(detail.priceCents)} />
            <Field label="Custo no Bling" value={money(detail.costCents)} />
          </dl>

          {detail.description ? (
            <div className="grid gap-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
                Descrição
              </h3>
              <p className="whitespace-pre-line text-sm text-secondary">
                {detail.description}
              </p>
            </div>
          ) : null}

          <section className="grid gap-3 border-t border-border pt-5">
            <div className="grid gap-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
                Tabelas de preço
              </h3>
              <p className="text-xs text-secondary">
                Informe valores inteiros em centavos. R$ 500,00 = 50000.
              </p>
            </div>
            {(['start', 'pro', 'max'] as const).map((tier) => (
              <fetcher.Form
                key={tier}
                action={path}
                className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"
                method="post"
              >
                <input name="intent" type="hidden" value="save-tier-price" />
                <input name="tier" type="hidden" value={tier} />
                <label className="grid gap-2 text-sm text-secondary">
                  Tabela {label(tier)} (centavos)
                  <input
                    className="h-12 rounded-md border border-border-strong bg-background-soft px-4 text-sm text-primary"
                    defaultValue={detail[priceField(tier)] ?? ''}
                    min="0"
                    name="priceCents"
                    required
                    type="number"
                  />
                </label>
                <Button type="submit" variant="secondary">
                  Salvar
                </Button>
              </fetcher.Form>
            ))}
          </section>

          {error ? (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}

          <fetcher.Form action={path} method="post">
            <Button
              className="w-full"
              name="intent"
              type="submit"
              value={detail.visibleB2b ? 'hide-product' : 'show-product'}
              variant="secondary"
            >
              {detail.visibleB2b
                ? 'Ocultar do catálogo B2B'
                : 'Mostrar no catálogo B2B'}
            </Button>
          </fetcher.Form>
        </div>
      ) : (
        <p aria-live="polite" className="text-sm text-secondary" role="status">
          Carregando detalhes do produto…
        </p>
      )}
    </Drawer>
  );
}

function money(cents: number | null): string {
  return cents === null ? '—' : formatCentsToBRL(cents);
}

function label(tier: 'start' | 'pro' | 'max'): string {
  return tier[0].toUpperCase() + tier.slice(1);
}

function priceField(tier: 'start' | 'pro' | 'max') {
  return `price${label(tier)}Cents` as
    | 'priceStartCents'
    | 'priceProCents'
    | 'priceMaxCents';
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-secondary">{label}</dt>
      <dd className="text-primary">{value}</dd>
    </div>
  );
}
