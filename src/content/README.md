# Editing the site's content

Every word on the site lives in this folder (`src/content/`). You never need to open a component to change text.

| I want to change...                                                      | Edit this file              |
| ------------------------------------------------------------------------ | --------------------------- |
| Nav links, hero line, buttons, section headings, about bio, contact text | `home.ts`                   |
| Tools and "Where I've designed" names and icons                          | `home.ts` (`tools`, `orgs`) |
| Projects: bento tiles, archive cards, tags, links                        | `projects.ts`               |
| Experience list                                                          | `experience.ts`             |
| Name, email, social links, resume, page title, theme                     | `site.ts`                   |
| A case study                                                             | `caseStudies/<project>.ts`  |
| The 404 page                                                             | `pages.ts`                  |

Save the file and the dev server updates the page. Text goes between quotes. If the text itself contains an apostrophe, use the curly one (`’`) or wrap the text in double quotes.

## Homepage text

Open `home.ts`. It is laid out in page order: nav, hero, tools, orgs, projects, archive, about, contact.

The hero line has drafts in `statementOptions`. Set `statement` to the number of the one you want (starting at `0`), or replace the text.

To add a tool or org, add it to `tools.items` or `orgs.items` and drop its image in `public/images/tools/` or `public/images/logos/`. Its spot in the floating cluster is set in `src/components/home/toolsLayout.ts` (position, tilt and size, as percentages). Anything without a spot there gets placed below the cluster.

## Add a project

Open `projects.ts`, copy this block into the `projects` list and fill it in:

```ts
{
  slug: 'my-project',            // used in the URL, lowercase with dashes
  title: 'My Project',
  summary: 'One line: what it is.',
  outcome: 'One line: what came of it.', // '' to show the summary instead
  role: 'Product Designer',
  team: '2 designers + 1 SWE',   // optional
  timeline: 'Jan 2026 → Mar 2026', // optional
  context: 'Class, hackathon or client', // optional
  categories: ['product'],       // any of: 'product', 'development', 'branding'
  tags: ['Product Design', 'Mobile App'],
  cover: {
    src: '/images/archive/my-project.webp', // file in public/images
    alt: 'Describe the image for someone who cannot see it',
    width: 1600,
    height: 1200,
  },
  featured: false,               // false = archive card, true = bento tile + case study
  href: 'https://example.com',   // optional live link
  hrefLabel: 'View the pitch deck', // optional button text for that link
},
```

- `featured: false` puts it in the archive grid. If it has an `href`, the card opens that link.
- `featured: true` puts it in the Selected Projects bento and gives it a case study page at `/work/your-slug` (see below). Also set `size` (`'large'` or `'medium'`) and `tone` (`'surface'`, `'purple'` or `'blue'`). Ordering large, medium, medium, large gives the staggered bento.
- Archive cards resize to fit: up to six per row, then a new row. The filter chips and counts update on their own.

## Write a case study

Each featured project has a file in `caseStudies/`: `grouper.ts`, `needle.ts`, `rideshare.ts`, `kainNa.ts`. Every section of the page is a field in that file, in page order:

| Field          | Section on the page                                        |
| -------------- | ---------------------------------------------------------- |
| `hero`, `meta` | Big mockup, then Role · Timeline · Team · Platform · Tools |
| `tldr`         | TL;DR: problem, what I did, result                         |
| `demo`         | Optional demo video (Needle has one)                       |
| `problem`      | The problem and who it is for                              |
| `role`         | What I owned, what teammates owned                         |
| `research`     | Methods, who I talked to, 2 to 4 insight cards             |
| `decisions`    | 2 to 4 decisions: options, choice, why, and a screenshot   |
| `beforeAfter`  | Optional comparison slider (two images, same size)         |
| `results`      | Big-number stat cards                                      |
| `reflection`   | What I learned, what I'd do next                           |

The title, summary, tags and live link come from `projects.ts`, so you only write them once.

Any text that starts with `TODO` shows on the page as a dashed box with a TODO label. Replace it with the real thing and the box disappears. Search the folder for `TODO` to find every gap.

To add a new case study: add the project to `projects.ts` with `featured: true`, copy `needle.ts` to a new file, change its `slug` to match, fill it in, then add it to the list in `caseStudies/index.ts`.

## Add images

Drop the file into `public/images/` at the path you wrote in `src`. Until the file exists the site shows a placeholder naming the file it is waiting for. See `public/images/README.md` for sizes and names. Bento covers are cropped to fit their tile, so keep the important part of the image near the middle.

## Rules of thumb

- Never invent numbers, quotes or outcomes. Leave `TODO: ...` in the text until you have the real thing.
- Keep `outcome` and `summary` to one line each. Long text belongs in the case study.
