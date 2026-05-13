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
    href: 'https://store.ghenortrs.com.br/contato/',
  },
  {
    label: 'Aros',
    href: 'https://store.ghenortrs.com.br/contato/',
  },
  {
    label: 'Rotores',
    href: 'https://store.ghenortrs.com.br/contato/',
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
    href: 'https://store.ghenortrs.com.br/',
  },
  {
    label: 'Contato',
    href: 'https://store.ghenortrs.com.br/contato/',
  },
];
