import type { OrderPricing } from '@/b2b/order-pricing';
import { TIER_LABELS } from '@/components/b2b/tier-ladder';
import { formatCentsToBRL } from '@/lib/br-money';

/**
 * The seller needs three things: what it costs, what is in it, and what the
 * next table would take. The qualifying subtotal is an internal mechanic and
 * reading higher than the total only confused people, so it stays server side.
 */
export function OrderSummary({ pricing }: { pricing: OrderPricing }) {
  return (
    <section
      aria-label="Resumo do pedido"
      className="grid gap-2 border border-border bg-surface p-5"
    >
      <p className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
        Total do pedido
      </p>
      <p className="font-heading text-[34px] leading-none tracking-[-0.03em] text-primary">
        {formatCentsToBRL(pricing.totalCents)}
      </p>
      <p className="font-body text-[14px] leading-5 text-secondary">
        {pricing.totalQuantity}{' '}
        {pricing.totalQuantity === 1 ? 'unidade' : 'unidades'} · tabela{' '}
        {TIER_LABELS[pricing.tier]}
      </p>

      {pricing.amountToMinimumSubtotalCents > 0 ? (
        <p className="font-body text-[13px] leading-5 text-accent">
          Falta {formatCentsToBRL(pricing.amountToMinimumSubtotalCents)} para o
          pedido mínimo de {formatCentsToBRL(pricing.minimumOrderSubtotalCents)}{' '}
          em mercadorias.
        </p>
      ) : null}

      {pricing.nextTier ? (
        <p className="font-body text-[13px] leading-5 text-secondary">
          Falta {formatCentsToBRL(pricing.amountToNextTierCents)} para a tabela{' '}
          {TIER_LABELS[pricing.nextTier]}, com preços melhores.
        </p>
      ) : (
        <p className="font-body text-[13px] leading-5 text-secondary">
          Você está na melhor tabela, a Max.
        </p>
      )}
    </section>
  );
}
