// npm run images
//
// Converts every PNG / JPG in public/images to a resized WebP next to it,
// then moves the original into image-sources/ (same sub-folders), which is
// kept in the repo for re-exports but never deployed. Safe to run again:
// files that are already WebP are left alone.
//
// After running, point the path in src/content at the .webp file.

import { mkdir, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const imagesDir = path.join(root, 'public', 'images');
const sourcesDir = path.join(root, 'image-sources');

/** Longest edge, in px, per folder. Roughly 2x the largest size each is shown at. */
const MAX_EDGE = {
  tools: 256,
  logos: 720,
  archive: 1600,
  about: 1400,
  default: 2400,
};
const QUALITY = 82;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let converted = 0;
let savedBytes = 0;

for await (const file of walk(imagesDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;

  const relative = path.relative(imagesDir, file);
  const folder = relative.split(path.sep)[0];
  const maxEdge = MAX_EDGE[folder] ?? MAX_EDGE.default;
  const output = file.replace(/\.(png|jpe?g)$/i, '.webp');

  await sharp(file)
    .rotate() // respect camera orientation
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 90, effort: 5 })
    .toFile(output);

  const before = (await stat(file)).size;
  const after = (await stat(output)).size;
  savedBytes += before - after;
  converted += 1;

  const archived = path.join(sourcesDir, relative);
  await mkdir(path.dirname(archived), { recursive: true });
  await rename(file, archived);

  console.log(
    `${relative.padEnd(42)} ${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB`,
  );
}

console.log(
  converted
    ? `\n${converted} image(s) converted, ${(savedBytes / 1024 / 1024).toFixed(1)} MB saved. Originals are in image-sources/.`
    : 'Nothing to convert: every image in public/images is already WebP.',
);
