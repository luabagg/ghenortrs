import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { StoreSearch } from './store-search';

function renderSearch(props: Partial<React.ComponentProps<typeof StoreSearch>> = {}) {
  return render(
    <MemoryRouter>
      <StoreSearch mode="desktop" {...props} />
    </MemoryRouter>,
  );
}

describe('StoreSearch', () => {
  it('does not preselect a featured suggestion until keyboard navigation', () => {
    renderSearch({ mode: 'mobile' });
    const input = screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' });

    expect(screen.getByRole('link', { name: /Aros/i })).toBeInTheDocument();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(input.getAttribute('aria-activedescendant')).toMatch(/category:aros$/);
  });

  it('filters compatibility terms and links to the exact Nuvemshop product', () => {
    renderSearch();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'hayes a4' },
    });

    expect(
      screen.getByRole('link', {
        name: /Hayes Dominion A4 Pastilha de Freio GHENO Ultra/i,
      }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/hayes-dominion-a4-pastilha-de-freio-gheno-ultra/',
    );
  });

  it('routes unavailable rotor results to owned contact', () => {
    renderSearch();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'rotor 223' },
    });

    expect(
      screen.getByRole('link', { name: /Disco Elite 3 223mm/i }),
    ).toHaveAttribute('href', '/contato');
  });

  it('offers the official encoded store search when the index has no match', () => {
    renderSearch();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'produto inexistente' },
    });

    expect(
      screen.getByRole('link', {
        name: 'Buscar “produto inexistente” na loja GHENO rotors',
      }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/search/?q=produto%20inexistente',
    );
  });

  it('moves the active result with arrow keys', () => {
    renderSearch();
    const input = screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const firstActiveId = input.getAttribute('aria-activedescendant');
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(input.getAttribute('aria-activedescendant')).not.toBe(firstActiveId);
  });

  it('notifies mobile menu after an owned navigation click', () => {
    const onNavigate = vi.fn();
    renderSearch({ mode: 'mobile', onNavigate });

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'contato' },
    });
    fireEvent.click(screen.getByRole('link', { name: /Contato/i }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
