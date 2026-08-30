import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { MIN_QUANTITY_LIMIT } from '~/lib/product-rules';
import { buildNoIndexMeta } from '~/lib/seo';
import { formatCentsToBRL } from '~/server/br-money';
import { getAdminProductDetail } from '~/server/db/queries';
import {
  setProductMinQuantity,
  setProductsVisibility,
} from '~/server/product-admin';
import { requireAdmin } from '~/server/require-admin.server';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Produto | GHENO rotors',
    'Painel interno com os dados de um produto do catálogo B2B.',
  );

const ERROR_MESSAGES: Record<string, string> = {
  invalid_min_quantity: `Informe um número inteiro entre 1 e ${MIN_QUANTITY_LIMIT}.`,
  product_not_found: 'Produto não encontrado.',
  invalid_intent: 'Ação inválida.',
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

  if (intent === 'set-min-quantity') {
    const result = await setProductMinQuantity({
      actor,
      productId: id,
      minQuantity: Number(formData.get('minQuantity')),
    });
    if (!result.ok) {
      return json(
        { ok: false as const, error: result.error },
        { status: 400, headers },
      );
    }
    return redirect(`/admin/produtos/${id}`, { headers });
  }

  if (intent === 'show-product' || intent === 'hide-product') {
    await setProductsVisibility({
      actor,
      ids: [id],
      query: '',
      visibleB2b: intent === 'show-product',
    });
    return redirect(`/admin/produtos/${id}`, { headers });
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

        {product.imageUrl ? (
          <img
            alt=""
            className="max-h-64 w-full object-contain"
            src={product.imageUrl}
          />
        ) : (
          <p className="text-sm text-secondary">Sem imagem no Bling.</p>
        )}
      </section>

      <section className="grid gap-4 border border-border bg-surface p-4">
        <Form
          className="grid gap-3 sm:grid-cols-[160px_auto] sm:items-end"
          method="post"
        >
          <input name="intent" type="hidden" value="set-min-quantity" />
          <div className="grid gap-2">
            <Label htmlFor="min-quantity">Quantidade mínima</Label>
            <Input
              defaultValue={product.minQuantity}
              id="min-quantity"
              max={MIN_QUANTITY_LIMIT}
              min={1}
              name="minQuantity"
              step={1}
              type="number"
            />
          </div>
          <Button type="submit" variant="secondary">
            Salvar
          </Button>
        </Form>
        <p className="text-sm text-secondary">
          O lojista não pode pedir menos que isso. A sincronização do Bling não
          altera este valor.
        </p>

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

      {product.description ? (
        <section className="grid gap-2 border border-border bg-surface p-4">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
            Descrição no Bling
          </p>
          <p className="whitespace-pre-line text-sm text-secondary">
            {product.description}
          </p>
        </section>
      ) : null}
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
