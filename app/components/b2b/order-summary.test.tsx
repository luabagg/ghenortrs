import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrderSummary } from './order-summary';

describe('OrderSummary', () => {
  it('keeps an explicit space before the minimum subtotal value', () => {
    render(
      <OrderSummary
        pricing={{
          tier: 'start',
          totalQuantity: 1,
          startSubtotalCents: 40_000,
          totalCents: 40_000,
          nextTier: 'pro',
          amountToNextTierCents: 110_000,
          minimumOrderSubtotalCents: 50_000,
          amountToMinimumSubtotalCents: 10_000,
        }}
      />,
    );

    expect(
      screen.getByText(
        'Falta R$ 100,00 para o pedido mínimo de R$ 500,00 em mercadorias.',
      ),
    ).toBeVisible();
  });
});
