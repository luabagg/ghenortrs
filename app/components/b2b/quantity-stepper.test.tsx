import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuantityStepper } from './quantity-stepper';

function setup(quantity: number) {
  const onChange = vi.fn();
  render(
    <QuantityStepper
      productName="Aro 29"
      quantity={quantity}
      onChange={onChange}
    />,
  );
  return onChange;
}

describe('QuantityStepper', () => {
  it('offers a single add action while the order is empty of it', () => {
    const onChange = setup(0);

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar Aro 29 ao pedido' }),
    );

    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.queryByLabelText('Quantidade de Aro 29')).toBeNull();
  });

  it('steps up and down by one', () => {
    const onChange = setup(4);

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar uma unidade de Aro 29' }),
    );
    expect(onChange).toHaveBeenCalledWith(5);

    fireEvent.click(
      screen.getByRole('button', { name: 'Remover uma unidade de Aro 29' }),
    );
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('accepts a typed quantity, so a bulk order needs no repeated taps', () => {
    const onChange = setup(1);

    fireEvent.change(screen.getByLabelText('Quantidade de Aro 29'), {
      target: { value: '60' },
    });

    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('reports zero when the field is cleared', () => {
    const onChange = setup(1);

    fireEvent.change(screen.getByLabelText('Quantidade de Aro 29'), {
      target: { value: '' },
    });

    expect(onChange).toHaveBeenCalledWith(0);
  });
});
