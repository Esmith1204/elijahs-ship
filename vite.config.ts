import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { featuredProjects } from './src/content/projects';
import { site } from './src/content/site';

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

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * SEO from the content files, so there is one source of truth:
 * - <title>, description, canonical, Open Graph and Twitter tags from site.ts
 * - sitemap.xml (home + every case study) and robots.txt at build time
 */
function seo(): Plugin {
  const image = `${site.url}/og-image.png`;
  const tags = [
    `<title>${escapeHtml(site.title)}</title>`,
    `<meta name="description" content="${escapeHtml(site.description)}" />`,
    `<link rel="canonical" href="${site.url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.wordmark)}" />`,
    `<meta property="og:title" content="${escapeHtml(site.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(site.description)}" />`,
    `<meta property="og:url" content="${site.url}/" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(`${site.name}, ${site.role}`)}: name in a Figma-style selection box above a wave with a tugboat" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(site.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(site.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];

  return {
    name: 'seo',
    transformIndexHtml: (html) => html.replace('<!-- seo -->', tags.join('\n    ')),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const paths = ['/', ...featuredProjects.map((project) => `/work/${project.slug}`)];
      const urls = paths
        .map((page) => `  <url><loc>${site.url}${page}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), publicImages(), seo()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
