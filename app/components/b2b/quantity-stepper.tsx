import { Button } from '@/components/ui/button';

/**
 * Empty state is a single Adicionar button. Once the order holds the product
 * it becomes a stepper whose middle stays typable, because a wholesale order
 * of 60 units should not need 60 taps.
 */
export function QuantityStepper({
  quantity,
  productName,
  onChange,
}: {
  quantity: number;
  productName: string;
  onChange: (next: number) => void;
}) {
  if (quantity <= 0) {
    return (
      <Button
        aria-label={`Adicionar ${productName} ao pedido`}
        className="w-full sm:w-32"
        type="button"
        variant="outline"
        onClick={() => onChange(1)}
      >
        Adicionar
      </Button>
    );
  }

  return (
    <div className="flex h-12 w-full items-center justify-between rounded-md border border-accent sm:w-32">
      <StepButton
        label={`Remover uma unidade de ${productName}`}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </StepButton>
      <input
        aria-label={`Quantidade de ${productName}`}
        className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-center font-body text-[15px] font-bold text-primary focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        inputMode="numeric"
        min={0}
        step={1}
        type="number"
        value={quantity}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <StepButton
        label={`Adicionar uma unidade de ${productName}`}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </StepButton>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-full w-10 shrink-0 cursor-pointer place-items-center font-body text-[18px] leading-none text-accent transition-colors hover:bg-accent/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
