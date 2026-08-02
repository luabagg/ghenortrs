export type ComponentFamily = {
  description: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

export const COMPONENT_FAMILIES: ComponentFamily[] = [
  {
    description: 'Para o seu sistema de freio, dimensões para o uso real.',
    imageAlt: 'Pastilha de freio GHENO rotors',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
    title: 'Pastilhas',
  },
  {
    description: 'Dianteiros e traseiros com opções para o seu setup.',
    imageAlt: 'Cubo GHENO rotors',
    imageSrc: '/reference-images/cubo-gheno.jpg',
    title: 'Cubos',
  },
  {
    description: 'Fortes o bastante para a trilha, sem promessa impossível.',
    imageAlt: 'Aro GHENO rotors',
    imageSrc: '/reference-images/aro-gheno.jpg',
    title: 'Aros',
  },
  {
    description: 'Medida e compatibilidade para o seu sistema de freio.',
    imageAlt: 'Disco GHENO rotors',
    imageSrc: '/reference-images/disco-gheno.jpg',
    title: 'Discos',
  },
];
