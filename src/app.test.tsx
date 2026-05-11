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
      screen.getByText('COMPONENTES MTB DE ALTO DESEMPENHO'),
    ).toHaveAttribute('data-slot', 'meta-label');
    expect(
      screen.getByRole('heading', {
        name: 'Pastilhas e componentes GHENO para quem exige frenagem, controle e consistência na trilha.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'GHENO é marca para rider, oficina e lojista que precisa de componente com resposta previsível, acabamento firme e presença real no pedal.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Componentes' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Principal' }).parentElement,
    ).toHaveClass(
      'bg-surface-glass/80',
      'backdrop-blur-xl',
      'shadow-[0_20px_48px_rgba(0,0,0,0.24)]',
    );
    expect(
      screen.getByRole('link', { name: 'Ver catálogo GHENO' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getByRole('link', { name: 'Ver catálogo GHENO' }),
    ).toHaveClass('bg-accent', 'text-on-accent');
    expect(
      screen.getByRole('link', { name: 'Falar com GHENO B2B' }),
    ).toHaveClass('border', 'border-strong', 'bg-background-soft');
    expect(screen.getByText('Catálogo ativo no ar')).toBeInTheDocument();
    expect(
      screen.getByText('Checkout delegado à Nuvemshop'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Atendimento comercial para linhas sem catálogo publicado',
      ),
    ).toBeInTheDocument();
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
    expect(screen.getByText('COMPONENTES')).toHaveAttribute(
      'data-slot',
      'meta-label',
    );
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
    expect(screen.getByText('Empresa')).toHaveAttribute('for', 'b2b-company');
    expect(screen.getByText('CNPJ')).toHaveAttribute('for', 'b2b-cnpj');
    expect(screen.getByText('Necessidades comerciais')).toHaveAttribute(
      'for',
      'b2b-needs',
    );
    expect(screen.getByLabelText('Necessidades comerciais')).toHaveAttribute(
      'placeholder',
      'Conte o mix, volume e tipo de atendimento.',
    );
    expect(
      screen.getByRole('heading', { name: 'Atendimento comercial direto' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Leitura rápida para operações que precisam comprar com contexto técnico antes do M3.',
      ),
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
