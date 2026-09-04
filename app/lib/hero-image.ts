/**
 * The home hero image. Kept out of the hero component so `root` can preload it
 * without pulling the component into every route's bundle.
 */
export const HERO_IMAGE = {
  src: '/reference-images/mtb-action-hero.jpg',
  sizes: '100vw',
  alt: 'Rider GHENO rotors em trilha com controle total',
  width: 1800,
  height: 1201,
} as const;
