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
      'Composição calibrada para resposta direta e modulação previsível. Catálogo ativo ao vivo.',
    eyebrow: 'ATIVO NO CATÁLOGO',
    imageAlt: 'Pastilha de freio GHENO',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
    isLive: true,
    title: 'Pastilhas',
  },
  {
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    ctaLabel: 'Consultar cubos',
    description:
      'Rolamento de alta performance para trilha técnica e competição. Disponível via consulta comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Cubo GHENO',
    imageSrc: '/reference-images/cubo-gheno.jpg',
    isLive: false,
    title: 'Cubos',
  },
  {
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    ctaLabel: 'Consultar aros',
    description:
      'Rigidez e leveza para rider exigente. Disponível via consulta comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Aro GHENO',
    imageSrc: '/reference-images/aro-gheno.jpg',
    isLive: false,
    title: 'Aros',
  },
  {
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    ctaLabel: 'Consultar rotores',
    description:
      'Dissipação de calor e modulação em descidas longas. Disponível via consulta comercial.',
    eyebrow: 'CONSULTA COMERCIAL',
    imageAlt: 'Rotor GHENO',
    imageSrc: '/reference-images/rotor-gheno.jpg',
    isLive: false,
    title: 'Rotores',
  },
];
