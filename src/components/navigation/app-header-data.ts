export type HeaderMenuLink =
  | {
      href: string;
      label: string;
      to?: never;
    }
  | {
      href?: never;
      label: string;
      to: string;
    };

export type HeaderNavLink =
  | {
      href?: never;
      label: string;
      to: string;
    }
  | {
      href: string;
      label: string;
      to?: never;
    };

export const componentMenuLinks: HeaderMenuLink[] = [
  {
    label: 'Ver todos os componentes',
    to: '/componentes',
  },
  {
    label: 'Pastilhas',
    href: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
  },
  {
    label: 'Cubos',
    href: 'https://store.ghenortrs.com.br/cubos/',
  },
  {
    label: 'Aros',
    href: 'https://store.ghenortrs.com.br/aros/',
  },
  {
    label: 'Rotores',
    to: '/contato',
  },
];

export const primaryNavLinks: HeaderNavLink[] = [
  {
    label: 'B2B',
    to: '/b2b',
  },
  {
    label: 'Sobre a GHENO',
    to: '/sobre',
  },
  {
    label: 'Contato',
    to: '/contato',
  },
];
