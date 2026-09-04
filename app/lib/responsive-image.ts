import manifest from '~/lib/webp-manifest.json';

const WEBP_WIDTHS: Record<string, number[] | undefined> = manifest;

const IMAGE_DIR = '/reference-images';

/**
 * Builds the WebP srcSet for a JPG under {@link IMAGE_DIR}. The widths come
 * from `scripts/build-webp.mjs`, so a srcSet can never name a missing file.
 * Returns null for a source with no WebP variants, such as an OG-only image.
 */
export function webpSrcSet(jpgSrc: string): string | null {
  const base = jpgSrc.slice(jpgSrc.lastIndexOf('/') + 1).replace(/\.jpg$/, '');
  const widths = WEBP_WIDTHS[base];
  if (!widths || widths.length === 0) return null;

  return widths
    .map((width) => `${IMAGE_DIR}/${base}-${width}.webp ${width}w`)
    .join(', ');
}

/** The largest WebP variant, for a preload that must name one file. */
export function largestWebp(jpgSrc: string): string | null {
  const base = jpgSrc.slice(jpgSrc.lastIndexOf('/') + 1).replace(/\.jpg$/, '');
  const widths = WEBP_WIDTHS[base];
  if (!widths || widths.length === 0) return null;

  return `${IMAGE_DIR}/${base}-${widths[widths.length - 1]}.webp`;
}
