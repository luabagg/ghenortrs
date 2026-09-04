import { fireEvent, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import * as b2bSession from '~/b2b/use-b2b-session';
import { renderApp } from '~/test/render-app';

describe('App', () => {
  it('renders the home route inside the shared shell', () => {
    renderApp('/');

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
    expect(
      screen.queryByText('GHENO rotors COMPONENTES'),
    ).not.toBeInTheDocument();
    expect(screen.getAllByAltText('GHENO rotors')[0]).toHaveAttribute(
      'src',
      '/brand/logo-wide.png',
    );
    const heroImage = screen.getByAltText(
      'Rider GHENO rotors em trilha com controle total',
    );
    expect(heroImage).toHaveAttribute(
      'src',
      '/reference-images/mtb-action-hero.jpg',
    );
    expect(heroImage).toHaveAttribute('fetchpriority', 'high');
    expect(heroImage).toHaveAttribute('loading', 'eager');
    expect(heroImage).toHaveAttribute('width', '1800');
    expect(heroImage).toHaveAttribute('height', '1201');
    const heroWebpSource = heroImage
      .closest('picture')
      ?.querySelector('source[type="image/webp"]');
    expect(heroWebpSource).toHaveAttribute(
      'srcset',
      '/reference-images/mtb-action-hero-480.webp 480w, /reference-images/mtb-action-hero-960.webp 960w, /reference-images/mtb-action-hero-1440.webp 1440w, /reference-images/mtb-action-hero-1800.webp 1800w',
    );
    expect(heroWebpSource).toHaveAttribute('sizes', '100vw');
    expect(heroImage).not.toHaveAttribute('data-motion-image');
    expect(heroImage).toHaveClass(
      'motion-safe:animate-[gheno-hero-settle_1.4s_cubic-bezier(0.16,1,0.3,1)_both]',
    );
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
    expect(screen.getByRole('link', { name: 'Componentes' })).toHaveAttribute(
      'href',
      '/componentes',
    );
    expect(
      screen.getByRole('navigation', { name: 'Principal' }).parentElement,
    ).not.toHaveAttribute('data-slot', 'glass-panel');
    expect(
      screen.getAllByRole('link', { name: 'Confira a loja online' })[0],
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/');
    expect(
      screen.getAllByRole('link', { name: 'Confira a loja online' })[0],
    ).toHaveClass('border-accent', 'bg-transparent');
    expect(
      screen.getAllByRole('link', { name: 'Ver componentes' })[0],
    ).toHaveClass('border-primary/55', 'bg-transparent');
    expect(screen.getByText('Compre online')).toBeInTheDocument();
    expect(
      screen.getByText('Compra segura e totalmente online'),
    ).toBeInTheDocument();
    expect(screen.getByText('Encontre o modelo')).toBeInTheDocument();
    expect(screen.getByText('Consulte a equipe')).toBeInTheDocument();
    expect(screen.getByText('Revenda B2B')).toBeInTheDocument();
    expect(screen.getByLabelText('Destaques operacionais')).not.toHaveAttribute(
      'data-slot',
      'glass-panel',
    );
  });

  it('keeps stable desktop header columns and omits Tecnologia navigation', () => {
    renderApp('/');

    expect(screen.getByTestId('desktop-header-layout')).toHaveClass(
      'sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
    );
    expect(screen.queryByRole('link', { name: 'Tecnologia' })).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Início GHENO rotors' }),
    ).toHaveAttribute('href', '/');
  });

  it('shows current online inventory without legacy status badges', () => {
    renderApp('/');

    expect(screen.queryByText('ATIVO NO CATÁLOGO')).toBeNull();
    expect(screen.queryByText('CONSULTA COMERCIAL')).toBeNull();
    expect(
      screen.getByRole('heading', { name: 'Pastilhas' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cubos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aros' })).toBeInTheDocument();
  });

  it('renders the component families section linking cards to componentes', () => {
    renderApp('/');

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
    expect(screen.getByRole('heading', { name: 'Discos' })).toBeInTheDocument();
    expect(
      screen.getByAltText('Pastilha de freio GHENO rotors'),
    ).toHaveAttribute('src', '/reference-images/pastilhas-gheno.jpg');
    expect(screen.getByAltText('Cubo GHENO rotors')).toHaveAttribute(
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
    const section = within(familySection as HTMLElement);

    expect(
      section.getByRole('link', { name: 'Ver todos os componentes' }),
    ).toHaveAttribute('href', '/componentes');
    expect(section.getByRole('link', { name: /Pastilhas/ })).toHaveAttribute(
      'href',
      '/componentes#pastilhas',
    );
    expect(section.getByRole('link', { name: /Cubos/ })).toHaveAttribute(
      'href',
      '/componentes#cubos',
    );
    expect(section.getByRole('link', { name: /Aros/ })).toHaveAttribute(
      'href',
      '/componentes#aros',
    );
    expect(section.getByRole('link', { name: /Discos/ })).toHaveAttribute(
      'href',
      '/componentes#discos',
    );
  });

  it('renders the product proof section with copy, bullets, and images', () => {
    renderApp('/');

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

    expect(
      screen.getByLabelText('Imagens de produto e uso GHENO rotors'),
    ).toHaveClass('snap-x', 'overflow-x-auto');
    expect(
      screen.getByAltText('Rider em prova de MTB diante do público'),
    ).toHaveAttribute('src', '/reference-images/b2b-race-context.jpg');
    expect(
      screen.getByAltText('Cubo GHENO rotors em uso na bike'),
    ).toHaveAttribute('src', '/reference-images/cubo-gheno-proof.jpg');
    expect(
      screen.getByAltText('Rider em curva de trilha com terreno solto'),
    ).toHaveAttribute('src', '/reference-images/b2b-trail-validation.jpg');

    expect(
      screen.queryByRole('link', { name: 'Explorar componentes' }),
    ).toBeNull();
  });

  it('renders the B2B teaser section with correct CTAs', () => {
    renderApp('/');

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
    expect(within(b2bTeaser as HTMLElement).queryByRole('img')).toBeNull();
    expect(
      screen.queryByLabelText(
        'Contexto visual para atendimento B2B GHENO rotors',
      ),
    ).toBeNull();
  });

  it('renders the closing CTA section with correct destinations', () => {
    renderApp('/');

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
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/');
    expect(
      within(closing as HTMLElement).queryByRole('link', {
        name: 'Ver componentes',
      }),
    ).toBeNull();
  });

  it('renders the footer with verified store links', () => {
    renderApp('/');

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    expect(
      within(footer).getByRole('link', { name: 'Ver loja online' }),
    ).toHaveAttribute('href', 'https://store.ghenortrs.com.br/');
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
    expect(
      screen.getByRole('link', { name: 'E-mail GHENO rotors' }),
    ).toHaveAttribute('href', 'mailto:contato@ghenortrs.com.br');
    expect(
      within(footer).getByRole('link', { name: 'Sobre a GHENO rotors' }),
    ).toHaveAttribute('href', '/sobre');
    expect(
      within(
        within(footer).getByRole('navigation', {
          name: 'Links institucionais',
        }),
      ).getByRole('link', { name: 'Contato' }),
    ).toHaveAttribute('href', '/contato');
  });

  it('renders the components route with product families', () => {
    renderApp('/componentes');

    expect(screen.queryByText('COMPONENTES')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Compra e checkout na loja/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Componentes GHENO rotors para frenagem e controle.',
      }),
    ).toBeInTheDocument();
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
      screen.getByText(
        /Discos 203 e 223 mm para potência, controle térmico e uso extremo em MTB\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Maior potência de frenagem/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Padrão 6 furos em aço inoxidável/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Visual 2D/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver catálogo de pastilhas' }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    );
    expect(
      screen.getByRole('link', { name: 'Solicitar cadastro B2B' }),
    ).toHaveAttribute('href', '/b2b');
    expect(
      screen
        .getByRole('heading', { name: 'Pastilhas de freio' })
        .closest('article'),
    ).toHaveAttribute('id', 'pastilhas');
    expect(
      screen
        .getByRole('heading', { name: 'Discos GHENO rotors' })
        .closest('article'),
    ).toHaveAttribute('id', 'discos');
    expect(document.querySelector('[data-threejs-slot="discos"]')).toBeTruthy();
  });

  it('renders institutional context on the about route', () => {
    renderApp('/sobre');

    expect(
      screen.getByRole('heading', {
        name: 'Componentes GHENO rotors para MTB.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A GHENO rotors atua com componentes para mountain bike, com foco em frenagem, controle e uso técnico.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'O que entregamos' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Linha de pastilhas, cubos, aros e discos para mountain bike.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the B2B route with registration form when auth is not configured', () => {
    renderApp('/b2b');

    expect(
      screen.getByRole('heading', {
        name: 'Cadastro comercial GHENO rotors.',
      }),
    ).toBeInTheDocument();
    // Without public Supabase env the login gate stays off and registration remains.
    expect(
      screen.queryByRole('button', { name: 'Já tenho cadastro' }),
    ).toBeNull();
    expect(screen.queryByText('Acessar produtos B2B')).toBeNull();
    expect(
      screen.queryByRole('heading', { name: 'Solicitar cadastro.' }),
    ).toBeNull();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByText(
        'Lojistas, oficinas e revendas, solicitem atendimento comercial e acesso ao catálogo B2B.',
      ),
    ).toBeInTheDocument();
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
      screen.getByRole('button', { name: 'Enviar cadastro' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: 'Cadastro comercial' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/B2B em configuração/i)).toBeNull();
    expect(screen.queryByText(/docs\/integrations/i)).toBeNull();
    expect(
      screen.getByRole('link', { name: 'contato@ghenortrs.com.br' }),
    ).toHaveAttribute('href', 'mailto:contato@ghenortrs.com.br');
  });

  it('shows an approved seller nothing on the access page', () => {
    const sessionSpy = vi.spyOn(b2bSession, 'useB2BSession').mockReturnValue({
      configured: true,
      error: null,
      gate: 'approved',
      refresh: vi.fn(async () => undefined),
      session: {
        authenticated: true,
        email: 'luan@example.com',
        gate: 'approved',
        seller: {
          id: 'seller-1',
          email: 'luan@example.com',
          companyName: 'Luan Baggio',
          status: 'approved',
          cnpj: '12345678000195',
          phone: '11999999999',
        },
      },
      signOut: vi.fn(async () => undefined),
    });

    try {
      renderApp('/b2b');

      // The page renders nothing for an approved seller; it redirects instead.
      // b2b-page.test.tsx asserts the target, which this harness cannot follow.
      expect(
        screen.queryByRole('link', { name: 'Abrir catálogo B2B' }),
      ).toBeNull();
      expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
      expect(screen.getByRole('main')).toHaveTextContent('');
    } finally {
      sessionSpy.mockRestore();
    }
  });

  it('renders the gated B2B catalog route without crashing when logged out', () => {
    renderApp('/b2b/catalogo');

    expect(
      screen.getByRole('heading', { name: 'Catálogo comercial' }),
    ).toBeInTheDocument();
  });

  it('closes keyboard shortcuts with Escape and restores trigger focus', () => {
    renderApp('/');

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
    renderApp('/');

    fireEvent.click(
      screen.getByRole('button', { name: 'Buscar na GHENO rotors' }),
    );
    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }),
      {
        target: { value: 'cubo boost xd' },
      },
    );

    expect(
      screen.getByRole('link', {
        name: /Cubo Traseiro GO 12x148 Boost XD/i,
      }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/cubo-traseiro-go-12x148-boost-xd-para-mtb-gheno-rotors/',
    );
  });

  it('provides working catalog search in the mobile menu', () => {
    renderApp('/');

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar na GHENO rotors' }),
      {
        target: { value: 'aro 29' },
      },
    );

    expect(
      screen.getByRole('link', {
        name: /Aro HEAVYDUTY Para Mtb GHENO Rotors/i,
      }),
    ).toHaveAttribute(
      'href',
      'https://store.ghenortrs.com.br/produtos/aro-heavyduty-para-mtb-gheno-rotors/',
    );
  });

  it('shows inline validation errors when B2B form is submitted empty', () => {
    renderApp('/b2b');

    fireEvent.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

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
    renderApp('/b2b');

    fireEvent.change(screen.getByLabelText('CNPJ'), {
      target: { value: '12.345.678/0001-9' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(screen.getByText('CNPJ deve ter 14 dígitos.')).toBeInTheDocument();
  });

  it('renders the not found route', () => {
    renderApp('/nao-existe');

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
