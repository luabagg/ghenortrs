import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import manifest from './webp-manifest.json';
import { largestWebp, webpSrcSet } from './responsive-image';

const IMAGE_DIR = join(process.cwd(), 'public', 'reference-images');

describe('webpSrcSet', () => {
  it('lists every generated width, smallest first', () => {
    expect(webpSrcSet('/reference-images/mtb-action-hero.jpg')).toBe(
      '/reference-images/mtb-action-hero-480.webp 480w, ' +
        '/reference-images/mtb-action-hero-960.webp 960w, ' +
        '/reference-images/mtb-action-hero-1440.webp 1440w, ' +
        '/reference-images/mtb-action-hero-1800.webp 1800w',
    );
  });

  it('returns null for a source with no variants', () => {
    expect(webpSrcSet('/reference-images/hero-gheno-jump.jpg')).toBeNull();
  });
});

describe('largestWebp', () => {
  it('names the widest variant', () => {
    expect(largestWebp('/reference-images/cubo-gheno-proof.jpg')).toBe(
      '/reference-images/cubo-gheno-proof-900.webp',
    );
  });
});

describe('webp manifest', () => {
  /** A srcSet that names a missing file makes the browser fall back silently. */
  it('names only files that exist on disk', () => {
    const present = new Set(readdirSync(IMAGE_DIR));

    for (const [base, widths] of Object.entries(manifest)) {
      for (const width of widths) {
        expect(present).toContain(`${base}-${width}.webp`);
      }
    }
  });

  it('keeps a JPG fallback for every entry', () => {
    const present = new Set(readdirSync(IMAGE_DIR));

    for (const base of Object.keys(manifest)) {
      expect(present).toContain(`${base}.jpg`);
    }
  });
});
