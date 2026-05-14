export type ComponentProductFamily = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  isLive: boolean;
  imageAlt: string;
  imageSrc: string;
};

export const PRODUCT_FAMILIES: ComponentProductFamily[] = [
  {
    id: 'pastilhas',
    eyebrow: 'ATIVO NO CATÁLOGO',
    title: 'Pastilhas de freio',
    description:
      'Composição calibrada para resposta direta e modulação previsível em qualquer condição de terreno. Disponíveis em quatro compostos para DH, enduro, XC e trilha livre.',
    highlights: [
      'Quatro compostos para cada tipo de uso',
      'Compatível com Shimano, SRAM e TRP',
      'Resistência a +300°C em descidas encadeadas',
      'Modulação sem fade em calor extremo',
    ],
    ctaLabel: 'Ver catálogo de pastilhas',
    ctaHref: 'https://store.ghenortrs.com.br/produtos/',
    isLive: true,
    imageAlt: 'Pastilha de freio GHENO — compostos para MTB',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
  },
  {
    id: 'cubos',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Cubos de alta rolagem',
    description:
      'Rolamento de alta performance desenvolvido para trilha técnica e competição. Disponível via consulta comercial direta com a equipe GHENO.',
    highlights: [
      'Projeto para performance em trilha técnica',
      'Construção para carga e uso intenso',
      'Compatibilidade com principais padrões de cubo',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar cubos',
    ctaHref: '/contato',
    isLive: false,
    imageAlt: 'Cubo GHENO — alta rolagem para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    id: 'aros',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Aros de carbono e alumínio',
    description:
      'Rigidez e leveza projetadas para rider exigente. Construídos para aguentar a demanda de trilhas técnicas e competição sem abrir mão da performance de rolagem.',
    highlights: [
      'Opções em carbono e alumínio de alta rigidez',
      'Perfil interno calibrado para pneus MTB',
      'Testado em trilhas técnicas e competição',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar aros',
    ctaHref: '/contato',
    isLive: false,
    imageAlt: 'Aro GHENO — rigidez e leveza para MTB',
    imageSrc: '/reference-images/aro-gheno.jpg',
  },
  {
    id: 'rotores',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Rotores de dissipação',
    description:
      'Dissipação de calor e modulação em descidas longas. Liga de aço de alta resistência com geometria projetada para refrigeração eficiente durante frenagens repetidas.',
    highlights: [
      'Liga de aço de alta resistência térmica',
      'Geometria para dissipação eficiente de calor',
      'Compatível com pinças Hayes Dominion A4',
      'Validado em competição downhill e enduro',
    ],
    ctaLabel: 'Consultar rotores',
    ctaHref: '/contato',
    isLive: false,
    imageAlt: 'Rotor GHENO — disco de alta performance para MTB',
    imageSrc: '/reference-images/rotor-gheno.jpg',
  },
];
