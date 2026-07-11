export const SITE_ORIGIN = 'https://ghenortrs.vercel.app';

export const INDEX_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export type JsonLd = Record<string, unknown>;

export type SeoRoute = {
  path: '/' | '/componentes' | '/b2b' | '/sobre' | '/contato';
  title: string;
  description: string;
  image: string;
  jsonLd: JsonLd;
};

const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

const websiteReference = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'GHENO',
  inLanguage: 'pt-BR',
};

const organizationReference = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'GHENO',
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
  'Pastilhas de freio GHENO para MTB no catálogo online. Consulte cubos, aros e rotores com a equipe comercial.';
const componentsDescription =
  'Conheça as famílias de componentes MTB GHENO: pastilhas de freio, cubos, aros e rotores, com catálogo público ou consulta comercial.';
const b2bDescription =
  'Canal GHENO para lojistas, oficinas e revendas solicitarem cadastro e atendimento comercial de componentes MTB.';
const aboutDescription =
  'Conheça a GHENO e seu foco em componentes para mountain bike, frenagem, controle e uso técnico.';
const contactDescription =
  'Encontre os canais oficiais GHENO para comprar no varejo, solicitar atendimento B2B ou acompanhar a marca no Instagram.';

export const SEO_ROUTES: readonly SeoRoute[] = [
  {
    path: '/',
    title: 'GHENO | Componentes MTB de alto desempenho',
    description: homeDescription,
    image: absoluteUrl('/reference-images/mtb-action-hero.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [websiteReference, organizationReference],
    },
  },
  {
    path: '/componentes',
    title: 'Componentes MTB | Pastilhas, cubos, aros e rotores GHENO',
    description: componentsDescription,
    image: absoluteUrl('/reference-images/rotor-gheno.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        webpage('Componentes MTB GHENO', componentsDescription, '/componentes'),
        breadcrumbs('Componentes', '/componentes'),
        {
          '@type': 'ItemList',
          name: 'Famílias de componentes MTB GHENO',
          numberOfItems: 4,
          itemListElement: [
            ['Pastilhas de freio', 'pastilhas'],
            ['Cubos GHENO', 'cubos'],
            ['Aros GHENO', 'aros'],
            ['Rotores GHENO', 'rotores'],
          ].map(([name, fragment], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name,
            url: `${absoluteUrl('/componentes')}#${fragment}`,
          })),
        },
      ],
    },
  },
  {
    path: '/b2b',
    title: 'GHENO B2B | Atendimento para lojistas e oficinas',
    description: b2bDescription,
    image: absoluteUrl('/reference-images/b2b-brake-detail.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        webpage('GHENO B2B', b2bDescription, '/b2b'),
        breadcrumbs('B2B', '/b2b'),
      ],
    },
  },
  {
    path: '/sobre',
    title: 'Sobre a GHENO | Componentes de performance para MTB',
    description: aboutDescription,
    image: absoluteUrl('/reference-images/hero-gheno-jump.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        webpage('Sobre a GHENO', aboutDescription, '/sobre'),
        breadcrumbs('Sobre a GHENO', '/sobre'),
        organizationReference,
      ],
    },
  },
  {
    path: '/contato',
    title: 'Contato GHENO | Varejo, revendas e oficinas',
    description: contactDescription,
    image: absoluteUrl('/reference-images/trilha-controle-gheno.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        webpage('Contato GHENO', contactDescription, '/contato'),
        breadcrumbs('Contato', '/contato'),
      ],
    },
  },
] as const;

export const NOT_FOUND_SEO = {
  title: 'Página não encontrada | GHENO',
  description: 'A página solicitada não foi encontrada no site da GHENO.',
  robots: 'noindex, nofollow',
} as const;

export function getSeoForPath(pathname: string): SeoRoute | undefined {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return SEO_ROUTES.find((route) => route.path === normalizedPath);
}
