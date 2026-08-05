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

export const primaryNavLinks: HeaderNavLink[] = [
  {
    label: 'Componentes',
    to: '/componentes',
  },
  {
    label: 'B2B',
    to: '/b2b',
  },
  {
    label: 'Sobre a GHENO rotors',
    to: '/sobre',
  },
  {
    label: 'Contato',
    to: '/contato',
  },
];
