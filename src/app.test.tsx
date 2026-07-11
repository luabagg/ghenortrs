import { fireEvent, render, screen, within } from '@testing-library/react';
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
    expect(screen.queryByText('GHENO COMPONENTES')).not.toBeInTheDocument();
    expect(screen.getAllByAltText('GHENO')[0]).toHaveAttribute(
      'src',
      '/brand/logo-wide.png',
    );
    expect(
      screen.getByAltText('Rider GHENO em trilha com controle total'),
    ).toHaveAttribute('src', '/reference-images/mtb-action-hero.jpg');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Frenagem e controle para MTB.',
    );
    expect(
      screen.getByText(
        'Pastilhas GHENO disponíveis no catálogo. Cubos, aros e rotores sob consulta comercial.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Componentes' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Principal' }).parentElement,
    ).not.toHaveAttribute('data-slot', 'glass-panel');
    expect(
      screen.getAllByRole('link', { name: 'Ver catálogo GHENO →' })[0],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getAllByRole('link', { name: 'Ver catálogo GHENO →' })[0],
    ).toHaveClass('bg-accent', 'text-on-accent');
    expect(
      screen.getAllByRole('link', { name: 'Ver componentes →' })[0],
    ).toHaveClass('border', 'border-strong', 'bg-background/35');
    expect(screen.getByText('Catálogo de pastilhas ativo')).toBeInTheDocument();
    expect(
      screen.getByText('Compatibilidade identificada'),
    ).toBeInTheDocument();
    expect(screen.getByText('Outras linhas sob consulta')).toBeInTheDocument();
    expect(screen.getByText('Atendimento B2B')).toBeInTheDocument();
  });

  it('renders the component families section with correct CTAs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Pastilhas no catálogo. Outras linhas sob consulta.',
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

    const productLinks = [
      screen.getAllByRole('link', { name: 'Ver catálogo GHENO →' })[1],
      screen.getByRole('link', { name: 'Consultar cubos →' }),
      screen.getByRole('link', { name: 'Consultar aros →' }),
      screen.getByRole('link', { name: 'Consultar rotores →' }),
    ];
    expect(productLinks[0]).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/',
    );

    expect(productLinks[1]).toHaveAttribute('href', '/contato');
    expect(productLinks[2]).toHaveAttribute('href', '/contato');
    expect(productLinks[3]).toHaveAttribute('href', '/contato');
  });

  it('renders the technical proof section with stats, features, and media', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Atrito, calor e acabamento sob controle.',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('ATRITO')).toBeInTheDocument();
    expect(screen.getByText('Consistência')).toBeInTheDocument();
    expect(screen.getByText('CALOR')).toBeInTheDocument();
    expect(screen.getByText('Gestão térmica')).toBeInTheDocument();

    expect(
      screen.getByText('Controle de atrito para resposta consistente'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Gestão de calor em frenagens repetidas'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Acabamento orientado ao encaixe do componente'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Confiabilidade para uso técnico em MTB'),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Imagens de tecnologia GHENO')).toHaveClass(
      'snap-x',
      'overflow-x-auto',
    );
    expect(
      screen.getByAltText('Rotor de freio a disco GHENO para MTB'),
    ).toHaveAttribute('src', '/reference-images/rotor-gheno.jpg');
    expect(
      screen.getByAltText('Rider GHENO freando em trecho técnico de downhill'),
    ).toHaveAttribute('src', '/reference-images/trilha-frenagem-gheno.jpg');
    expect(
      screen.getByRole('heading', { name: 'Rotores sob consulta.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Uso em downhill.' }),
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
        name: 'Componentes GHENO em contexto de competição.',
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
        name: 'Atendimento comercial para oficinas e revendas.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Acessar produtos B2B →' }),
    ).toHaveAttribute('href', '/b2b');
    const b2bTeaser = screen
      .getByLabelText('Contexto visual para atendimento B2B GHENO')
      .closest('[data-section="b2b-teaser"]');
    expect(
      within(b2bTeaser as HTMLElement).queryByRole('link', {
        name: 'Falar com a GHENO',
      }),
    ).toBeNull();
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
    expect(screen.getByText('Downhill')).toBeInTheDocument();
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
        name: 'Compre pastilhas online. Consulte as outras linhas.',
      }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: 'Ver loja online' })
        .find((el) => el.closest('[aria-labelledby="fechamento-heading"]')),
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
      within(footer).getByRole('link', { name: 'Ver loja online' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getAllByRole('link', { name: 'Pastilhas' })[0],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getByRole('navigation', { name: 'Links institucionais' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacidade' })).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/politica-de-privacidade/',
    );
    expect(
      screen.getByRole('link', { name: 'Instagram GHENO' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/gheno_rtrs/');
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
      screen.getByRole('heading', { name: 'Cubos GHENO' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Aros GHENO' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Rotores GHENO' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver catálogo de pastilhas' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getByRole('link', { name: 'Pré-cadastro comercial' }),
    ).toHaveAttribute('href', '/b2b');
  });

  it('renders institutional context on the about route', () => {
    render(
      <MemoryRouter initialEntries={['/sobre']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Componentes GHENO para MTB.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A GHENO é uma marca brasileira de componentes para mountain bike, com foco em frenagem, controle e uso técnico.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Componentes de MTB com foco técnico.'),
    ).toBeInTheDocument();
  });

  it('renders the B2B route with access login and lead form', () => {
    render(
      <MemoryRouter initialEntries={['/b2b']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Área comercial para revendedores cadastrados.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Acessar produtos B2B' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continuar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Solicite seu cadastro.',
      }),
    ).toHaveProperty('tagName', 'H2');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Empresa')).toHaveAttribute('for', 'b2b-company');
    expect(screen.getByText('CNPJ')).toHaveAttribute('for', 'b2b-cnpj');
    expect(screen.getByText('Telefone / WhatsApp')).toHaveAttribute(
      'for',
      'b2b-phone',
    );
    expect(screen.getByText('E-mail')).toHaveAttribute('for', 'b2b-email');
    expect(screen.getByText('Interesse comercial')).toHaveAttribute(
      'for',
      'b2b-needs',
    );
    expect(screen.getByLabelText('Interesse comercial')).toHaveAttribute(
      'placeholder',
      'Informe produtos de interesse, volume e tipo de negócio.',
    );
    expect(
      screen.getByRole('button', { name: 'Enviar pré-cadastro' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Pré-cadastro comercial')).toBeInTheDocument();
  });

  it('closes keyboard shortcuts with Escape and restores trigger focus', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const searchTrigger = screen.getByRole('button', { name: 'Buscar' });
    fireEvent.click(searchTrigger);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver todos atalhos do teclado',
      }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Atalhos do teclado' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Fechar atalhos' }),
    ).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByRole('dialog', { name: 'Atalhos do teclado' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toHaveFocus();
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
