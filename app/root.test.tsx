import { describe, expect, it } from 'vitest';

import { links } from './root';

describe('root links', () => {
  it('preloads the hero so the LCP does not wait for the hero markup', () => {
    const preload = links().find(
      (link) => 'rel' in link && link.rel === 'preload',
    );

    expect(preload).toMatchObject({
      as: 'image',
      type: 'image/webp',
      imageSizes: '100vw',
    });
  });

  /** A mismatch here makes the browser download the hero twice. */
  it('preloads exactly what the hero <picture> asks for', () => {
    const preload = links().find(
      (link) => 'rel' in link && link.rel === 'preload',
    );

    expect(preload).toMatchObject({
      imageSrcSet:
        '/reference-images/mtb-action-hero-480.webp 480w, ' +
        '/reference-images/mtb-action-hero-960.webp 960w, ' +
        '/reference-images/mtb-action-hero-1440.webp 1440w, ' +
        '/reference-images/mtb-action-hero-1800.webp 1800w',
    });
  });
});
