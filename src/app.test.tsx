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
    expect(
      screen.getByRole('link', { name: 'Pular para o conteúdo' }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.queryByText('GHENO rotors COMPONENTES')).not.toBeInTheDocument();
    expect(screen.getAllByAltText('GHENO rotors')[0]).toHaveAttribute(
      'src',
      '/brand/logo-wide.png',
    );
    expect(
      screen.getByAltText('Rider GHENO rotors em trilha com controle total'),
    ).toHaveAttribute('src', '/reference-images/mtb-action-hero.jpg');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Frenagem e controle para/,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Downhill|Enduro|E-bike/,
    );
    expect(
      screen.getByText(
        /Não prometemos o impossível\. Entregamos força de sobra/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Componentes' }),
    ).toHaveAttribute('href', '/componentes');
    expect(
      screen.getByRole('navigation', { name: 'Principal' }).parentElement,
    ).not.toHaveAttribute('data-slot', 'glass-panel');
    expect(
      screen.getAllByRole('link', { name: 'Confira a loja online' })[0],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      screen.getAllByRole('link', { name: 'Confira a loja online' })[0],
    ).toHaveClass('border-accent', 'bg-transparent');
    expect(
      screen.getAllByRole('link', { name: 'Ver componentes' })[0],
    ).toHaveClass('border-primary/55', 'bg-transparent');
    expect(screen.getByText('Compre online')).toBeInTheDocument();
    expect(screen.getByText('Compra segura e totalmente online')).toBeInTheDocument();
    expect(screen.getByText('Encontre o modelo')).toBeInTheDocument();
    expect(screen.getByText('Consulte a equipe')).toBeInTheDocument();
    expect(screen.getByText('Revenda B2B')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Destaques operacionais'),
    ).not.toHaveAttribute('data-slot', 'glass-panel');
  });

  it('keeps stable desktop header columns and omits Tecnologia navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('desktop-header-layout')).toHaveClass(
      'sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
    );
    expect(screen.queryByRole('link', { name: 'Tecnologia' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Início GHENO rotors' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows current online inventory without legacy status badges', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByText('ATIVO NO CATÁLOGO')).toBeNull();
    expect(screen.queryByText('CONSULTA COMERCIAL')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Pastilhas' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cubos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aros' })).toBeInTheDocument();
  });

  it('renders the component families section linking cards to componentes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Peças para a sua bike.',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Pastilhas' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cubos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aros' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Discos' }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Pastilha de freio GHENO rotors')).toHaveAttribute(
      'src',
      '/reference-images/pastilhas-gheno.jpg',
    );
    expect(screen.getAllByAltText('Cubo GHENO rotors')[0]).toHaveAttribute(
      'src',
      '/reference-images/cubo-gheno.jpg',
    );
    expect(screen.getByAltText('Aro GHENO rotors')).toHaveAttribute(
      'src',
      '/reference-images/aro-gheno.jpg',
    );
    expect(screen.getByAltText('Disco GHENO rotors')).toHaveAttribute(
      'src',
      '/reference-images/disco-gheno.jpg',
    );

    const familySection = screen
      .getByRole('heading', { name: 'Peças para a sua bike.' })
      .closest('section');
    expect(familySection).toBeTruthy();
    const familyLinks = within(familySection as HTMLElement).getAllByRole(
      'link',
    );
    expect(
      familyLinks.every((link) => link.getAttribute('href') === '/componentes'),
    ).toBe(true);
  });

  it('renders the product proof section with copy, bullets, and images', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Tecnologia que aguenta prova e trilha.',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Projetamos as peças para manter o controle sob uso severo, em prova e na trilha.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Encaixe e acabamento feitos para o conjunto real da bike',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Resposta consistente em descidas longas e terreno irregular',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Testados em competição e no uso técnico de MTB'),
    ).toBeInTheDocument();

    expect(screen.queryByText('ATRITO')).toBeNull();
    expect(screen.queryByText('CALOR')).toBeNull();
    expect(
      screen.queryByRole('heading', {
        name: 'Componentes GHENO rotors em contexto de competição.',
      }),
    ).toBeNull();

    expect(screen.getByLabelText('Imagens de produto e uso GHENO rotors')).toHaveClass(
      'snap-x',
      'overflow-x-auto',
    );
    expect(
      screen.getByAltText('Rider em prova de MTB diante do público'),
    ).toHaveAttribute('src', '/reference-images/b2b-race-context.jpg');
    expect(screen.getAllByAltText('Cubo GHENO rotors')[0]).toHaveAttribute(
      'src',
      '/reference-images/cubo-gheno.jpg',
    );
    expect(
      screen.getByAltText('Rider em curva de trilha com terreno solto'),
    ).toHaveAttribute('src', '/reference-images/b2b-trail-validation.jpg');

    expect(
      screen.queryByRole('link', { name: 'Explorar componentes' }),
    ).toBeNull();
  });

  it('renders the B2B teaser section with correct CTAs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const b2bTeaser = document.querySelector('[data-section="b2b-teaser"]');
    expect(b2bTeaser).toBeTruthy();
    expect(
      within(b2bTeaser as HTMLElement).getByRole('heading', {
        name: 'Atendimento comercial para oficinas e revendas.',
      }),
    ).toBeInTheDocument();
    expect(
      within(b2bTeaser as HTMLElement).getByRole('link', {
        name: 'Solicitar cadastro B2B',
      }),
    ).toHaveAttribute('href', '/b2b');
    expect(
      within(b2bTeaser as HTMLElement).getByRole('link', {
        name: 'Solicitar cadastro B2B',
      }),
    ).toHaveClass('border-accent', 'bg-transparent');
    expect(
      within(b2bTeaser as HTMLElement).getByText(
        /Peças que o rider pede de novo\. Cadastre sua loja e compre direto com a GHENO rotors\./,
      ),
    ).toBeInTheDocument();
    expect(
      within(b2bTeaser as HTMLElement).queryByRole('img'),
    ).toBeNull();
    expect(
      screen.queryByLabelText('Contexto visual para atendimento B2B GHENO rotors'),
    ).toBeNull();
  });

  it('renders the closing CTA section with correct destinations', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const closing = document.querySelector('[data-section="closing-cta"]');
    expect(closing).toBeTruthy();
    expect(
      within(closing as HTMLElement).getByRole('heading', {
        name: 'Acesse nossa loja online.',
      }),
    ).toBeInTheDocument();
    expect(
      within(closing as HTMLElement).getByText(
        /Confira pastilhas, cubos, aros e discos no nosso catálogo\./,
      ),
    ).toBeInTheDocument();
    expect(
      within(closing as HTMLElement).getByRole('link', {
        name: 'Ver loja online',
      }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/produtos/');
    expect(
      within(closing as HTMLElement).queryByRole('link', {
        name: 'Ver componentes',
      }),
    ).toBeNull();
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
      within(footer).getByRole('link', { name: 'Pastilhas' }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    );
    expect(
      screen.getByRole('navigation', { name: 'Links institucionais' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacidade' })).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/politica-de-privacidade/',
    );
    expect(
      screen.getByRole('link', { name: 'Instagram GHENO rotors' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/gheno_rtrs/');
    expect(screen.getByRole('link', { name: 'E-mail GHENO rotors' })).toHaveAttribute(
      'href',
      'mailto:contato@ghenortrs.com.br',
    );
    expect(
      within(footer).getByRole('link', { name: 'Sobre a GHENO rotors' }),
    ).toHaveAttribute('href', '/sobre');
    expect(
      within(
        within(footer).getByRole('navigation', { name: 'Links institucionais' }),
      ).getByRole('link', { name: 'Contato' }),
    ).toHaveAttribute('href', '/contato');
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
      screen.getByRole('heading', { name: 'Cubos GHENO rotors' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Aros GHENO rotors' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Discos GHENO rotors' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver catálogo de pastilhas' }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    );
    expect(
      screen.getByRole('link', { name: 'Pré-cadastro comercial' }),
    ).toHaveAttribute('href', '/b2b');
    expect(
      screen
        .getByRole('heading', { name: 'Pastilhas de freio' })
        .closest('article'),
    ).toHaveAttribute('id', 'pastilhas');
    expect(
      screen.getByRole('heading', { name: 'Discos GHENO rotors' }).closest('article'),
    ).toHaveAttribute('id', 'discos');
  });

  it('renders institutional context on the about route', () => {
    render(
      <MemoryRouter initialEntries={['/sobre']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Componentes GHENO rotors para MTB.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A GHENO rotors atua com componentes para mountain bike, com foco em frenagem, controle e uso técnico.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Componentes de MTB com foco técnico.'),
    ).toBeInTheDocument();
  });

  it('renders the B2B route with registration form when auth is not configured', () => {
    render(
      <MemoryRouter initialEntries={['/b2b']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Cadastro comercial GHENO rotors.',
      }),
    ).toBeInTheDocument();
    // Without VITE_SUPABASE_* the login gate stays off and registration remains.
    expect(screen.queryByRole('button', { name: 'Já tenho cadastro' })).toBeNull();
    expect(screen.queryByText('Acessar produtos B2B')).toBeNull();
    expect(
      screen.getByRole('heading', {
        name: 'Dados da empresa.',
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
    expect(screen.getByText(/B2B em configuração/i)).toBeInTheDocument();
  });

  it('renders the gated B2B catalog route without crashing when logged out', () => {
    render(
      <MemoryRouter initialEntries={['/b2b/catalogo']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Catálogo comercial' }),
    ).toBeInTheDocument();
  });

  it('closes keyboard shortcuts with Escape and restores trigger focus', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const searchTrigger = screen.getByRole('button', {
      name: 'Buscar na GHENO rotors',
    });
    fireEvent.click(searchTrigger);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver atalhos do teclado',
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
    expect(
      screen.getByRole('button', { name: 'Buscar na GHENO rotors' }),
    ).toHaveFocus();
  });

  it('searches the Nuvemshop catalog from the desktop command panel', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Buscar na GHENO rotors' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'cubo boost xd' },
    });

    expect(
      screen.getByRole('link', {
        name: /Cubo Traseiro GHENO GO 12x148 Boost XD/i,
      }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/cubo-traseiro-gheno-go-12x148-boost-xd/',
    );
  });

  it('provides working catalog search in the mobile menu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }), {
      target: { value: 'aro 29' },
    });

    expect(
      screen.getByRole('link', { name: /Aro GHENO HEAVYDUTY 29/i }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/aro-gheno-heavyduty-29/',
    );
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
    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: 'Ver componentes MTB' }),
    ).toHaveAttribute('href', '/componentes');
  });
});
