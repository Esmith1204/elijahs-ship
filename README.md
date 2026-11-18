# Elijah's Ship

Portfolio of Elijah Smith, product designer. Vite + React + TypeScript, Tailwind CSS v4, GSAP (hero wave) and Motion (UI animation).

## Commands

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Local site with hot reload at http://localhost:5173  |
| `npm run build`   | Typecheck and build the production site into `dist/` |
| `npm run preview` | Serve the production build locally                   |
| `npm run images`  | Compress every PNG/JPG in `public/images` to WebP    |
| `npm run lint`    | ESLint                                               |
| `npm run format`  | Prettier                                             |

## Editing

- **All text and project data:** `src/content/`. Its README explains every file.
- **Images:** `public/images/`. Its README lists every slot and size.
- **Colors, type and spacing tokens:** `src/styles/index.css`.

Dev-only pages (not in the production build): `/styleguide` (every token and component), `/lab/wave` (tune the hero wave) and `/lab/share` (the share image).

## Deploying on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. `vercel.json` already sets the build (Vite, `npm run build`, output `dist`), the rewrite that makes deep links like `/work/grouper` work, and caching headers.
3. Under **Settings → Domains**, add `elijahsship.com` and follow Vercel's DNS instructions (this replaces the Framer site).

The page title, description, share-image tags, `sitemap.xml` and `robots.txt` are generated at build time from `src/content/site.ts` and `src/content/projects.ts`.
