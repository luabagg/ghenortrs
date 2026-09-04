// Encodes the WebP variants that the site serves through <picture>.
//
// The JPGs stay in the repo. They are the fallback for browsers without WebP
// and the source for Open Graph, where several scrapers still reject WebP.
//
// Run after you add or replace a JPG in public/reference-images:
//   pnpm images:webp

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_DIR = join(ROOT, 'public', 'reference-images');

/** The app reads this to build each srcSet, so the two can never drift. */
const MANIFEST_PATH = join(ROOT, 'app', 'lib', 'webp-manifest.json');

/** Widths the layouts actually request. Never upscale past the source. */
const WIDTHS = [480, 960, 1440, 1800];

/**
 * Open Graph only. No <img> renders these, and scrapers such as LinkedIn and
 * X still fail on WebP, so encoding them would waste bytes in the repo.
 */
const OG_ONLY = new Set([
  'b2b-brake-detail.jpg',
  'hero-gheno-jump.jpg',
  'trilha-controle-gheno.jpg',
]);

const QUALITY = 78;

async function isStale(source, target) {
  try {
    const [sourceStat, targetStat] = await Promise.all([
      stat(source),
      stat(target),
    ]);
    return sourceStat.mtimeMs > targetStat.mtimeMs;
  } catch {
    return true;
  }
}

async function encode(fileName) {
  const source = join(IMAGE_DIR, fileName);
  const base = fileName.replace(/\.jpg$/, '');
  const { width: sourceWidth } = await sharp(source).metadata();
  // Ladder steps the source can fill, plus the source width itself so a
  // high-density screen still gets WebP instead of falling back to the JPG.
  const widths = WIDTHS.filter((width) => width < sourceWidth);
  widths.push(sourceWidth);

  const written = [];
  for (const width of widths) {
    const target = join(IMAGE_DIR, `${base}-${width}.webp`);
    if (!(await isStale(source, target))) continue;

    const buffer = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    await writeFile(target, buffer);
    written.push(`${base}-${width}.webp ${(buffer.length / 1024).toFixed(0)}K`);
  }
  return { base, widths, written };
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const files = (await readdir(IMAGE_DIR))
    .filter((file) => file.endsWith('.jpg') && !OG_ONLY.has(file))
    .sort();

  let count = 0;
  const manifest = {};
  for (const file of files) {
    const { base, widths, written } = await encode(file);
    manifest[base] = widths;
    for (const line of written) {
      console.log(line);
      count += 1;
    }
  }

  const ordered = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((key) => [key, manifest[key]]),
  );
  await writeFile(MANIFEST_PATH, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(
    count === 0 ? 'webp variants already current' : `${count} written`,
  );
}

await main();
