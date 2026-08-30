import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { buildNoIndexMeta } from '~/lib/seo';
import {
  ADMIN_PRODUCT_LIST_LIMIT,
  listAdminProducts,
  updateProductVisibleB2b,
} from '~/server/db/queries';
import { requireAdmin } from '~/server/require-admin.server';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Produtos | GHENO rotors',
    'Painel interno para ocultar e mostrar produtos no catálogo B2B.',
  );

function parseVisibleB2b(value: string): boolean | null {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function productsRedirect(query: string, headers: Headers) {
  const path = query
    ? `/admin/produtos?q=${encodeURIComponent(query)}`
    : '/admin/produtos';
  return redirect(path, { headers });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers } = await requireAdmin(request);
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const products = await listAdminProducts(query);
  return json(
    {
      query,
      products,
      truncated: products.length === ADMIN_PRODUCT_LIST_LIMIT,
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { headers } = await requireAdmin(request);
  const formData = await request.formData();
  const productId = Number(formData.get('productId'));
  const visibleB2b = parseVisibleB2b(String(formData.get('visibleB2b') ?? ''));
  const query = String(formData.get('q') ?? '').trim();

  if (!Number.isInteger(productId) || productId <= 0 || visibleB2b === null) {
    return json(
      { ok: false as const, error: 'invalid_visibility' },
      { status: 400, headers },
    );
  }

  const updated = await updateProductVisibleB2b(productId, visibleB2b);
  if (!updated) {
    return json(
      { ok: false as const, error: 'update_failed' },
      { status: 404, headers },
    );
  }
  return productsRedirect(query, headers);
};

export default function AdminProducts() {
  const { query, products, truncated } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AdminChrome
      current="products"
      description="Oculte ou mostre SKUs no catálogo B2B. Sync do Bling não altera essa visibilidade. Produto inativo no Bling continua oculto para o lojista."
      title="Produtos B2B"
    >
      {actionData && actionData.ok === false ? (
        <p className="text-sm text-accent" role="alert">
          Não foi possível atualizar o produto.
        </p>
      ) : null}

      <Form
        className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
        method="get"
      >
        <div className="grid gap-2">
          <Label htmlFor="admin-product-search">Buscar</Label>
          <Input
            defaultValue={query}
            id="admin-product-search"
            name="q"
            placeholder="SKU ou nome"
            type="search"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </Form>

      {truncated ? (
        <p className="text-sm text-secondary">
          Mostrando os primeiros {products.length}. Refine a busca para achar um
          SKU específico.
        </p>
      ) : null}

      {products.length === 0 ? (
        <p className="text-sm text-secondary">
          {query
            ? 'Nenhum produto para essa busca.'
            : 'Nenhum produto sincronizado.'}
        </p>
      ) : (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-secondary">
              <tr>
                <th className="px-4 py-3 font-bold">SKU</th>
                <th className="px-4 py-3 font-bold">Produto</th>
                <th className="px-4 py-3 font-bold">Bling</th>
                <th className="px-4 py-3 font-bold">Catálogo</th>
                <th className="px-4 py-3 font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-secondary">
                    {product.sku ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-primary">{product.name}</td>
                  <td className="px-4 py-3 text-secondary">
                    {product.active ? 'Ativo' : 'Inativo'}
                  </td>
                  <td className="px-4 py-3 text-primary">
                    {product.visibleB2b ? 'Visível' : 'Oculto'}
                  </td>
                  <td className="px-4 py-3">
                    <VisibilityButton
                      productId={product.id}
                      query={query}
                      visibleB2b={product.visibleB2b}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminChrome>
  );
}

function VisibilityButton({
  productId,
  query,
  visibleB2b,
}: {
  productId: number;
  query: string;
  visibleB2b: boolean;
}) {
  return (
    <Form method="post">
      <input name="productId" type="hidden" value={productId} />
      <input
        name="visibleB2b"
        type="hidden"
        value={visibleB2b ? 'false' : 'true'}
      />
      <input name="q" type="hidden" value={query} />
      <Button type="submit" variant="secondary">
        {visibleB2b ? 'Ocultar' : 'Mostrar'}
      </Button>
    </Form>
  );
}
