import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminProductRow } from '~/server/db/queries';

const products: AdminProductRow[] = [
  {
    id: 7,
    sku: 'GH-7',
    name: 'Rotor Gheno',
    active: true,
    visibleB2b: true,
    category: 'Rotores',
  },
  {
    id: 8,
    sku: 'GH-8',
    name: 'Cubo Gheno',
    active: true,
    visibleB2b: false,
    category: 'Cubos',
  },
];

vi.mock('@remix-run/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@remix-run/react')>();
  return {
    ...actual,
    Form: ({ children, ...props }: React.ComponentProps<'form'>) => (
      <form {...props}>{children}</form>
    ),
  };
});

vi.mock('./admin-product-drawer', () => ({
  AdminProductDrawer: ({ product }: { product: AdminProductRow | null }) =>
    product ? <div data-testid="drawer">Drawer: {product.name}</div> : null,
}));

import { AdminProductsTable } from './admin-products-table';

describe('AdminProductsTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('opens the dedicated drawer from the whole product row', () => {
    render(<AdminProductsTable products={products} query="" />);

    fireEvent.click(screen.getByRole('row', { name: /Rotor Gheno/ }));

    expect(screen.getByTestId('drawer')).toHaveTextContent('Rotor Gheno');
    expect(screen.queryByRole('columnheader', { name: 'Ações' })).toBeNull();
  });

  it('opens the drawer with Enter for keyboard users', () => {
    render(<AdminProductsTable products={products} query="" />);

    fireEvent.keyDown(screen.getByRole('row', { name: /Cubo Gheno/ }), {
      key: 'Enter',
    });

    expect(screen.getByTestId('drawer')).toHaveTextContent('Cubo Gheno');
  });

  it('shows bulk actions only after selection without opening the drawer', () => {
    render(<AdminProductsTable products={products} query="pad" />);

    expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
    fireEvent.click(screen.getByLabelText('Selecionar Rotor Gheno'));

    expect(screen.queryByTestId('drawer')).toBeNull();
    const bar = screen.getByRole('group', { name: 'Ações em massa' });
    expect(bar).toHaveTextContent('1 produto selecionado');
    expect(
      screen.getByRole('button', { name: 'Mostrar selecionados' }),
    ).toHaveAttribute('value', 'bulk-show');
    expect(
      screen.getByRole('button', { name: 'Ocultar selecionados' }),
    ).toHaveAttribute('value', 'bulk-hide');
  });

  it('updates the selected count and can clear it', () => {
    render(<AdminProductsTable products={products} query="" />);

    fireEvent.click(screen.getByLabelText('Selecionar Rotor Gheno'));
    fireEvent.click(screen.getByLabelText('Selecionar Cubo Gheno'));

    expect(
      screen.getByRole('group', { name: 'Ações em massa' }),
    ).toHaveTextContent('2 produtos selecionados');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
    expect(screen.queryByRole('group', { name: 'Ações em massa' })).toBeNull();
  });
});
