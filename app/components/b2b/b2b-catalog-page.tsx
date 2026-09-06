import { useEffect, useMemo, useState } from 'react';
import { Link } from '@remix-run/react';

import { MINIMUM_ORDER_SUBTOTAL_CENTS } from '@/b2b/order-pricing';
import { useB2BCatalogQuery, useSubmitB2BQuoteMutation } from '@/b2b/queries';
import { useB2BSession } from '@/b2b/use-b2b-session';
import type { B2BCatalogProduct } from '@/b2b/types';
import { useOrderDraft } from '@/b2b/use-order-draft';
import { B2BOrderReview } from '@/components/b2b/b2b-order-review';
import {
  B2BOrderSent,
  type SentSummary,
} from '@/components/b2b/b2b-order-sent';
import { B2BProductDrawer } from '@/components/b2b/b2b-product-drawer';
import { ProductRow, ProductRowSkeleton } from '@/components/b2b/product-row';
import { TierDropdown } from '@/components/b2b/tier-dropdown';
import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCentsToBRL } from '@/lib/br-money';

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  minimum_order_subtotal_not_met:
    'O pedido ainda não alcança o mínimo em mercadorias.',
  product_not_found: 'Um dos produtos saiu do catálogo. Atualize a página.',
};

const SKELETON_ROWS = [0, 1, 2, 3, 4];
const EMPTY_CATALOG_PRODUCTS: B2BCatalogProduct[] = [];

const PRICE_FILTERS = [
  { value: 'all', label: 'Todos os preços', min: null, max: null },
  { value: '-25000', label: 'Até R$ 249,99', min: null, max: 24_999 },
  {
    value: '25000-49999',
    label: 'R$ 250,00 a R$ 499,99',
    min: 25_000,
    max: 49_999,
  },
  { value: '50000-', label: 'A partir de R$ 500,00', min: 50_000, max: null },
] as const;

type PriceFilterValue = (typeof PRICE_FILTERS)[number]['value'];
type CatalogSort = 'name-asc' | 'price-asc' | 'price-desc';

const SELECT_CONTROL_CLASS =
  'h-11 w-full rounded-button border border-strong bg-background-soft px-3.5 py-2 font-body text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50';

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 6h16M7 12h10m-7 6h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function normalizeCatalogText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesSearch(product: B2BCatalogProduct, query: string) {
  const needle = normalizeCatalogText(query.trim());
  if (!needle) return true;
  return normalizeCatalogText(
    [product.name, product.sku, product.category, product.description].join(
      ' ',
    ),
  ).includes(needle);
}

function matchesPriceFilter(
  product: B2BCatalogProduct,
  priceFilter: PriceFilterValue,
) {
  const filter = PRICE_FILTERS.find((item) => item.value === priceFilter);
  if (!filter || filter.value === 'all') return true;
  const price = product.prices.startCents;
  if (filter.min !== null && price < filter.min) return false;
  if (filter.max !== null && price > filter.max) return false;
  return true;
}

