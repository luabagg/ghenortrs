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
      'Pastilhas Elite e Ultra para diferentes sistemas de freio, disponíveis no catálogo online.',
    highlights: [
      'Linhas Elite e Ultra',
      'Modelos para Hayes, Hope, Magura, Shimano e SRAM',
      'Compatibilidade indicada por sistema de freio',
      'Compra e checkout na loja GHENO',
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
    title: 'Cubos GHENO',
    description:
      'Consulte padrões, aplicações e disponibilidade diretamente com a equipe GHENO.',
    highlights: [
      'Padrões informados no atendimento',
      'Aplicação conforme o projeto da bike',
      'Disponibilidade confirmada pela equipe GHENO',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar cubos',
    ctaHref: '/contato',
    isLive: false,
    imageAlt: 'Cubo GHENO para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    id: 'aros',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Aros GHENO',
    description:
      'Consulte materiais, medidas, aplicações e disponibilidade com a equipe GHENO.',
    highlights: [
      'Materiais informados no atendimento',
      'Medidas conforme a aplicação',
      'Disponibilidade confirmada pela equipe GHENO',
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
    title: 'Rotores GHENO',
    description:
      'Consulte medidas, compatibilidade e disponibilidade diretamente com a equipe GHENO.',
    highlights: [
      'Medidas informadas no atendimento',
      'Compatibilidade conforme cubo e pinça',
      'Compatível com pinças Hayes Dominion A4',
      'Disponibilidade confirmada pela equipe GHENO',
    ],
    ctaLabel: 'Consultar rotores',
    ctaHref: '/contato',
    isLive: false,
    imageAlt: 'Rotor de freio a disco GHENO para MTB',
    imageSrc: '/reference-images/rotor-gheno.jpg',
  },
];
