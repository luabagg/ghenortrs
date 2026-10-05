export const SITE_ORIGIN = 'https://www.ghenortrs.com.br';

export const INDEX_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export type JsonLd = Record<string, unknown>;

export type SeoRoute = {
  path: '/' | '/componentes' | '/b2b' | '/sobre' | '/contato';
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  jsonLd: JsonLd;
};

const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

// Each @id fragment matches a founder section id on /sobre.
const andreiGheno = {
  '@type': 'Person',
  '@id': `${absoluteUrl('/sobre')}#andrei-gheno`,
  name: 'Andrei Gheno',
  url: `${absoluteUrl('/sobre')}#andrei-gheno`,
  description:
    'Cofundador e sócio da GHENO rotors. Atleta profissional de downhill.',
  sameAs: ['https://www.instagram.com/andrei_gheno_/'],
};

const luanBaggio = {
  '@type': 'Person',
  '@id': `${absoluteUrl('/sobre')}#luan-baggio`,
  name: 'Luan Baggio',
  url: `${absoluteUrl('/sobre')}#luan-baggio`,
  description:
    'Cofundador e sócio da GHENO rotors. Responsável por projetos, tecnologia e operação.',
  sameAs: ['https://www.linkedin.com/in/luabagg/'],
};

const websiteReference = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'GHENO rotors',
  inLanguage: 'pt-BR',
  publisher: { '@id': `${SITE_ORIGIN}/#organization` },
};

const organizationReference = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'GHENO rotors',
  // The CNPJ and the Nuvemshop product brand use this name.
  alternateName: 'GHENOrtrs',
  description:
    'Marca brasileira de componentes para mountain bike: pastilhas de freio, cubos, aros e discos.',
  url: `${SITE_ORIGIN}/`,
  email: 'contato@ghenortrs.com.br',
  foundingDate: '2023',
  founder: [andreiGheno, luanBaggio],
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/brand/logo-square.jpg'),
  },
  sameAs: [
    'https://store.ghenortrs.com.br/',
    'https://www.instagram.com/gheno_rtrs/',
  ],
};

function breadcrumbs(
  name: string,
  path: Exclude<SeoRoute['path'], '/'>,
): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: `${SITE_ORIGIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: absoluteUrl(path),
      },
    ],
  };
}

function webpage(
  name: string,
  description: string,
  path: SeoRoute['path'],
  type: 'WebPage' | 'AboutPage' | 'ContactPage' = 'WebPage',
): JsonLd {
  return {
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    about: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

const homeDescription =
  'Confira pastilhas de freio, cubos, aros e discos GHENO rotors para MTB no catálogo e na loja online.';
const componentsDescription =
  'Pastilhas, cubos, aros e discos GHENO rotors no catálogo. Compra online para as linhas disponíveis na loja.';
const b2bDescription =
  'Canal GHENO rotors para lojistas, oficinas e revendas solicitarem cadastro e atendimento comercial de componentes MTB.';
const aboutDescription =
  'A GHENO rotors começou em 2023 com discos de freio para downhill. Conheça a marca e seus fundadores, Andrei Gheno e Luan Baggio.';
const contactDescription =
  'Canais oficiais GHENO rotors: loja online, cadastro B2B, e-mail para discos e mass dampers e Instagram.';

export const SEO_ROUTES: readonly SeoRoute[] = [
  {
    path: '/',
    title: 'GHENO rotors | Componentes MTB de alto desempenho',
    description: homeDescription,
    image: absoluteUrl('/reference-images/mtb-action-hero.jpg'),
    imageAlt: 'Rider GHENO rotors em trilha de mountain bike',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage('GHENO rotors', homeDescription, '/'),
      ],
    },
  },
  {
    path: '/componentes',
    title: 'Componentes MTB | Pastilhas, cubos, aros e discos GHENO rotors',
    description: componentsDescription,
    image: absoluteUrl('/reference-images/disco-gheno.jpg'),
    imageAlt: 'Componentes GHENO rotors para mountain bike',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage(
          'Componentes MTB GHENO rotors',
          componentsDescription,
          '/componentes',
        ),
        breadcrumbs('Componentes', '/componentes'),
        {
          '@type': 'ItemList',
          name: 'Famílias de componentes MTB GHENO rotors',
          numberOfItems: 4,
          itemListElement: [
            [
              'Pastilhas de freio',
              'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
            ],
            ['Cubos GHENO rotors', 'https://store.ghenortrs.com.br/cubos/'],
            ['Aros GHENO rotors', 'https://store.ghenortrs.com.br/aros/'],
            ['Discos GHENO rotors', absoluteUrl('/componentes#discos')],
          ].map(([name, url], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name,
            url,
          })),
        },
      ],
    },
  },
  {
    path: '/b2b',
    title: 'GHENO rotors B2B | Atendimento para lojistas e oficinas',
    description: b2bDescription,
    image: absoluteUrl('/reference-images/b2b-brake-detail.jpg'),
    imageAlt: 'Detalhe de freio e disco em bicicleta de mountain bike',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage('GHENO rotors B2B', b2bDescription, '/b2b'),
        breadcrumbs('B2B', '/b2b'),
      ],
    },
  },
  {
    path: '/sobre',
    title: 'Sobre a GHENO rotors | Componentes de performance para MTB',
    description: aboutDescription,
    image: absoluteUrl('/reference-images/hero-gheno-jump.jpg'),
    imageAlt: 'Rider com componentes GHENO rotors em salto de competição',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        webpage(
          'Sobre a GHENO rotors',
          aboutDescription,
          '/sobre',
          'AboutPage',
        ),
        breadcrumbs('Sobre a GHENO rotors', '/sobre'),
        organizationReference,
      ],
    },
  },
  {
    path: '/contato',
    title: 'Contato GHENO rotors | Varejo, revendas e oficinas',
    description: contactDescription,
    image: absoluteUrl('/reference-images/trilha-controle-gheno.jpg'),
    imageAlt: 'Rider GHENO rotors em trecho técnico de mountain bike',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage(
          'Contato GHENO rotors',
          contactDescription,
          '/contato',
          'ContactPage',
        ),
        breadcrumbs('Contato', '/contato'),
      ],
    },
  },
] as const;

export const NOT_FOUND_SEO = {
  title: 'Página não encontrada | GHENO rotors',
  description:
    'A página solicitada não foi encontrada no site da GHENO rotors.',
  robots: 'noindex, nofollow',
} as const;

export function getSeoForPath(pathname: string): SeoRoute | undefined {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return SEO_ROUTES.find((route) => route.path === normalizedPath);
}
