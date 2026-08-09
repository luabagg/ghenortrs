import { useMemo, useState } from 'react';
import { Link } from '@remix-run/react';

import { B2B_DEFAULT_MIN_QUANTITY } from '@/b2b/config';
import { useB2BCatalogQuery, useSubmitB2BQuoteMutation } from '@/b2b/queries';
import type { B2BCatalogProduct, QuoteSelectionItem } from '@/b2b/types';
import { useB2BSession } from '@/b2b/use-b2b-session';
import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function formatBRL(cents: number | null): string {
  if (cents == null) return 'Sob consulta';
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function newQuoteRequestKey(): string {
  return crypto.randomUUID();
}

export function B2BCatalogPage() {
  const { gate, session, signOut, configured, error: sessionError } =
    useB2BSession();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Record<number, number>>({});
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, B2BCatalogProduct>
  >({});
  const [notes, setNotes] = useState('');
  const [requestKey, setRequestKey] = useState(newQuoteRequestKey);

  const {
    data: catalog,
    isLoading: loading,
    error: catalogError,
  } = useB2BCatalogQuery(query, gate === 'approved');
  const products = useMemo(
    () => catalog?.products ?? [],
    [catalog?.products],
  );
  const defaultMin = catalog?.defaultMinQuantity ?? B2B_DEFAULT_MIN_QUANTITY;
  const error = catalogError
    ? catalogError instanceof Error
      ? catalogError.message
      : 'catalog_failed'
    : null;

  const submitQuote = useSubmitB2BQuoteMutation();

  function rememberProduct(product: B2BCatalogProduct) {
    setSelectedProducts((prev) =>
      prev[product.id] === product
        ? prev
        : { ...prev, [product.id]: product },
    );
  }

  function setProductQuantity(product: B2BCatalogProduct, quantity: number) {
    rememberProduct(product);
    setSelection((prev) => {
      if (quantity <= 0) {
        if (!(product.id in prev)) return prev;
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return { ...prev, [product.id]: quantity };
    });
  }

  const selectedItems: QuoteSelectionItem[] = useMemo(() => {
    const items: QuoteSelectionItem[] = [];
    for (const [idText, quantity] of Object.entries(selection)) {
      if (quantity <= 0) continue;
      const product = selectedProducts[Number(idText)];
      if (!product) continue;
      items.push({ product, quantity });
    }
    return items;
  }, [selection, selectedProducts]);

  async function onSubmitQuote() {
    try {
      const result = await submitQuote.mutateAsync({
        items: selectedItems,
        notes,
        requestKey,
      });
      if (!result.success || !result.complete) return;
      setSelection({});
      setSelectedProducts({});
      setNotes('');
      setRequestKey(newQuoteRequestKey());
    } catch {
      // Surfaced via submitQuote.status below.
    }
  }

  const submitFailed =
    submitQuote.status === 'error' ||
    (submitQuote.data != null && submitQuote.data.success === false);
  const submitPartial =
    submitQuote.data?.success === true && submitQuote.data.complete === false;
  const submitMessage = submitFailed
    ? (submitQuote.data?.message ??
      (submitQuote.data?.error === 'min_quantity_not_met'
        ? 'Ajuste as quantidades mínimas antes de enviar.'
        : 'Não foi possível enviar a solicitação.'))
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

  if (sessionError) {
    return (
      <div className="grid gap-6">
        <PageIntro
          description="Não foi possível verificar sua sessão comercial agora."
          title="Falha de sessão B2B"
        />
        <p className="text-accent" role="alert">
          {sessionError === 'session_failed'
            ? 'Erro ao carregar a sessão. Tente novamente em instantes.'
            : sessionError}
        </p>
        <Button asChild variant="outline">
          <Link to="/b2b">Voltar para login / cadastro</Link>
        </Button>
      </div>
    );
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
          description={`${session.seller?.companyName ?? 'Sua empresa'} · catálogo Bling · pedido mínimo por item (padrão ${defaultMin}). Sem checkout online.`}
          title="Selecione itens e solicite orçamento."
        />
        <Button type="button" variant="secondary" onClick={() => void signOut()}>
          Sair
        </Button>
      </div>

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

      {loading ? (
        <p className="text-secondary">Carregando produtos…</p>
      ) : null}
      {error ? (
        <p className="text-accent" role="alert">
          Falha ao carregar catálogo ({error}). Confirme o sync Bling.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const qty = selection[product.id] ?? 0;
          return (
            <Card key={product.id} className="rounded-md border-border bg-surface px-0 py-0">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>
                  {product.sku ? `SKU ${product.sku} · ` : ''}
                  mín. {product.minQuantity}
                  {product.unit ? ` ${product.unit}` : ''} ·{' '}
                  {formatBRL(product.priceCents)}
                </CardDescription>
              </CardHeader>
              <div className="grid gap-3 px-6 pb-6">
                {product.description ? (
                  <p className="font-body text-[12px] leading-5 text-secondary">
                    {product.description}
                  </p>
                ) : null}
                <div className="flex items-center gap-3">
                  <Input
                    aria-label={`Quantidade de ${product.name}`}
                    className="max-w-[8rem]"
                    min={0}
                    step={1}
                    type="number"
                    value={qty}
                    onChange={(event) => {
                      const next = Math.max(
                        0,
                        Math.floor(Number(event.target.value) || 0),
                      );
                      setProductQuantity(product, next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setProductQuantity(
                        product,
                        Math.max(
                          product.minQuantity,
                          selection[product.id] ?? 0,
                        ),
                      )
                    }
                  >
                    Usar mínimo
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-md border-border bg-surface px-0 py-0">
        <CardHeader>
          <CardTitle>Solicitação de orçamento</CardTitle>
          <CardDescription>
            Sem checkout. A GHENO rotors retorna com condições e disponibilidade.
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <p className="text-sm text-secondary">
            {selectedItems.length} item(ns) selecionado(s).
          </p>
          <Textarea
            placeholder="Observações, prazos ou mix desejado"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {submitMessage ? (
            <p
              className={
                submitFailed || submitPartial
                  ? 'text-sm text-accent'
                  : 'text-sm text-secondary'
              }
              role="status"
            >
              {submitMessage}
            </p>
          ) : null}
          <Button
            disabled={selectedItems.length === 0 || submitQuote.isPending}
            type="button"
            onClick={() => void onSubmitQuote()}
          >
            {submitQuote.isPending
              ? 'Enviando…'
              : submitPartial
                ? 'Tentar enviar aviso novamente'
                : 'Enviar solicitação à GHENO rotors'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
