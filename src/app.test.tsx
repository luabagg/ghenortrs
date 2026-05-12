import { fireEvent, render, screen } from '@testing-library/react';
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
    expect(
      screen.getByAltText('Rider GHENO em trilha com controle total'),
    ).toHaveAttribute('src', '/reference-images/mtb-action-hero.jpg');
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
      screen.getByAltText(
        'Pinça de freio Hayes Dominion A4 — produto compatível com pastilhas GHENO',
      ),
    ).toHaveAttribute('src', '/reference-images/hayes-a4-caliper.jpg');
    expect(
      screen.getByRole('heading', { name: 'Hayes Dominion A4.' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Explorar componentes' }),
    ).toHaveAttribute('href', '/componentes');
  });

  it('renders the competition proof section with six race images', () => {
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
    expect(
      screen.getByAltText(
        'Rider em trecho técnico de downhill durante competição',
      ),
    ).toHaveAttribute('src', '/reference-images/comp-dh-technical.jpg');
    expect(
      screen.getByAltText(
        'Rider em alta velocidade em descida de competição de MTB',
      ),
    ).toHaveAttribute('src', '/reference-images/comp-dh-speed.jpg');
    expect(screen.getByText('Velocidade máxima')).toBeInTheDocument();
    expect(screen.getByText('Terreno rochoso')).toBeInTheDocument();
    expect(screen.getByText('Pressão de prova')).toBeInTheDocument();
    expect(screen.getByText('Controle em floresta')).toBeInTheDocument();
    expect(screen.getByText('Trecho técnico')).toBeInTheDocument();
    expect(screen.getByText('Descida em DH')).toBeInTheDocument();
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
      screen.getAllByRole('link', { name: 'Entrar na Loja B2B →' })[1],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getByRole('link', { name: 'Falar com a GHENO' }),
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
    expect(
      screen.getByAltText(
        'Rotor GHENO instalado em bike de DH com freio Hayes Dominion, vista frontal',
      ),
    ).toHaveAttribute('src', '/reference-images/rotor-installed-front.jpg');
    expect(
      screen.getByAltText(
        'Rotor GHENO instalado em bike de DH com freio Hayes Dominion, vista traseira',
      ),
    ).toHaveAttribute('src', '/reference-images/rotor-installed-rear.jpg');
    expect(screen.getByText('Prova real')).toBeInTheDocument();
    expect(screen.getByText('Demanda técnica')).toBeInTheDocument();
    expect(screen.getByText('Mix consultivo')).toBeInTheDocument();
    expect(screen.getByText('Rotor instalado')).toBeInTheDocument();
    expect(screen.getByText('Em campo')).toBeInTheDocument();
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
      screen.getByRole('navigation', { name: 'Links institucionais' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacidade' })).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/politica-de-privacidade/',
    );
    expect(
      screen.getByRole('link', { name: 'Instagram GHENO' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/ghenortrs/');
  });

  it('renders the components route with product families', () => {
    render(
      <MemoryRouter initialEntries={['/componentes']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Pastilhas de freio' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Cubos de alta rolagem' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Aros de carbono e alumínio' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Rotores de dissipação' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver catálogo de pastilhas' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getByRole('link', { name: 'Pré-cadastro comercial' }),
    ).toHaveAttribute('href', '/b2b');
  });

  it('renders the B2B route with full lead form', () => {
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
    expect(screen.getByText('Telefone / WhatsApp')).toHaveAttribute(
      'for',
      'b2b-phone',
    );
    expect(screen.getByText('E-mail')).toHaveAttribute('for', 'b2b-email');
    expect(screen.getByText('Necessidades comerciais')).toHaveAttribute(
      'for',
      'b2b-needs',
    );
    expect(screen.getByLabelText('Necessidades comerciais')).toHaveAttribute(
      'placeholder',
      'Conte o mix, volume e tipo de atendimento.',
    );
    expect(
      screen.getByRole('button', { name: 'Enviar pré-cadastro' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Pré-cadastro comercial')).toBeInTheDocument();
  });

  it('shows inline validation errors when B2B form is submitted empty', () => {
    render(
      <MemoryRouter initialEntries={['/b2b']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar pré-cadastro' }),
    );

    expect(
      screen.getByText('Nome da empresa é obrigatório.'),
    ).toBeInTheDocument();
    expect(screen.getByText('CNPJ é obrigatório.')).toBeInTheDocument();
    expect(
      screen.getByText('Telefone/WhatsApp é obrigatório.'),
    ).toBeInTheDocument();
    expect(screen.getByText('E-mail é obrigatório.')).toBeInTheDocument();
  });

  it('shows CNPJ digit-count error for short CNPJ input', () => {
    render(
      <MemoryRouter initialEntries={['/b2b']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('CNPJ'), {
      target: { value: '12.345.678/0001-9' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar pré-cadastro' }),
    );

    expect(screen.getByText('CNPJ deve ter 14 dígitos.')).toBeInTheDocument();
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
