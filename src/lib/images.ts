import existingImages from 'virtual:public-images';

const existing = new Set(existingImages);

/** True if this file exists under public/images (checked at build time, no request). */
export function imageExists(src: string): boolean {
  return existing.has(src);
}
