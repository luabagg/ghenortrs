import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { App } from './App';

describe('App', () => {
  it('renders the home route inside the shared shell', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('app-shell')).toHaveClass(
      'min-h-screen',
      'bg-background',
      'text-primary',
      'font-body',
    );
    expect(
      screen.getByRole('heading', { name: 'GHENO components' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Performance-first MTB components' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Componentes' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Explorar componentes' }),
    ).toHaveClass('bg-accent', 'text-on-accent');
    expect(
      screen.getByRole('link', { name: 'Falar com GHENO B2B' }),
    ).toHaveClass('border', 'border-strong', 'bg-background-soft');
  });

  it('renders the components route', () => {
    render(
      <MemoryRouter initialEntries={['/componentes']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Componentes GHENO' }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Carregando vitrine de componentes GHENO'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sincronizando famílias, acabamentos e provas técnicas.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the B2B route', () => {
    render(
      <MemoryRouter initialEntries={['/b2b']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Atendimento para lojistas e oficinas',
      }),
    ).toBeInTheDocument();
  });

  it('renders the not found route', () => {
    render(
      <MemoryRouter initialEntries={['/nao-existe']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument();
  });
});
