export const SITE_ORIGIN = 'https://ghenortrs.vercel.app';

export const INDEX_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export type JsonLd = Record<string, unknown>;

export type SeoRoute = {
  path: '/' | '/componentes' | '/b2b' | '/sobre' | '/contato';
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  staticContent: {
    heading: string;
    links: readonly { href: string; label: string }[];
  };
  jsonLd: JsonLd;
};

const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

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
  url: `${SITE_ORIGIN}/`,
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
  path: Exclude<SeoRoute['path'], '/'>,
): JsonLd {
  return {
    '@type': 'WebPage',
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
  'Conheça a GHENO rotors e seu foco em componentes para mountain bike, frenagem, controle e uso técnico.';
const contactDescription =
  'Encontre os canais oficiais GHENO rotors para comprar no varejo, solicitar atendimento B2B ou acompanhar a marca no Instagram.';

export const SEO_ROUTES: readonly SeoRoute[] = [
  {
    path: '/',
    title: 'GHENO rotors | Componentes MTB de alto desempenho',
    description: homeDescription,
    image: absoluteUrl('/reference-images/mtb-action-hero.jpg'),
    imageAlt: 'Rider GHENO rotors em trilha de mountain bike',
    staticContent: {
      heading: 'Frenagem e controle para MTB.',
      links: [
        { href: '/componentes', label: 'Conhecer componentes' },
        {
          href: 'https://store.ghenortrs.com.br/produtos/',
          label: 'Ver catálogo GHENO rotors',
        },
        { href: '/b2b', label: 'Solicitar cadastro B2B' },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [websiteReference, organizationReference],
    },
  },
  {
    path: '/componentes',
    title: 'Componentes MTB | Pastilhas, cubos, aros e discos GHENO rotors',
    description: componentsDescription,
    image: absoluteUrl('/reference-images/disco-gheno.jpg'),
    imageAlt: 'Componentes GHENO rotors para mountain bike',
    staticContent: {
      heading: 'Pastilhas, cubos, aros e discos GHENO rotors.',
      links: [
        {
          href: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
          label: 'Pastilhas de freio',
        },
        {
          href: 'https://store.ghenortrs.com.br/cubos/',
          label: 'Cubos GHENO rotors',
        },
        {
          href: 'https://store.ghenortrs.com.br/aros/',
          label: 'Aros GHENO rotors',
        },
        { href: '/contato', label: 'Discos GHENO rotors' },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage('Componentes MTB GHENO rotors', componentsDescription, '/componentes'),
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
            ['Discos GHENO rotors', absoluteUrl('/contato')],
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
    staticContent: {
      heading: 'Cadastro comercial GHENO rotors.',
      links: [
        { href: '/contato', label: 'Ver canais de contato' },
        { href: '/componentes', label: 'Conhecer componentes' },
      ],
    },
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
    staticContent: {
      heading: 'Componentes GHENO rotors para MTB.',
      links: [
        { href: '/componentes', label: 'Conhecer componentes' },
        { href: '/contato', label: 'Falar com a GHENO rotors' },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        webpage('Sobre a GHENO rotors', aboutDescription, '/sobre'),
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
    staticContent: {
      heading: 'Canais de contato GHENO rotors.',
      links: [
        {
          href: 'https://store.ghenortrs.com.br/produtos/',
          label: 'Catálogo de varejo',
        },
        { href: '/b2b', label: 'Cadastro B2B' },
        {
          href: 'https://www.instagram.com/gheno_rtrs/',
          label: 'Instagram GHENO rotors',
        },
      ],
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteReference,
        organizationReference,
        webpage('Contato GHENO rotors', contactDescription, '/contato'),
        breadcrumbs('Contato', '/contato'),
      ],
    },
  },
] as const;

export const NOT_FOUND_SEO = {
  title: 'Página não encontrada | GHENO rotors',
  description: 'A página solicitada não foi encontrada no site da GHENO rotors.',
  robots: 'noindex, nofollow',
} as const;

export function getSeoForPath(pathname: string): SeoRoute | undefined {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return SEO_ROUTES.find((route) => route.path === normalizedPath);
}
