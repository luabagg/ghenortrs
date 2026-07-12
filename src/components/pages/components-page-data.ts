export type ComponentProductFamily = {
  commerce: 'store' | 'contact';
  id: string;
  title: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  imageAlt: string;
  imageSrc: string;
};

export const PRODUCT_FAMILIES: ComponentProductFamily[] = [
  {
    commerce: 'store',
    id: 'pastilhas',
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
    ctaHref: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    imageAlt: 'Pastilha de freio GHENO — compostos para MTB',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
  },
  {
    commerce: 'store',
    id: 'cubos',
    title: 'Cubos GHENO',
    description:
      'Modelos dianteiros e traseiros GHENO GO disponíveis na loja online.',
    highlights: [
      'Modelo dianteiro GHENO GO',
      'Modelos traseiros 12x148 e 12x157 Boost',
      'Opções para cassetes HG e XD',
      'Compra e checkout na loja GHENO',
    ],
    ctaLabel: 'Ver cubos na loja',
    ctaHref: 'https://store.ghenortrs.com.br/cubos/',
    imageAlt: 'Cubo GHENO para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    commerce: 'store',
    id: 'aros',
    title: 'Aros GHENO',
    description:
      'Aros GHENO HEAVYDUTY disponíveis nos diâmetros 27.5 e 29.',
    highlights: [
      'Alumínio 6061-T6',
      '30 mm interno e 35 mm externo',
      '32 furos e compatibilidade tubeless',
      'Compra e checkout na loja GHENO',
    ],
    ctaLabel: 'Ver aros na loja',
    ctaHref: 'https://store.ghenortrs.com.br/aros/',
    imageAlt: 'Aro GHENO — rigidez e leveza para MTB',
    imageSrc: '/reference-images/aro-gheno.jpg',
  },
  {
    commerce: 'contact',
    id: 'rotores',
    title: 'Rotores GHENO',
    description:
      'Consulte medidas, compatibilidade e disponibilidade diretamente com a equipe GHENO.',
    highlights: [
      'Medidas informadas no atendimento',
      'Compatibilidade conforme cubo e pinça',
      'Compatível com pinças Hayes Dominion A4',
      'Disponibilidade confirmada no atendimento',
    ],
    ctaLabel: 'Consultar rotores',
    ctaHref: '/contato',
    imageAlt: 'Rotor de freio a disco GHENO para MTB',
    imageSrc: '/reference-images/rotor-gheno.jpg',
  },
];
