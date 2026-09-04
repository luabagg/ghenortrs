import { useMemo, useState } from 'react';
import { Link } from '@remix-run/react';

import { B2B_MINIMUM_ORDER_QUANTITY } from '@/b2b/config';
import { calculateOrderPricing } from '@/b2b/order-pricing';
import { useB2BCatalogQuery, useSubmitB2BQuoteMutation } from '@/b2b/queries';
import type { QuoteSelectionItem } from '@/b2b/types';
import { useB2BSession } from '@/b2b/use-b2b-session';
import {
  OrderSummary,
  ProductRow,
  TierLadder,
} from '@/components/b2b/b2b-catalog-sections';
import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  minimum_order_quantity_not_met:
    'O pedido ainda não alcança a quantidade mínima.',
  product_not_found: 'Um dos produtos saiu do catálogo. Atualize a página.',
};

export function B2BCatalogPage() {
  const { gate, session, signOut, configured } = useB2BSession();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState('');

  const {
    data: catalog,
    isLoading: loading,
    error: catalogError,
  } = useB2BCatalogQuery(query, gate === 'approved');
  const products = useMemo(() => catalog?.products ?? [], [catalog?.products]);
  const minimumOrderQuantity =
    catalog?.minimumOrderQuantity ?? B2B_MINIMUM_ORDER_QUANTITY;
  const error = catalogError
    ? catalogError instanceof Error
      ? catalogError.message
      : 'catalog_failed'
    : null;

  const submitQuote = useSubmitB2BQuoteMutation();

  const selectedItems: QuoteSelectionItem[] = useMemo(() => {
    return products
      .filter((product) => (selection[product.id] ?? 0) > 0)
      .map((product) => ({
        product,
        quantity: selection[product.id] ?? 0,
      }));
  }, [products, selection]);

  const pricing = useMemo(
    () =>
      calculateOrderPricing(
        selectedItems.map((item) => ({
          quantity: item.quantity,
          prices: item.product.prices,
        })),
      ),
    [selectedItems],
  );

  const belowMinimum = pricing.totalQuantity < minimumOrderQuantity;

  async function onSubmitQuote() {
    try {
      const result = await submitQuote.mutateAsync({
        items: selectedItems,
        notes,
      });
      if (!result.success) return;
      setSelection({});
      setNotes('');
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
      ? (submitQuote.data.message ?? 'Solicitação enviada.')
      : null;

  if (!configured) {
    return (
      <div className="grid gap-6">
        <PageIntro
          description="Conecte Supabase e Bling para liberar o catálogo B2B."
          title="Catálogo comercial"
        />
      </div>
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

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageIntro
          description={`${session.seller?.companyName ?? 'Sua empresa'} · pedido mínimo de ${minimumOrderQuantity} unidades no total, em qualquer combinação de produtos. A tabela de preço segue o valor do pedido.`}
          title="Selecione itens e solicite orçamento."
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => void signOut()}
        >
          Sair
        </Button>
      </div>

      <TierLadder activeTier={pricing.tier} />

      <div className="grid gap-3 sm:max-w-md">
        <label className="text-sm font-bold" htmlFor="b2b-catalog-search">
          Buscar no catálogo Bling
        </label>
        <Input
          id="b2b-catalog-search"
          placeholder="Nome, SKU ou categoria"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading ? <p className="text-secondary">Carregando produtos…</p> : null}
      {error ? (
        <p className="text-accent" role="alert">
          Falha ao carregar catálogo ({error}). Confirme o sync Bling.
        </p>
      ) : null}

      <ul className="divide-y divide-border border-y border-border">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            quantity={selection[product.id] ?? 0}
            tier={pricing.tier}
            onQuantityChange={(next) =>
              setSelection((prev) => ({ ...prev, [product.id]: next }))
            }
          />
        ))}
      </ul>

      <section className="grid gap-4">
        <h2 className="font-heading text-[30px] leading-none tracking-[-0.03em]">
          Solicitação de orçamento
        </h2>
        <p className="font-body text-[14px] leading-5 text-secondary">
          A GHENO rotors retorna com condições, prazos e disponibilidade.
        </p>

        <OrderSummary
          minimumOrderQuantity={minimumOrderQuantity}
          pricing={pricing}
        />

        <Textarea
          placeholder="Observações, prazos ou mix desejado"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        {submitMessage ? (
          <p
            className={
              submitFailed ? 'text-sm text-accent' : 'text-sm text-secondary'
            }
            role="status"
          >
            {submitMessage}
          </p>
        ) : null}
        <Button
          disabled={belowMinimum || submitQuote.isPending}
          type="button"
          onClick={() => void onSubmitQuote()}
        >
          {submitQuote.isPending
            ? 'Enviando…'
            : 'Enviar solicitação à GHENO rotors'}
        </Button>
      </section>
    </div>
  );
}
