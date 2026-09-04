import { unitPriceForTier } from '@/b2b/order-pricing';
import type { OrderDraft } from '@/b2b/use-order-draft';
import { OrderSummary } from '@/components/b2b/order-summary';
import { ProductThumb } from '@/components/b2b/product-row';
import { QuantityStepper } from '@/components/b2b/quantity-stepper';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatCentsToBRL } from '@/lib/br-money';
import { HEADING_PAGE } from '@/lib/typography';

/** Step two: confirm what is in the order, then send it. */
export function B2BOrderReview({
  draft,
  minimumOrderQuantity,
  notes,
  onNotesChange,
  onBack,
  onSubmit,
  submitting,
  message,
  failed,
}: {
  draft: OrderDraft;
  minimumOrderQuantity: number;
  notes: string;
  onNotesChange: (next: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  message: string | null;
  failed: boolean;
}) {
  const { items, pricing } = draft;
  const belowMinimum = pricing.totalQuantity < minimumOrderQuantity;

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Button
          className="justify-self-start"
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          ← Voltar ao catálogo
        </Button>
        <h1 className={`text-balance ${HEADING_PAGE}`}>Revise o pedido.</h1>
        <p className="max-w-2xl font-body text-[14px] leading-5 text-secondary">
          Iremos retornar com as condições assim que possível.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="font-body text-[14px] text-secondary">
          Nenhum item no pedido. Volte ao catálogo para adicionar produtos.
        </p>
      ) : (
        <ul
          aria-label="Itens do pedido"
          className="divide-y divide-border border-y border-border"
        >
          {items.map(({ product, quantity }) => {
            const unitPriceCents = unitPriceForTier(
              product.prices,
              pricing.tier,
            );
            return (
              <li
                key={product.id}
                className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_8rem] sm:items-center sm:gap-6"
              >
                <div className="flex items-center gap-3">
                  <ProductThumb className="size-14" src={product.imageUrl} />
                  <div className="grid gap-1">
                    <p className="font-body text-[14px] font-bold leading-5 text-primary">
                      {product.name}
                    </p>
                    <p className="font-body text-[12px] leading-5 text-secondary">
                      {formatCentsToBRL(unitPriceCents)} por unidade
                    </p>
                  </div>
                </div>

                <p className="font-body text-[15px] font-bold leading-5 text-primary sm:text-right">
                  {formatCentsToBRL(unitPriceCents * quantity)}
                </p>

                <QuantityStepper
                  productName={product.name}
                  quantity={quantity}
                  onChange={(next) => draft.setQuantity(product.id, next)}
                />
              </li>
            );
          })}
        </ul>
      )}

      <OrderSummary
        minimumOrderQuantity={minimumOrderQuantity}
        pricing={pricing}
      />

      <div className="grid gap-4">
        <label
          className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-secondary"
          htmlFor="b2b-order-notes"
        >
          Observações
        </label>
        <Textarea
          id="b2b-order-notes"
          placeholder="Observações, prazos ou mix desejado"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
        {message ? (
          <p
            className={
              failed ? 'text-sm text-accent' : 'text-sm text-secondary'
            }
            role="status"
          >
            {message}
          </p>
        ) : null}
        <Button
          disabled={belowMinimum || submitting}
          type="button"
          onClick={onSubmit}
        >
          {submitting ? 'Enviando…' : 'Enviar'}
        </Button>
      </div>
    </div>
  );
}
