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
    href: 'https://store.ghenortrs.com.br/produtos/',
  },
  {
    label: 'Cubos',
    to: '/contato',
  },
  {
    label: 'Aros',
    to: '/contato',
  },
  {
    label: 'Rotores',
    to: '/contato',
  },
];

export const primaryNavLinks: HeaderNavLink[] = [
  {
    label: 'Tecnologia',
    to: '/#tecnologia',
  },
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
