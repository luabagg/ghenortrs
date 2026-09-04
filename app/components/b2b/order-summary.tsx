import type { OrderPricing } from '@/b2b/order-pricing';
import { TIER_LABELS } from '@/components/b2b/tier-ladder';
import { formatCentsToBRL } from '@/lib/br-money';

export function OrderSummary({
  pricing,
  minimumOrderQuantity,
}: {
  pricing: OrderPricing;
  minimumOrderQuantity: number;
}) {
  const missingUnits = Math.max(
    0,
    minimumOrderQuantity - pricing.totalQuantity,
  );

  return (
    <dl className="grid gap-3 border border-border bg-surface p-4 sm:grid-cols-2">
      <SummaryRow
        label="Unidades"
        value={
          missingUnits > 0
            ? `${pricing.totalQuantity} de ${minimumOrderQuantity} (faltam ${missingUnits})`
            : String(pricing.totalQuantity)
        }
      />
      <SummaryRow label="Tabela aplicada" value={TIER_LABELS[pricing.tier]} />
      <SummaryRow
        label="Base da tabela"
        value={formatCentsToBRL(pricing.startSubtotalCents)}
      />
      <SummaryRow
        label="Total do pedido"
        value={formatCentsToBRL(pricing.totalCents)}
      />
      <div className="sm:col-span-2">
        <p className="font-body text-[12px] leading-5 text-secondary">
          {pricing.nextTier
            ? `Some ${formatCentsToBRL(pricing.amountToNextTierCents)} à base da tabela para chegar na tabela ${TIER_LABELS[pricing.nextTier]}.`
            : 'Você está na melhor tabela, a Max.'}
        </p>
      </div>
    </dl>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
        {label}
      </dt>
      <dd className="font-body text-[14px] leading-5 text-primary">{value}</dd>
    </div>
  );
}
