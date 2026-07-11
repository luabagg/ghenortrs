export type ComponentFamily = {
  ctaHref: string;
  ctaLabel: string;
  description: string;
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  isLive: boolean;
  title: string;
};

export const COMPONENT_FAMILIES: ComponentFamily[] = [
  {
    ctaHref: 'https://store.ghenortrs.com.br/produtos/',
    ctaLabel: 'Ver catálogo GHENO',
    description:
      'Modelos para diferentes sistemas de freio, disponíveis no catálogo online.',
    eyebrow: 'ATIVO NO CATÁLOGO',
    imageAlt: 'Pastilha de freio GHENO',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
    isLive: true,
    title: 'Pastilhas',
  },
  {
    ctaHref: '/contato',
    ctaLabel: 'Consultar cubos',
    description:
      'Disponibilidade, padrões e aplicações informados pelo atendimento comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Cubo GHENO',
    imageSrc: '/reference-images/cubo-gheno.jpg',
    isLive: false,
    title: 'Cubos',
  },
  {
    ctaHref: '/contato',
    ctaLabel: 'Consultar aros',
    description:
      'Materiais, medidas e disponibilidade informados pelo atendimento comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Aro GHENO',
    imageSrc: '/reference-images/aro-gheno.jpg',
    isLive: false,
    title: 'Aros',
  },
  {
    ctaHref: '/contato',
    ctaLabel: 'Consultar rotores',
    description:
      'Medidas, compatibilidade e disponibilidade informadas pelo atendimento comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Rotor GHENO',
    imageSrc: '/reference-images/rotor-gheno.jpg',
    isLive: false,
    title: 'Rotores',
  },
];
