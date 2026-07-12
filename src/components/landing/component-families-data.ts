export type ComponentFamily = {
  commerce: 'store' | 'contact';
  ctaHref: string;
  ctaLabel: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

export const COMPONENT_FAMILIES: ComponentFamily[] = [
  {
    commerce: 'store',
    ctaHref: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    ctaLabel: 'Ver pastilhas',
    description:
      'Modelos para diferentes sistemas de freio, disponíveis no catálogo online.',
    imageAlt: 'Pastilha de freio GHENO',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
    title: 'Pastilhas',
  },
  {
    commerce: 'store',
    ctaHref: 'https://store.ghenortrs.com.br/cubos/',
    ctaLabel: 'Ver cubos',
    description:
      'Modelos dianteiros e traseiros, com opções Boost, HG e XD na loja online.',
    imageAlt: 'Cubo GHENO',
    imageSrc: '/reference-images/cubo-gheno.jpg',
    title: 'Cubos',
  },
  {
    commerce: 'store',
    ctaHref: 'https://store.ghenortrs.com.br/aros/',
    ctaLabel: 'Ver aros',
    description:
      'Linha HEAVYDUTY nos aros 27.5 e 29, disponível para compra online.',
    imageAlt: 'Aro GHENO',
    imageSrc: '/reference-images/aro-gheno.jpg',
    title: 'Aros',
  },
  {
    commerce: 'contact',
    ctaHref: '/contato',
    ctaLabel: 'Consultar rotores',
    description:
      'Medidas, compatibilidade e disponibilidade informadas pelo atendimento comercial.',
    imageAlt: 'Rotor GHENO',
    imageSrc: '/reference-images/rotor-gheno.jpg',
    title: 'Rotores',
  },
];
