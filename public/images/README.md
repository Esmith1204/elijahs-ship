# Images

Drop exported images here. Until a file exists, the site shows a labelled placeholder in its place.

## The easy way

1. Export at about 2x the size it shows at, as PNG or JPG. Any name is fine.
2. Put it in the right folder below.
3. Run `npm run images`. Every PNG/JPG here becomes a compressed, resized `.webp`, and the original moves to `image-sources/` (kept in the repo, never deployed).
4. Point the path in `src/content/` at the `.webp` file.

You can also skip step 3 and reference a PNG/JPG directly; it just loads slower.

## Where things go

| Folder       | File                                                       | Used for                                  | Export size     |
| ------------ | ---------------------------------------------------------- | ----------------------------------------- | --------------- |
| `grouper/`   | `cover.webp`                                               | Bento tile + case study hero              | 2400 x 1500     |
| `needle/`    | `cover.webp`                                               | Bento tile + case study hero              | 2400 x 1500     |
| `kain-na/`   | `cover.webp`                                               | Bento tile + case study hero              | 2400 x 1500     |
| `rideshare/` | `cover.webp`                                               | Bento tile + case study hero              | 2400 x 1500     |
| `<project>/` | `01.webp`, `02.webp`, ...                                  | Case study screenshots, in page order     | 2400 wide       |
| `<project>/` | `before.webp`, `after.webp`                                | Before / After slider (same size each)    | 2400 wide       |
| `needle/`    | `demo.mp4`, `demo-poster.webp`                             | Demo video and its still frame            | 1600 wide       |
| `archive/`   | `prequaly.webp`, `rokkage-31.webp`, ...                    | Archive cards (top of image is shown)     | 1600 wide       |
| `about/`     | `portrait.webp`                                            | About photo                               | 1400 tall       |
| `logos/`     | `hack-at-uci.webp`, `uci-ics.webp`, ...                    | "Where I've designed", white on transparent | 720 wide      |
| `tools/`     | `figma.webp`, `framer.webp`, ...                           | "Tools I design with" icons               | 256 x 256       |

Bento covers are cropped to fit their tile, so keep the important part near the middle.

Paths are set in `src/content/projects.ts` (covers, archive), `src/content/home.ts` (tools, logos, portrait) and `src/content/caseStudies/` (case study images).

## Share image

`public/og-image.png` is the preview shown when the site is linked on LinkedIn, iMessage, Slack, etc. To regenerate it after a design change: run `npm run dev`, open `/lab/share`, and screenshot it at exactly 1200 x 630.
