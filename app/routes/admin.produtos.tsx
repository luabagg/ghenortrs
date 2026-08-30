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
import type { BlingSyncResult } from '~/server/bling-admin';
import {
  getBlingConnectionStatus,
  readBlingSyncResult,
  serializeBlingSyncResult,
  syncBlingCatalog,
} from '~/server/bling-admin';
import type { BlingConnectResult } from '~/server/bling-oauth-state';
import {
  readBlingConnectResult,
  serializeBlingConnectResult,
  startBlingOAuth,
} from '~/server/bling-oauth-state';
import {
  ADMIN_PRODUCT_LIST_LIMIT,
  listAdminProducts,
  updateProductVisibleB2b,
} from '~/server/db/queries';
import { requireAdmin } from '~/server/require-admin.server';

const CONNECT_MESSAGES: Record<BlingConnectResult, string> = {
  connected: 'Bling conectado.',
  denied: 'Autorização cancelada no Bling.',
  invalid_state: 'A conexão expirou. Clique em Conectar Bling outra vez.',
  not_configured:
    'Bling não configurado. Defina BLING_CLIENT_ID, BLING_CLIENT_SECRET e BLING_REDIRECT_URI.',
  failed: 'Falha ao conectar o Bling. Tente outra vez.',
};

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** Formats on the server, so the client renders the same string. */
function formatInstant(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : DATE_TIME_FORMAT.format(date);
}

function buildSyncMessage(
  result: BlingSyncResult | null,
): { ok: boolean; text: string } | null {
  if (!result) return null;
  if (!result.ok) {
    return {
      ok: false,
      text: 'Falha ao sincronizar o catálogo. Verifique a conexão com o Bling.',
    };
  }
  const at = formatInstant(result.syncedAt);
  return {
    ok: true,
    text: `Catálogo sincronizado: ${result.upserted} produtos${
      at ? ` em ${at}` : ''
    }.`,
  };
}

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
  const connection = await getBlingConnectionStatus();
  const connect = await readBlingConnectResult(request);
  const sync = await readBlingSyncResult(request);
  if (connect.clearCookie) headers.append('Set-Cookie', connect.clearCookie);
  if (sync.clearCookie) headers.append('Set-Cookie', sync.clearCookie);

  return json(
    {
      query,
      products,
      connectResult: connect.result,
      connection: {
        connected: connection.connected,
        expiresAtLabel: formatInstant(connection.expiresAt),
      },
      syncMessage: buildSyncMessage(sync.result),
      truncated: products.length === ADMIN_PRODUCT_LIST_LIMIT,
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user, headers } = await requireAdmin(request);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');

  if (intent === 'connect-bling') {
    try {
      return await startBlingOAuth(headers);
    } catch (error) {
      console.error('bling connect start failed', error);
      headers.append(
        'Set-Cookie',
        await serializeBlingConnectResult('not_configured'),
      );
      return redirect('/admin/produtos', { headers });
    }
  }

  if (intent === 'sync-bling') {
    const result = await syncBlingCatalog({
      actor: { id: user.id, email: user.email },
    });
    headers.append('Set-Cookie', await serializeBlingSyncResult(result));
    return redirect('/admin/produtos', { headers });
  }

  if (intent !== 'toggle-visibility') {
    return json(
      { ok: false as const, error: 'invalid_intent' },
      { status: 400, headers },
    );
  }

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
  const { connectResult, connection, query, products, syncMessage, truncated } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <AdminChrome
      current="products"
      description="Oculte ou mostre SKUs no catálogo B2B. Sync do Bling não altera essa visibilidade. Produto inativo no Bling continua oculto para o lojista."
      title="Produtos B2B"
    >
      <section className="grid gap-3 border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
              Bling
            </p>
            <p className="text-sm text-secondary">
              {connection.connected
                ? `Conectado.${
                    connection.expiresAtLabel
                      ? ` Token válido até ${connection.expiresAtLabel}.`
                      : ''
                  }`
                : 'Não conectado. Conecte para sincronizar o catálogo.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Form method="post">
              <input name="intent" type="hidden" value="connect-bling" />
              <Button type="submit" variant="secondary">
                {connection.connected ? 'Reconectar Bling' : 'Conectar Bling'}
              </Button>
            </Form>
            <Form method="post">
              <input name="intent" type="hidden" value="sync-bling" />
              <Button
                disabled={!connection.connected}
                type="submit"
                variant="secondary"
              >
                Sincronizar catálogo
              </Button>
            </Form>
          </div>
        </div>

        {connectResult ? (
          <p
            className={
              connectResult === 'connected'
                ? 'text-sm text-primary'
                : 'text-sm text-accent'
            }
            role="status"
          >
            {CONNECT_MESSAGES[connectResult]}
          </p>
        ) : null}

        {syncMessage ? (
          <p
            className={
              syncMessage.ok ? 'text-sm text-primary' : 'text-sm text-accent'
            }
            role="status"
          >
            {syncMessage.text}
          </p>
        ) : null}
      </section>

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
      <input name="intent" type="hidden" value="toggle-visibility" />
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
