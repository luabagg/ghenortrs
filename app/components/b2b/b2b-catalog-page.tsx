import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';

import { B2B_MINIMUM_ORDER_QUANTITY } from '@/b2b/config';
import { useB2BCatalogQuery, useSubmitB2BQuoteMutation } from '@/b2b/queries';
import { useB2BSession } from '@/b2b/use-b2b-session';
import { useOrderDraft } from '@/b2b/use-order-draft';
import { B2BOrderReview } from '@/components/b2b/b2b-order-review';
import {
  B2BOrderSent,
  type SentSummary,
} from '@/components/b2b/b2b-order-sent';
import { B2BProductDrawer } from '@/components/b2b/b2b-product-drawer';
import { ProductRow, ProductRowSkeleton } from '@/components/b2b/product-row';
import { TierLadder } from '@/components/b2b/tier-ladder';
import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCentsToBRL } from '@/lib/br-money';

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  minimum_order_quantity_not_met:
    'O pedido ainda não alcança a quantidade mínima.',
  product_not_found: 'Um dos produtos saiu do catálogo. Atualize a página.',
};

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export function B2BCatalogPage() {
  const { gate, session, configured } = useB2BSession();
  const [query, setQuery] = useState('');
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
  } = useB2BCatalogQuery(query, gate === 'approved');
  const products = catalog?.products ?? [];
  const minimumOrderQuantity =
    catalog?.minimumOrderQuantity ?? B2B_MINIMUM_ORDER_QUANTITY;
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
  const belowMinimum = draft.totalQuantity < minimumOrderQuantity;

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
        minimumOrderQuantity={minimumOrderQuantity}
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
        description={`${session.seller?.companyName ?? 'Sua empresa'} · pedido mínimo de ${minimumOrderQuantity} unidades no total, em qualquer combinação de produtos. A tabela de preço segue o valor do pedido.`}
        title="Selecione itens e solicite orçamento."
      />

      <TierLadder activeTier={draft.pricing.tier} />

      <div className="grid gap-3 sm:max-w-md">
        <label className="text-sm font-bold" htmlFor="b2b-catalog-search">
          Buscar produtos
        </label>
        <Input
          id="b2b-catalog-search"
          placeholder="Nome ou categoria"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
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
          : products.map((product) => (
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

      {!loading && products.length === 0 && !error ? (
        <p className="font-body text-[14px] text-secondary">
          Nenhum produto encontrado para esta busca.
        </p>
      ) : null}

      <OrderBar
        belowMinimum={belowMinimum}
        minimumOrderQuantity={minimumOrderQuantity}
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
  minimumOrderQuantity,
  belowMinimum,
  onReview,
}: {
  totalQuantity: number;
  totalCents: number;
  minimumOrderQuantity: number;
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
              Mínimo de {minimumOrderQuantity} unidades.
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
