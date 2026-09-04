import { webpSrcSet } from '~/lib/responsive-image';

/**
 * The WebP branch of a <picture>. Place it before the <img>, which stays the
 * JPG fallback. Renders nothing when the source has no WebP variants.
 */
export function WebpSource({ src, sizes }: { src: string; sizes: string }) {
  const srcSet = webpSrcSet(src);
  if (!srcSet) return null;

  return <source sizes={sizes} srcSet={srcSet} type="image/webp" />;
}
