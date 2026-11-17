# Editing the site's content

All text and project data lives in this folder. You never need to open a component to change words.

| I want to...                                     | Edit this file             |
| ------------------------------------------------ | -------------------------- |
| Change any text on the homepage                  | `home.ts`                  |
| Add, remove or edit a project (bento or archive) | `projects.ts`              |
| Update the experience list                       | `experience.ts`            |
| Change my name, email, social links or resume    | `site.ts`                  |
| Switch the whole site between blue and light     | `site.ts` (`theme`)        |
| Write or edit a case study                       | `caseStudies/<project>.ts` |

Save the file and the dev server updates the page. Text goes between quotes. If the text itself contains an apostrophe, use the curly one (`’`) or wrap the text in double quotes.

## Change homepage text

Open `home.ts`. It is laid out in page order: nav, hero, tools, orgs, work, archive, about, contact. Change the words, keep the punctuation around them.

The hero line has three drafts in `statementOptions`. Set `statement` to `0`, `1` or `2` to pick one, or replace the text.

## Add a project

Open `projects.ts`, copy this block into the `projects` list and fill it in:

```ts
{
  slug: 'my-project',            // used in the URL, lowercase with dashes
  title: 'My Project',
  summary: 'One line: what it is.',
  outcome: 'One line: what came of it.',
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
  featured: false,               // false = archive, true = homepage bento + case study
  details: {                     // optional, shown on the archive page
    year: '2026',
    description: [
      'First paragraph.',
      'Second paragraph.',
    ],
    tools: ['Figma', 'React'],
    links: [{ label: 'Live site', href: 'https://example.com' }],
  },
},
```

- `featured: false` puts it in the archive. That is all an archive project needs.
- `featured: true` puts it in the homepage bento and gives it a case study page at `/work/your-slug`. Also set `size` (`'large'` or `'medium'`) and `tone` (`'surface'`, `'purple'` or `'blue'`).
- The filter chips and their counts update on their own.

## Write a case study

Each featured project has a file in `caseStudies/`: `grouper.ts`, `needle.ts`, `rideshare.ts`, `kainNa.ts`. Every section of the case study page is a field in that file, in page order:

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

Drop the file into `public/images/` at the path you wrote in `src`. Until the file exists the site shows a placeholder naming the file it is waiting for. See `public/images/README.md` for sizes and names.

## Rules of thumb

- Never invent numbers, quotes or outcomes. Leave `TODO: ...` in the text until you have the real thing: it is easy to search for.
- Keep `outcome` and `summary` to one line each. Long text belongs in `details.description` or the case study.
