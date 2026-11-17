import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const imagesDir = fileURLToPath(new URL('./public/images', import.meta.url));

/** Every file under public/images as a site path, e.g. "/images/grouper/cover.webp". */
function listPublicImages(dir = imagesDir): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listPublicImages(full);
    if (entry.name.startsWith('.') || entry.name.endsWith('.md')) return [];
    return ['/images/' + path.relative(imagesDir, full).split(path.sep).join('/')];
  });
}

/**
 * Exposes `virtual:public-images`: the list of images that actually exist.
 * The site uses it to show a labelled placeholder for anything not exported
 * yet, without firing requests that would 404. Dropping a file into
 * public/images reloads the page in dev.
 */
function publicImages(): Plugin {
  const id = 'virtual:public-images';
  const resolved = '\0' + id;
  return {
    name: 'public-images',
    resolveId: (source) => (source === id ? resolved : undefined),
    load: (source) =>
      source === resolved ? `export default ${JSON.stringify(listPublicImages())};` : undefined,
    configureServer(server) {
      const refresh = (file: string) => {
        if (!file.startsWith(imagesDir)) return;
        const module = server.moduleGraph.getModuleById(resolved);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), publicImages()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
