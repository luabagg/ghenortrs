import { Button } from '@/components/ui/button';
import { formatCentsToBRL } from '@/lib/br-money';
import { HEADING_PAGE } from '@/lib/typography';

export type SentSummary = {
  totalQuantity: number;
  totalCents: number;
  itemCount: number;
};

/**
 * Step three. The seller needs to see that the request left, and roughly what
 * it contained, before the catalog reappears empty.
 */
export function B2BOrderSent({
  summary,
  sellerEmail,
  onBackToCatalog,
}: {
  summary: SentSummary;
  sellerEmail: string | null;
  onBackToCatalog: () => void;
}) {
  return (
    <div className="grid gap-6" data-section="b2b-order-sent">
      <div className="grid gap-3">
        <p className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-accent">
          Solicitação enviada
        </p>
        <h1 className={`text-balance ${HEADING_PAGE}`}>
          Iremos retornar com as condições assim que possível.
        </h1>
      </div>

      <dl className="grid gap-3 border border-border bg-surface p-5 sm:grid-cols-3">
        <SentRow label="Produtos" value={String(summary.itemCount)} />
        <SentRow label="Unidades" value={String(summary.totalQuantity)} />
        <SentRow
          label="Total estimado"
          value={formatCentsToBRL(summary.totalCents)}
        />
      </dl>

      <p className="max-w-2xl font-body text-[14px] leading-5 text-secondary">
        {sellerEmail
          ? `Enviamos uma cópia do pedido para ${sellerEmail}.`
          : 'Enviamos uma cópia do pedido para o seu e-mail.'}
      </p>

      <Button
        className="justify-self-start"
        type="button"
        variant="outline"
        onClick={onBackToCatalog}
      >
        Voltar ao catálogo
      </Button>
    </div>
  );
}

function SentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
        {label}
      </dt>
      <dd className="font-body text-[18px] leading-6 text-primary">{value}</dd>
    </div>
  );
}
