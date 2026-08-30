import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { createCookie, json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { AdminChrome } from '~/components/admin/admin-chrome';
import { PriceListImportPanel } from '~/components/admin/price-list-import-panel';
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
} from '~/server/db/queries';
import { setProductsVisibility } from '~/server/product-visibility';
import type { PriceListErrorCode } from '~/server/price-list-import';
import {
  PriceListError,
  buildPriceImportPreview,
  commitPriceImport,
} from '~/server/price-list-import';
import { requireAdmin } from '~/server/require-admin.server';
import { parseSellerTier } from '~/server/seller-tier';

const CONNECT_MESSAGES: Record<BlingConnectResult, string> = {
  connected: 'Bling conectado.',
  denied: 'Autorização cancelada no Bling.',
  invalid_state: 'A conexão expirou. Clique em Conectar Bling outra vez.',
  not_configured:
    'Bling não configurado. Defina BLING_CLIENT_ID, BLING_CLIENT_SECRET e BLING_REDIRECT_URI.',
  failed: 'Falha ao conectar o Bling. Tente outra vez.',
};

const PRICE_LIST_MESSAGES: Record<
  PriceListErrorCode | 'preview_stale',
  string
> = {
  empty: 'Cole a tabela de preços antes de pré-visualizar.',
  not_tab_separated:
    'Cole a tabela original do Bling ou da planilha. Texto alinhado com espaços não serve: os nomes dos produtos também têm espaços.',
  missing_sku_column: 'A tabela precisa da coluna Sku.',
  missing_price_column: 'A tabela precisa da coluna R$ Preço da lista.',
  row_column_mismatch:
    'Uma linha tem menos colunas que o cabeçalho. Copie a tabela inteira, incluindo as colunas vazias, ou cole só as colunas Sku e R$ Preço da lista.',
  conflicting_duplicate_sku:
    'O mesmo SKU aparece com preços diferentes. Corrija a tabela e cole outra vez.',
  too_large: 'Tabela grande demais. Importe em partes menores.',
  too_many_rows: 'Tabela com linhas demais. Importe em partes menores.',
  preview_stale:
    'O catálogo mudou depois da pré-visualização. Gere a pré-visualização outra vez.',
};

function priceListMessage(code: string): string {
  return (
    PRICE_LIST_MESSAGES[code as PriceListErrorCode] ??
    'Não foi possível ler a tabela colada.'
  );
}