function sortCatalogProducts(
  products: B2BCatalogProduct[],
  sort: CatalogSort,
): B2BCatalogProduct[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') {
      return (
        a.prices.startCents - b.prices.startCents ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    }
    if (sort === 'price-desc') {
      return (
        b.prices.startCents - a.prices.startCents ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    }
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

export function B2BCatalogPage() {
  const { gate, session, configured } = useB2BSession();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>('all');
  const [sort, setSort] = useState<CatalogSort>('name-asc');
  const [openPanel, setOpenPanel] = useState<'tiers' | 'filters' | null>(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'catalog' | 'review' | 'sent'>('catalog');
  // Hold the id, not the product. A refetch replaces the objects.
  const [detailId, setDetailId] = useState<number | null>(null);
  // Snapshot taken before the draft is cleared, so the receipt has numbers.
  const [sentSummary, setSentSummary] = useState<SentSummary | null>(null);

  const {
    data: catalog,
    isLoading: loading,
    error: catalogError,
  } = useB2BCatalogQuery('', gate === 'approved');
  const products = catalog?.products ?? EMPTY_CATALOG_PRODUCTS;
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category?.trim())
            .filter((item): item is string => Boolean(item)),
        ),
      ).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [products],
  );
  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        matchesSearch(product, query) &&
        (category === 'all' || product.category?.trim() === category) &&
        matchesPriceFilter(product, priceFilter),
    );
    return sortCatalogProducts(filtered, sort);
  }, [category, priceFilter, products, query, sort]);
  const filtersActive =
    query.trim() !== '' || category !== 'all' || priceFilter !== 'all';
  const controlsActive = filtersActive || sort !== 'name-asc';
  const minimumOrderSubtotalCents =
    catalog?.minimumOrderSubtotalCents ?? MINIMUM_ORDER_SUBTOTAL_CENTS;
  const error = catalogError
    ? catalogError instanceof Error
      ? catalogError.message
      : 'catalog_failed'
    : null;

  const draft = useOrderDraft(products);
  const submitQuote = useSubmitB2BQuoteMutation();

  useEffect(() => {
    // The two steps share a route, so the browser keeps the scroll position.
    window.scrollTo({ top: 0 });
  }, [step]);

  const detailProduct = products.find((item) => item.id === detailId) ?? null;
  const amountToMinimumSubtotalCents = Math.max(
    0,
    minimumOrderSubtotalCents - draft.pricing.startSubtotalCents,
  );
  const belowMinimum = amountToMinimumSubtotalCents > 0;

  async function onSubmitQuote() {
    try {
      const result = await submitQuote.mutateAsync({
        items: draft.items,
        notes,
      });
      if (!result.success) return;
      // Keep the confirmation on screen. Dropping straight back into the
      // catalog left the seller unsure the request had gone anywhere.
      setSentSummary({
        totalQuantity: draft.totalQuantity,
        totalCents: draft.pricing.totalCents,
        itemCount: draft.items.length,
      });
      draft.clear();
      setNotes('');
      setStep('sent');
    } catch {
      // Surfaced via submitQuote.status below.
    }
  }

  const submitFailed =
    submitQuote.status === 'error' || submitQuote.data?.success === false;
  const submitMessage = submitFailed
    ? (submitQuote.data?.message ??
      (submitQuote.data?.error
        ? SUBMIT_ERROR_MESSAGES[submitQuote.data.error]
        : undefined) ??
      'Não foi possível enviar a solicitação.')
    : submitQuote.data?.success
      ? (submitQuote.data.message ??
        'Iremos retornar com as condições assim que possível.')
      : null;

  if (!configured) {
    return (
      <PageIntro
        description="O catálogo comercial está indisponível no momento. Tente novamente mais tarde."
        title="Catálogo comercial"
      />
    );
  }

  if (gate === 'loading') {
    return <p className="text-secondary">Carregando sessão B2B…</p>;
  }

  if (gate !== 'approved') {
    return (
      <div className="grid gap-6">
        <PageIntro
          description="O catálogo B2B é exclusivo para lojistas e oficinas aprovados."
          title="Acesso restrito"
        />
        <Button asChild variant="outline">
          <Link to="/b2b">Ir para login / cadastro</Link>
        </Button>
      </div>
    );
  }

  if (step === 'sent' && sentSummary) {
    return (
      <B2BOrderSent
        sellerEmail={session.seller?.email ?? null}
        summary={sentSummary}
        onBackToCatalog={() => {
          setSentSummary(null);
          setStep('catalog');
        }}
      />
    );
  }

  if (step === 'review') {
    return (
      <B2BOrderReview
        draft={draft}
        failed={submitFailed}
        message={submitMessage}
        notes={notes}
        submitting={submitQuote.isPending}
        onBack={() => setStep('catalog')}
        onNotesChange={setNotes}
        onSubmit={() => void onSubmitQuote()}
      />
    );
  }

  return (
    <div className="grid gap-10 pb-24">
      <PageIntro
        description={`${session.seller?.companyName ?? 'Sua empresa'} · pedido mínimo de ${formatCentsToBRL(minimumOrderSubtotalCents)} em mercadorias antes dos descontos. Frete não entra no mínimo.`}
        title="Selecione itens e solicite orçamento."
      />

      <div className="grid gap-3">
        <div
          aria-label="Tabelas e filtros do catálogo"
          className="relative grid grid-cols-2 gap-2 sm:w-fit sm:grid-cols-[14rem_12rem]"
          role="group"
        >
          <TierDropdown
            activeTier={draft.pricing.tier}
            open={openPanel === 'tiers'}
            onToggle={() =>
              setOpenPanel((current) => (current === 'tiers' ? null : 'tiers'))
            }
          />
          <Button
            aria-controls="b2b-catalog-filters"
            aria-expanded={openPanel === 'filters'}
            aria-label={
              openPanel === 'filters' ? 'Ocultar filtros' : 'Mostrar filtros'
            }
            className="w-full justify-between px-3 sm:px-5"
            type="button"
            variant="secondary"
            onClick={() =>
              setOpenPanel((current) =>
                current === 'filters' ? null : 'filters',
              )
            }
          >
            <span>Filtros</span>
            <FilterIcon />
          </Button>
        </div>

        {openPanel === 'filters' ? (
          <div
            aria-label="Filtros do catálogo"
            className="grid gap-4 border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_minmax(10rem,0.7fr)_minmax(12rem,0.8fr)_minmax(10rem,0.7fr)_auto] xl:items-end"
            id="b2b-catalog-filters"
            role="group"
          >
            <div className="grid gap-2">
              <label className="text-sm font-bold" htmlFor="b2b-catalog-search">
                Buscar produtos
              </label>
              <Input
                id="b2b-catalog-search"
                placeholder="Nome, SKU ou categoria"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-bold"
                htmlFor="b2b-catalog-category"
              >
                Categoria
              </label>
              <select
                className={SELECT_CONTROL_CLASS}
                id="b2b-catalog-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Todas</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold" htmlFor="b2b-catalog-price">
                Preço base
              </label>
              <select
                className={SELECT_CONTROL_CLASS}
                id="b2b-catalog-price"
                value={priceFilter}
                onChange={(event) =>
                  setPriceFilter(event.target.value as PriceFilterValue)
                }
              >
                {PRICE_FILTERS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold" htmlFor="b2b-catalog-sort">
                Ordenar
              </label>
              <select
                className={SELECT_CONTROL_CLASS}
                id="b2b-catalog-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as CatalogSort)}
              >
                <option value="name-asc">Nome (A-Z)</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>
            <Button
              className="w-full sm:col-span-2 xl:col-span-1 xl:w-auto"
              disabled={!controlsActive}
              type="button"
              variant="secondary"
              onClick={() => {
                setQuery('');
                setCategory('all');
                setPriceFilter('all');
                setSort('name-asc');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-accent" role="alert">
          Falha ao carregar o catálogo ({error}). Tente novamente em instantes.
        </p>
      ) : null}

      <ul
        aria-busy={loading}
        aria-label="Produtos do catálogo"
        className="divide-y divide-border border-y border-border"
      >
        {loading
          ? SKELETON_ROWS.map((key) => <ProductRowSkeleton key={key} />)
          : visibleProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                quantity={draft.quantityOf(product.id)}
                tier={draft.pricing.tier}
                onOpenDetail={() => setDetailId(product.id)}
                onQuantityChange={(next) => draft.setQuantity(product.id, next)}
              />
            ))}
      </ul>

      {!loading && visibleProducts.length === 0 && !error ? (
        <div className="border border-border bg-surface p-4">
          <p className="font-body text-[14px] text-secondary">
            {filtersActive
              ? 'Nenhum produto encontrado para os filtros atuais.'
              : 'Nenhum produto disponível no catálogo.'}
          </p>
        </div>
      ) : null}

      <OrderBar
        amountToMinimumSubtotalCents={amountToMinimumSubtotalCents}
        belowMinimum={belowMinimum}
        minimumOrderSubtotalCents={minimumOrderSubtotalCents}
        totalCents={draft.pricing.totalCents}
        totalQuantity={draft.totalQuantity}
        onReview={() => setStep('review')}
      />

      <B2BProductDrawer
        product={detailProduct}
        quantity={detailProduct ? draft.quantityOf(detailProduct.id) : 0}
        tier={draft.pricing.tier}
        onClose={() => setDetailId(null)}
        onQuantityChange={(next) => {
          if (detailProduct) draft.setQuantity(detailProduct.id, next);
        }}
      />
    </div>
  );
}

