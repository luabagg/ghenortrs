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
    expect(screen.getAllByAltText('GHENO')[0]).toHaveAttribute(
      'src',
      '/brand/logo-wide.png',
    );
    expect(screen.getByAltText('Rider GHENO em trilha')).toHaveAttribute(
      'src',
      '/reference-images/mtb-action-hero.jpg',
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Componentes de performance para MTB de verdade.',
    );
    expect(
      screen.getByText(
        'Pastilhas, cubos, aros e rotores desenvolvidos para controle, resistência e confiança em uso intenso.',
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
      screen.getAllByRole('link', { name: 'Entrar na Loja B2B →' })[0],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getAllByRole('link', { name: 'Entrar na Loja B2B →' })[0],
    ).toHaveClass('bg-accent', 'text-on-accent');
    expect(
      screen.getAllByRole('link', { name: 'Ver componentes' })[0],
    ).toHaveClass('border', 'border-strong', 'bg-background-soft');
    expect(screen.getByText('Controle extremo')).toBeInTheDocument();
    expect(screen.getByText('Materiais premium')).toBeInTheDocument();
    expect(screen.getByText('Testado em condições reais')).toBeInTheDocument();
    expect(
      screen.getByText('Performance que dá confiança'),
    ).toBeInTheDocument();
  });

  it('renders the component families section with correct CTAs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Um sistema. Quatro pilares de performance.',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Pastilhas' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cubos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aros' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Rotores' }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Pastilha de freio GHENO')).toHaveAttribute(
      'src',
      '/reference-images/pastilhas-gheno.jpg',
    );
    expect(screen.getByAltText('Cubo GHENO')).toHaveAttribute(
      'src',
      '/reference-images/cubo-gheno.jpg',
    );
    expect(screen.getByAltText('Aro GHENO')).toHaveAttribute(
      'src',
      '/reference-images/aro-gheno.jpg',
    );
    expect(screen.getByAltText('Rotor GHENO')).toHaveAttribute(
      'src',
      '/reference-images/rotor-gheno.jpg',
    );

    const pastilhasLinks = screen.getAllByRole('link', {
      name: 'Ver catálogo GHENO',
    });
    expect(pastilhasLinks.length).toBeGreaterThanOrEqual(1);
    expect(pastilhasLinks[0]).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/',
    );

    expect(
      screen.getByRole('link', { name: 'Consultar cubos' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/contato/');
    expect(
      screen.getByRole('link', { name: 'Consultar aros' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/contato/');
    expect(
      screen.getByRole('link', { name: 'Consultar rotores' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/contato/');
  });

  it('renders the technical proof section with stats, features, and media', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Tecnologia que você sente na trilha.',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('+300°C')).toBeInTheDocument();
    expect(screen.getByText('Resistência')).toBeInTheDocument();
    expect(screen.getByText('4×')).toBeInTheDocument();
    expect(screen.getByText('Compostos')).toBeInTheDocument();

    expect(
      screen.getByText('Liga de aço de alta resistência'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Compatível com Shimano, SRAM e TRP'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Validado em competição e uso intenso'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Modulação sem fade em calor extremo'),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Imagens de tecnologia GHENO')).toHaveClass(
      'snap-x',
      'overflow-x-auto',
    );
    expect(
      screen.getByAltText(
        'Rotor de freio GHENO — disco de alta performance para MTB',
      ),
    ).toHaveAttribute('src', '/reference-images/rotor-gheno.jpg');
    expect(
      screen.getByAltText('Rider GHENO freando em trecho técnico de downhill'),
    ).toHaveAttribute('src', '/reference-images/trilha-frenagem-gheno.jpg');
    expect(
      screen.getByRole('heading', { name: 'Dissipação precisa.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Testado onde importa.' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Explorar componentes' }),
    ).toHaveAttribute('href', '/componentes');
  });

  it('renders the competition proof section with four race images', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Componentes desenvolvidos para aguentar o que a prova cobra.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Imagens de competição MTB')).toHaveClass(
      'snap-x',
      'overflow-x-auto',
    );
    expect(
      screen.getByAltText(
        'Rider em alta velocidade durante prova de DH com público ao fundo',
      ),
    ).toHaveAttribute('src', '/reference-images/comp-panned-action.jpg');
    expect(
      screen.getByAltText('Rider descendo trecho rochoso em prova de downhill'),
    ).toHaveAttribute('src', '/reference-images/comp-dh-rocky.jpg');
    expect(
      screen.getByAltText('Rider em prova de DH com espectadores acompanhando'),
    ).toHaveAttribute('src', '/reference-images/comp-dh-crowd.jpg');
    expect(
      screen.getByAltText('Rider em trilha florestal de competição'),
    ).toHaveAttribute('src', '/reference-images/comp-dh-forest.jpg');
    expect(screen.getByText('Velocidade máxima')).toBeInTheDocument();
    expect(screen.getByText('Terreno rochoso')).toBeInTheDocument();
    expect(screen.getByText('Pressão de prova')).toBeInTheDocument();
    expect(screen.getByText('Controle em floresta')).toBeInTheDocument();
  });

  it('renders the B2B teaser section with correct CTAs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Para lojistas, oficinas e revendas que buscam performance real.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Abrir frente B2B' }),
    ).toHaveAttribute('href', '/b2b');
    expect(
      screen.getByRole('link', { name: 'Contato comercial' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/contato/');
    expect(
      screen.getByLabelText('Contexto visual para atendimento B2B GHENO'),
    ).toHaveClass('snap-x', 'overflow-x-auto');
    expect(
      screen.getByAltText('Rider em prova de MTB diante do público'),
    ).toHaveAttribute('src', '/reference-images/b2b-race-context.jpg');
    expect(
      screen.getByAltText('Rider em curva de trilha com terreno solto'),
    ).toHaveAttribute('src', '/reference-images/b2b-trail-validation.jpg');
    expect(
      screen.getByAltText('Detalhe de freio e rotor em bicicleta de MTB'),
    ).toHaveAttribute('src', '/reference-images/b2b-brake-detail.jpg');
    expect(screen.getByText('Prova real')).toBeInTheDocument();
    expect(screen.getByText('Demanda técnica')).toBeInTheDocument();
    expect(screen.getByText('Mix consultivo')).toBeInTheDocument();
  });

  it('renders the closing CTA section with correct destinations', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Pronto para elevar a performance das suas bikes?',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Acessar Loja B2B' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen
        .getAllByRole('link', { name: 'Ver componentes' })
        .find((el) => el.closest('[aria-labelledby="fechamento-heading"]')),
    ).toHaveAttribute('href', '/componentes');
  });

  it('renders the footer with verified store links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Entrar na Loja' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(screen.getByRole('link', { name: 'Pastilhas' })).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/',
    );
    expect(
      screen.getByRole('link', { name: 'Política de Privacidade' }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/politica-de-privacidade/',
    );
    expect(
      screen.getByRole('link', { name: 'Instagram GHENO' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/ghenortrs/');
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
