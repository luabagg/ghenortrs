import { Form } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { formatCentsToBRL } from '~/lib/br-money';
import type { PriceImportPreview } from '~/server/price-list-import';
import type { SellerTier } from '~/server/seller-tier';
import { SELLER_TIERS } from '~/server/seller-tier';

const TIER_LABELS: Record<SellerTier, string> = {
  start: 'Start',
  pro: 'Pro',
  max: 'Max',
};

export function PriceListImportPanel({
  errorMessage,
  importMessage,
  preview,
  text,
  tier,
}: {
  errorMessage: string | null;
  importMessage: { ok: boolean; text: string } | null;
  preview: PriceImportPreview | null;
  text: string;
  tier: SellerTier;
}) {
  return (
    <section className="grid gap-4 border border-border bg-surface p-4">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-primary">
          Tabela de preços
        </p>
        <p className="text-sm text-secondary">
          Cole a tabela copiada do Bling ou da planilha. As colunas precisam vir
          separadas por tabulação, com <strong>Sku</strong> e{' '}
          <strong>R$ Preço da lista</strong>. A importação altera somente a
          tabela escolhida.
        </p>
      </div>

      {importMessage ? (
        <p
          className={
            importMessage.ok ? 'text-sm text-primary' : 'text-sm text-accent'
          }
          role="status"
        >
          {importMessage.text}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-accent" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Form className="grid gap-4" method="post">
        <input name="intent" type="hidden" value="preview-price-list" />
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-primary">
            Tabela de destino
          </legend>
          <div className="flex flex-wrap gap-4">
            {SELLER_TIERS.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-primary"
              >
                <input
                  defaultChecked={value === tier}
                  name="tier"
                  type="radio"
                  value={value}
                />
                {TIER_LABELS[value]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-2">
          <label
            className="text-sm font-bold text-primary"
            htmlFor="price-list"
          >
            Tabela colada
          </label>
          <Textarea
            defaultValue={text}
            id="price-list"
            name="priceList"
            placeholder={
              'Produto\tSku\tGTIN/EAN\tR$ Preço no Bling\tR$ Preço da lista'
            }
            rows={8}
          />
        </div>

        <div>
          <Button type="submit" variant="secondary">
            Pré-visualizar
          </Button>
        </div>
      </Form>

      {preview ? (
        <PreviewResult preview={preview} text={text} tier={tier} />
      ) : null}
    </section>
  );
}

function PreviewResult({
  preview,
  text,
  tier,
}: {
  preview: PriceImportPreview;
  text: string;
  tier: SellerTier;
}) {
  return (
    <div className="grid gap-3 border-t border-border pt-4">
      <p className="text-sm text-secondary">
        {preview.inputRowCount} linhas lidas · {preview.updates.length} para
        alterar · {preview.unchanged.length} sem mudança ·{' '}
        {preview.missingSkus.length} SKUs fora do catálogo ·{' '}
        {preview.skipped.length} linhas ignoradas · {preview.duplicates.length}{' '}
        SKUs repetidos
      </p>

      {preview.updates.length === 0 ? (
        <p className="text-sm text-secondary">
          Nada para alterar na tabela {TIER_LABELS[preview.tier]}.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="border-b border-border text-secondary">
                <tr>
                  <th className="px-4 py-3 font-bold">SKU</th>
                  <th className="px-4 py-3 font-bold">Produto</th>
                  <th className="px-4 py-3 font-bold">Preço atual</th>
                  <th className="px-4 py-3 font-bold">Novo preço</th>
                </tr>
              </thead>
              <tbody>
                {preview.updates.map((update) => (
                  <tr
                    key={update.sku}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-secondary">{update.sku}</td>
                    <td className="px-4 py-3 text-primary">
                      {update.name}
                      {update.active ? null : (
                        <span className="text-secondary"> (inativo)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {update.currentCents === null
                        ? '—'
                        : formatCentsToBRL(update.currentCents)}
                    </td>
                    <td className="px-4 py-3 text-primary">
                      {formatCentsToBRL(update.nextCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Form method="post">
            <input name="intent" type="hidden" value="commit-price-list" />
            <input name="tier" type="hidden" value={tier} />
            <input name="priceList" type="hidden" value={text} />
            <input name="digest" type="hidden" value={preview.digest} />
            <Button type="submit" variant="primary">
              Confirmar importação
            </Button>
          </Form>
        </>
      )}

      {preview.missingSkus.length > 0 ? (
        <p className="text-sm text-secondary">
          Fora do catálogo: {preview.missingSkus.join(', ')}
        </p>
      ) : null}

      {preview.skipped.length > 0 ? (
        <p className="text-sm text-secondary">
          Linhas ignoradas:{' '}
          {preview.skipped
            .map((row) =>
              row.reason === 'empty_sku'
                ? 'linha sem SKU'
                : `${row.sku} (preço inválido)`,
            )
            .join(', ')}
        </p>
      ) : null}

      {preview.duplicates.length > 0 ? (
        <p className="text-sm text-secondary">
          SKUs repetidos com o mesmo preço: {preview.duplicates.join(', ')}
        </p>
      ) : null}
    </div>
  );
}