/** Sticky order bar. It only appears once the order holds something. */
function OrderBar({
  totalQuantity,
  totalCents,
  minimumOrderSubtotalCents,
  amountToMinimumSubtotalCents,
  belowMinimum,
  onReview,
}: {
  totalQuantity: number;
  totalCents: number;
  minimumOrderSubtotalCents: number;
  amountToMinimumSubtotalCents: number;
  belowMinimum: boolean;
  onReview: () => void;
}) {
  if (totalQuantity === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/96 backdrop-blur">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 py-3 sm:px-10 lg:px-16">
        <div className="grid gap-0.5">
          <p className="font-body text-[14px] font-bold leading-5 text-primary">
            {totalQuantity} {totalQuantity === 1 ? 'unidade' : 'unidades'} ·{' '}
            {formatCentsToBRL(totalCents)}
          </p>
          {belowMinimum ? (
            <p className="font-body text-[12px] leading-4 text-secondary">
              Falta {formatCentsToBRL(amountToMinimumSubtotalCents)} para o
              pedido mínimo de {formatCentsToBRL(minimumOrderSubtotalCents)} em
              mercadorias.
            </p>
          ) : null}
        </div>
        <Button disabled={belowMinimum} type="button" onClick={onReview}>
          Revisar pedido
        </Button>
      </div>
    </div>
  );
}