const priceImportFlash = createCookie('price_import_result', {
  httpOnly: true,
  maxAge: 60,
  path: '/admin',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

type PriceImportFlash =
  | { ok: true; updated: number }
  | { ok: false; error: 'preview_stale' };

function buildImportMessage(
  flash: PriceImportFlash | null,
): { ok: boolean; text: string } | null {
  if (!flash) return null;
  if (!flash.ok) {
    return { ok: false, text: priceListMessage(flash.error) };
  }
  return { ok: true, text: `Preços atualizados: ${flash.updated} SKUs.` };
}

async function readPriceImportFlash(request: Request): Promise<{
  flash: PriceImportFlash | null;
  clearCookie: string | null;
}> {
  const stored = await priceImportFlash.parse(request.headers.get('Cookie'));
  if (typeof stored !== 'object' || stored === null || !('ok' in stored)) {
    return { flash: null, clearCookie: null };
  }
  return {
    flash: stored as PriceImportFlash,
    clearCookie: await priceImportFlash.serialize('', { maxAge: 0 }),
  };
}

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

function parseProductId(value: FormDataEntryValue | null): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Reads an explicit show/hide target. There is no implicit toggle. */
function readVisibilityTarget(
  formData: FormData,
): { ids: number[]; visibleB2b: boolean } | null {
  const single = [
    { field: 'showProduct', visibleB2b: true },
    { field: 'hideProduct', visibleB2b: false },
  ];
  for (const option of single) {
    const raw = formData.get(option.field);
    if (raw === null) continue;
    const id = parseProductId(raw);
    return id === null ? null : { ids: [id], visibleB2b: option.visibleB2b };
  }

  const intent = String(formData.get('intent') ?? '');
  if (intent !== 'bulk-show' && intent !== 'bulk-hide') return null;

  const ids = formData.getAll('productIds').map(parseProductId);
  if (ids.length === 0 || ids.some((id) => id === null)) return null;

  return {
    ids: ids as number[],
    visibleB2b: intent === 'bulk-show',
  };
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
  const priceImport = await readPriceImportFlash(request);
  if (connect.clearCookie) headers.append('Set-Cookie', connect.clearCookie);
  if (sync.clearCookie) headers.append('Set-Cookie', sync.clearCookie);
  if (priceImport.clearCookie) {
    headers.append('Set-Cookie', priceImport.clearCookie);
  }

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
      importMessage: buildImportMessage(priceImport.flash),
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

  if (intent === 'preview-price-list' || intent === 'commit-price-list') {
    const tier = parseSellerTier(String(formData.get('tier') ?? ''));
    const text = String(formData.get('priceList') ?? '');

    try {
      if (intent === 'preview-price-list') {
        return json(
          {
            kind: 'price-list' as const,
            ok: true as const,
            preview: await buildPriceImportPreview(tier, text),
            text,
            tier,
          },
          { headers },
        );
      }

      const result = await commitPriceImport({
        actor: { id: user.id, email: user.email },
        digest: String(formData.get('digest') ?? ''),
        text,
        tier,
      });
      headers.append('Set-Cookie', await priceImportFlash.serialize(result));
      return redirect('/admin/produtos', { headers });
    } catch (error) {
      if (!(error instanceof PriceListError)) throw error;
      return json(
        {
          kind: 'price-list' as const,
          ok: false as const,
          error: error.code,
          row: error.row ?? null,
        },
        { status: 400, headers },
      );
    }
  }

  const query = String(formData.get('q') ?? '').trim();
  const target = readVisibilityTarget(formData);
  if (!target) {
    return json(
      {
        kind: 'visibility' as const,
        ok: false as const,
        error: 'invalid_visibility',
      },
      { status: 400, headers },
    );
  }

  const { updated } = await setProductsVisibility({
    actor: { id: user.id, email: user.email },
    ids: target.ids,
    query,
    visibleB2b: target.visibleB2b,
  });
  if (updated !== target.ids.length) {
    return json(
      {
        kind: 'visibility' as const,
        ok: false as const,
        error: 'update_failed',
      },
      { status: 404, headers },
    );
  }
  return productsRedirect(query, headers);
};

export default function AdminProducts() {
  const {
    connectResult,
    connection,
    importMessage,
    query,
    products,
    syncMessage,
    truncated,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const priceList = actionData?.kind === 'price-list' ? actionData : null;

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

      <PriceListImportPanel
        errorMessage={
          priceList && !priceList.ok
            ? [
                priceList.row ? `Linha ${priceList.row}:` : null,
                priceListMessage(priceList.error),
              ]
                .filter(Boolean)
                .join(' ')
            : null
        }
        importMessage={importMessage}
        preview={priceList?.ok ? priceList.preview : null}
        text={priceList?.ok ? priceList.text : ''}
        tier={priceList?.ok ? priceList.tier : 'start'}
      />

      {actionData?.kind === 'visibility' ? (
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
        <Form className="grid gap-3" method="post">
          <input name="q" type="hidden" value={query} />

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-secondary">
              Marque os produtos e escolha o estado no catálogo B2B.
            </p>
            <Button
              name="intent"
              type="submit"
              value="bulk-show"
              variant="secondary"
            >
              Mostrar marcados
            </Button>
            <Button
              name="intent"
              type="submit"
              value="bulk-hide"
              variant="secondary"
            >
              Ocultar marcados
            </Button>
          </div>

          <div className="overflow-x-auto border border-border bg-surface">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="border-b border-border text-secondary">
                <tr>
                  <th className="px-4 py-3 font-bold">
                    <span className="sr-only">Selecionar</span>
                  </th>
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
                    <td className="px-4 py-3">
                      <input
                        aria-label={`Selecionar ${product.name}`}
                        name="productIds"
                        type="checkbox"
                        value={product.id}
                      />
                    </td>
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
                      <Button
                        name={
                          product.visibleB2b ? 'hideProduct' : 'showProduct'
                        }
                        type="submit"
                        value={product.id}
                        variant="secondary"
                      >
                        {product.visibleB2b ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Form>
      )}
    </AdminChrome>
  );
}
