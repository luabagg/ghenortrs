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
      'Compra e checkout na loja GHENO rotors',
    ],
    ctaLabel: 'Ver catálogo de pastilhas',
    ctaHref: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
    imageAlt: 'Pastilha de freio GHENO rotors — compostos para MTB',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
  },
  {
    commerce: 'store',
    id: 'cubos',
    title: 'Cubos GHENO rotors',
    description:
      'Modelos dianteiros e traseiros GHENO rotors GO disponíveis na loja online.',
    highlights: [
      'Modelo dianteiro GHENO rotors GO',
      'Modelos traseiros 12x148 e 12x157 Boost',
      'Opções para cassetes HG e XD',
      'Compra e checkout na loja GHENO rotors',
    ],
    ctaLabel: 'Ver cubos na loja',
    ctaHref: 'https://store.ghenortrs.com.br/cubos/',
    imageAlt: 'Cubo GHENO rotors para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    commerce: 'store',
    id: 'aros',
    title: 'Aros GHENO rotors',
    description:
      'Aros GHENO rotors HEAVYDUTY disponíveis nos diâmetros 27.5 e 29.',
    highlights: [
      'Alumínio 6061-T6',
      '30 mm interno e 35 mm externo',
      '32 furos e compatibilidade tubeless',
      'Compra e checkout na loja GHENO rotors',
    ],
    ctaLabel: 'Ver aros na loja',
    ctaHref: 'https://store.ghenortrs.com.br/aros/',
    imageAlt: 'Aro GHENO rotors — rigidez e leveza para MTB',
    imageSrc: '/reference-images/aro-gheno.jpg',
  },
  {
    commerce: 'contact',
    id: 'discos',
    title: 'Discos GHENO rotors',
    description:
      'Discos de freio para MTB. Confira medidas, compatibilidade e disponibilidade no catálogo.',
    highlights: [
      'Medidas e modelos no catálogo',
      'Compatibilidade conforme cubo e pinça',
      'Compatível com pinças Hayes Dominion A4',
      'Disponibilidade conforme estoque atual',
    ],
    ctaLabel: 'Consultar discos',
    ctaHref: '/contato',
    imageAlt: 'Disco de freio GHENO rotors para MTB',
    imageSrc: '/reference-images/disco-gheno.jpg',
  },
];
