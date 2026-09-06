import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';

import { ProductDetailContent } from '~/components/catalog/product-detail-content';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { Button } from '~/components/ui/button';
import { buildNoIndexMeta } from '~/lib/seo';
import { formatCentsToBRL } from '~/lib/br-money';
import { getAdminProductDetail } from '~/server/db/queries';
import {
  setProductTierPrice,
  setProductsVisibility,
} from '~/server/product-admin';
import { isSellerTier, type SellerTier } from '~/server/seller-tier';
import { requireAdmin } from '~/server/require-admin.server';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Produto | GHENO rotors',
    'Painel interno com os dados de um produto do catálogo B2B.',
  );

export const PRICE_UNIT_GUIDANCE =
  'Informe o valor em centavos. Exemplo: R$ 500,00 = 50000 centavos.';

const ERROR_MESSAGES: Record<string, string> = {
  product_not_found: 'Produto não encontrado.',
  invalid_intent: 'Ação inválida.',
  invalid_price: 'Informe um preço válido.',
  price_update_failed: 'Não foi possível atualizar o preço.',
};

function parseProductId(raw: string | undefined): number | null {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function money(cents: number | null): string {
  return cents === null ? '—' : formatCentsToBRL(cents);
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { headers } = await requireAdmin(request);
  const id = parseProductId(params.id);
  if (id === null) throw new Response('Not Found', { status: 404, headers });

  const product = await getAdminProductDetail(id);
  if (!product) throw new Response('Not Found', { status: 404, headers });

  return json({ product }, { headers });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { headers, user } = await requireAdmin(request);
  const id = parseProductId(params.id);
  if (id === null) throw new Response('Not Found', { status: 404, headers });

  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const actor = { id: user.id, email: user.email };

  if (intent === 'save-tier-price') {
    const product = await getAdminProductDetail(id);
    if (!product) throw new Response('Not Found', { status: 404, headers });
    if (!product.sku) {
      return json(
        { ok: false as const, error: 'invalid_price' },
        { status: 400, headers },
      );
    }
    const rawTier = formData.get('tier');
    const rawPrice = formData.get('priceCents');
    if (
      typeof rawTier !== 'string' ||
      typeof rawPrice !== 'string' ||
      rawPrice.trim() === ''
    ) {
      return json(
        { ok: false as const, error: 'invalid_price' },
        { status: 400, headers },
      );
    }
    const normalizedTier = rawTier.trim().toLowerCase();
    const priceCents = Number(rawPrice);
    if (
      !isSellerTier(normalizedTier) ||
      !Number.isSafeInteger(priceCents) ||
      priceCents < 0
    ) {
      return json(
        { ok: false as const, error: 'invalid_price' },
        { status: 400, headers },
      );
    }
    const result = await setProductTierPrice({
      actor,
      productId: id,
      sku: product.sku,
      tier: normalizedTier as SellerTier,
      priceCents,
    });
    if (result.updated !== 1) {
      return json(
        { ok: false as const, error: 'price_update_failed' },
        { status: 404, headers },
      );
    }
    return json({ ok: true as const }, { headers });
  }

  if (intent === 'show-product' || intent === 'hide-product') {
    await setProductsVisibility({
      actor,
      ids: [id],
      query: '',
      visibleB2b: intent === 'show-product',
    });
    return json({ ok: true as const }, { headers });
  }

  return json(
    { ok: false as const, error: 'invalid_intent' },
    { status: 400, headers },
  );
};

export default function AdminProductDetail() {
  const { product } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AdminChrome
      current="products"
      description={`SKU ${product.sku ?? '—'} · ${
        product.active ? 'ativo no Bling' : 'inativo no Bling'
      } · ${product.visibleB2b ? 'visível no catálogo' : 'oculto no catálogo'}`}
      title={product.name}
    >
      <Link className="text-sm text-secondary underline" to="/admin/produtos">
        Voltar para a lista
      </Link>

      {actionData?.ok === false ? (
        <p className="text-sm text-accent" role="alert">
          {ERROR_MESSAGES[actionData.error] ?? 'Não foi possível salvar.'}
        </p>
      ) : null}

      <section className="grid gap-4 border border-border bg-surface p-4 sm:grid-cols-2">
        <ProductDetailContent
          product={{
            name: product.name,
            imageUrl: product.imageUrl,
            sku: product.sku,
            category: product.category,
            unit: product.unit,
            stock: product.stock,
            description: product.description,
            prices: {
              startCents: product.priceStartCents,
              proCents: product.priceProCents,
              maxCents: product.priceMaxCents,
            },
          }}
        />
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Custo (Bling)" value={money(product.costCents)} />
          <Field label="Preço no Bling" value={money(product.priceCents)} />
          <Field label="Tabela Start" value={money(product.priceStartCents)} />
          <Field label="Tabela Pro" value={money(product.priceProCents)} />
          <Field label="Tabela Max" value={money(product.priceMaxCents)} />
          <Field
            label="Estoque"
            value={product.stock === null ? '—' : String(product.stock)}
          />
          <Field label="Unidade" value={product.unit ?? '—'} />
          <Field label="Categoria" value={product.category ?? '—'} />
        </dl>
      </section>

      <section className="grid gap-4 border border-border bg-surface p-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
          Editar tabela de preço (centavos)
        </h2>
        <p className="text-sm text-secondary">{PRICE_UNIT_GUIDANCE}</p>
        {(['start', 'pro', 'max'] as const).map((tier) => {
          const value =
            product[
              `price${tier[0].toUpperCase()}${tier.slice(1)}Cents` as
                | 'priceStartCents'
                | 'priceProCents'
                | 'priceMaxCents'
            ];
          return (
            <Form
              key={tier}
              className="grid gap-2 sm:grid-cols-[8rem_1fr_auto] sm:items-end"
              method="post"
            >
              <input name="intent" type="hidden" value="save-tier-price" />
              <input name="tier" type="hidden" value={tier} />
              <label
                className="text-sm text-secondary"
                htmlFor={`price-${tier}`}
              >
                Tabela {tier[0].toUpperCase() + tier.slice(1)} (centavos)
              </label>
              <input
                className="h-12 rounded-md border border-border-strong bg-background-soft px-4 text-sm text-primary"
                defaultValue={value ?? ''}
                id={`price-${tier}`}
                min="0"
                name="priceCents"
                required
                type="number"
              />
              <Button type="submit" variant="secondary">
                Salvar preço
              </Button>
            </Form>
          );
        })}
      </section>

      <section className="grid gap-4 border border-border bg-surface p-4">
        <Form method="post">
          <Button
            name="intent"
            type="submit"
            value={product.visibleB2b ? 'hide-product' : 'show-product'}
            variant="secondary"
          >
            {product.visibleB2b
              ? 'Ocultar do catálogo B2B'
              : 'Mostrar no catálogo B2B'}
          </Button>
        </Form>
      </section>
    </AdminChrome>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-secondary">{label}</dt>
      <dd className="text-primary">{value}</dd>
    </div>
  );
}
