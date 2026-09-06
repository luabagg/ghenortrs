import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const product = {
  id: 7,
  sku: 'GH-7',
  name: 'Rotor Gheno',
  active: true,
  visibleB2b: true,
  category: 'Rotor',
};

const loadMock = vi.fn();
let fetcherState: 'idle' | 'loading' = 'idle';
let fetcherData:
  | {
      product: typeof product & {
        description: string;
        imageUrl: string | null;
        unit: string | null;
        stock: number | null;
        priceStartCents: number | null;
        priceProCents: number | null;
        priceMaxCents: number | null;
      };
    }
  | undefined;

vi.mock('@remix-run/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@remix-run/react')>();
  return {
    ...actual,
    useFetcher: () => ({
      data: fetcherData,
      load: loadMock,
      state: fetcherState,
    }),
  };
});

vi.mock('~/components/catalog/product-detail-content', () => ({
  ProductDetailContent: ({
    onImageExpandedChange,
    product: detail,
  }: {
    onImageExpandedChange?: (expanded: boolean) => void;
    product: { description: string };
  }) => (
    <>
      <button type="button" onClick={() => onImageExpandedChange?.(true)}>
        Abrir imagem
      </button>
      <p>{detail.description}</p>
    </>
  ),
}));

import { AdminProductDrawer } from './admin-product-drawer';

describe('AdminProductDrawer', () => {
  beforeEach(() => {
    loadMock.mockReset();
    fetcherState = 'idle';
    fetcherData = undefined;
  });

  it('loads details once and shows an accessible pending state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <AdminProductDrawer product={product} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando detalhes do produto…',
    );
    expect(loadMock).toHaveBeenCalledTimes(1);

    fetcherState = 'loading';
    rerender(
      <MemoryRouter>
        <AdminProductDrawer product={product} />
      </MemoryRouter>,
    );
    expect(loadMock).toHaveBeenCalledTimes(1);
  });

  it('renders the loaded detail instead of the pending state', () => {
    fetcherData = {
      product: {
        ...product,
        description: 'Descrição técnica',
        imageUrl: null,
        unit: 'un',
        stock: 4,
        priceStartCents: 50000,
        priceProCents: 45000,
        priceMaxCents: 40000,
      },
    };

    render(
      <MemoryRouter>
        <AdminProductDrawer product={product} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Descrição técnica')).toBeInTheDocument();
  });

  it('keeps the drawer open when Escape closes the expanded image first', () => {
    fetcherData = {
      product: {
        ...product,
        description: '',
        imageUrl: null,
        unit: null,
        stock: null,
        priceStartCents: null,
        priceProCents: null,
        priceMaxCents: null,
      },
    };
    render(
      <MemoryRouter>
        <AdminProductDrawer product={product} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));
    expect(
      screen.getByRole('dialog', { name: product.name }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir imagem' }));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.getByRole('dialog', { name: product.name }),
    ).toBeInTheDocument();
  });
});
