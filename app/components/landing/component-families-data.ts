export type ComponentFamily = {
  description: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

export const COMPONENT_FAMILIES: ComponentFamily[] = [
  {
    description: 'Para o seu sistema de freio, dimensões para o uso real.',
    id: 'pastilhas',
    imageAlt: 'Pastilha de freio GHENO rotors',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
    title: 'Pastilhas',
  },
  {
    description: 'Dianteiros e traseiros com opções para o seu setup.',
    id: 'cubos',
    imageAlt: 'Cubo GHENO rotors',
    imageSrc: '/reference-images/cubo-gheno.jpg',
    title: 'Cubos',
  },
  {
    description: 'Fortes o bastante para a trilha, sem promessa impossível.',
    id: 'aros',
    imageAlt: 'Aro GHENO rotors',
    imageSrc: '/reference-images/aro-gheno.jpg',
    title: 'Aros',
  },
  {
    description: 'Medida e compatibilidade para o seu sistema de freio.',
    id: 'discos',
    imageAlt: 'Disco GHENO rotors',
    imageSrc: '/reference-images/disco-gheno.jpg',
    title: 'Discos',
  },
];
