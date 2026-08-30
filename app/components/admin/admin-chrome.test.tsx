import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { AdminChrome } from './admin-chrome';

function renderChrome(current: 'sellers' | 'products') {
  const router = createMemoryRouter(
    [
      {
        path: '/admin',
        element: (
          <AdminChrome
            current={current}
            description="desc"
            title={current === 'sellers' ? 'Lojistas B2B' : 'Produtos B2B'}
          />
        ),
      },
    ],
    { initialEntries: ['/admin'] },
  );

  return render(<RouterProvider router={router} />);
}

describe('AdminChrome', () => {
  it('links lojistas and produtos with current page marked', () => {
    renderChrome('products');

    const products = screen.getByRole('link', { name: 'Produtos' });
    const sellers = screen.getByRole('link', { name: 'Lojistas' });
    expect(products).toHaveAttribute('href', '/admin/produtos');
    expect(products).toHaveAttribute('aria-current', 'page');
    expect(sellers).toHaveAttribute('href', '/admin');
    expect(sellers).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
  });
});
