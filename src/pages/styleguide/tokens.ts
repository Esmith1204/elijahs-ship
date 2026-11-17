/**
 * Descriptions for the styleguide. Values are NOT repeated here: the page
 * reads them live from src/styles/index.css so the two can't drift apart.
 */

export type ColorToken = {
  token: string;
  use: string;
  group: 'core' | 'extension';
};

export const colorTokens: ColorToken[] = [
  { token: '--bg', use: 'Page background', group: 'core' },
  { token: '--surface', use: 'Cards, bento tiles', group: 'core' },
  { token: '--ink', use: 'Primary text, wave strokes', group: 'core' },
  { token: '--ink-muted', use: 'Secondary text', group: 'core' },
  { token: '--line', use: 'Borders, grid lines', group: 'core' },
  { token: '--purple', use: 'Accent 1 (from Needle)', group: 'core' },
  { token: '--blue', use: 'Accent 2 (from Needle)', group: 'core' },
  { token: '--gradient', use: 'Highlights, CTA, selected chips', group: 'core' },
  { token: '--figma-blue', use: 'Selection outlines and handles only', group: 'core' },
  { token: '--line-strong', use: 'Control borders that need to read', group: 'extension' },
  { token: '--purple-tint', use: 'Tinted bento tile, purple tag', group: 'extension' },
  { token: '--blue-tint', use: 'Tinted bento tile, blue tag', group: 'extension' },
  { token: '--figma-blue-deep', use: 'Selection label fill (white text)', group: 'extension' },
  { token: '--on-accent', use: 'Text on purple, blue, gradient', group: 'extension' },
];

export type ContrastPair = {
  fg: string;
  bg: string;
  use: string;
  /** 4.5 for text, 3 for large text and non-text UI. */
  min: 4.5 | 3;
  /** Decorative pairs are reported but exempt from WCAG. */
  decorative?: boolean;
};

export const contrastPairs: ContrastPair[] = [
  { fg: '--ink', bg: '--bg', use: 'Body text on the page', min: 4.5 },
  { fg: '--ink', bg: '--surface', use: 'Body text on tiles', min: 4.5 },
  { fg: '--ink-muted', bg: '--bg', use: 'Secondary text on the page', min: 4.5 },
  { fg: '--ink-muted', bg: '--surface', use: 'Secondary text on tiles', min: 4.5 },
  { fg: '--ink-muted', bg: '--purple-tint', use: 'Secondary text on purple tile', min: 4.5 },
  { fg: '--ink-muted', bg: '--blue-tint', use: 'Secondary text on blue tile', min: 4.5 },
  { fg: '--purple', bg: '--bg', use: 'Purple links and highlights', min: 4.5 },
  { fg: '--purple', bg: '--purple-tint', use: 'Purple tag', min: 4.5 },
  { fg: '--blue', bg: '--bg', use: 'Blue links, focus ring', min: 4.5 },
  { fg: '--blue', bg: '--blue-tint', use: 'Blue tag', min: 4.5 },
  { fg: '--on-accent', bg: '--purple', use: 'CTA text (gradient start)', min: 4.5 },
  { fg: '--on-accent', bg: '--blue', use: 'CTA text (gradient end)', min: 4.5 },
  { fg: '--on-accent', bg: '--figma-blue-deep', use: 'Selection label text', min: 4.5 },
  {
    fg: '--line-strong',
    bg: '--surface',
    use: 'Chip and button borders',
    min: 3,
    decorative: true,
  },
  { fg: '--figma-blue', bg: '--bg', use: 'Selection outline', min: 3, decorative: true },
];

export type TypeStep = {
  name: string;
  /** Full class string so Tailwind can see it. */
  className: string;
  sample: string;
  use: string;
};

export const typeSteps: TypeStep[] = [
  {
    name: 'hero',
    className: 'font-display text-hero font-semibold',
    sample: 'Elijah Smith',
    use: 'Hero name only',
  },
  {
    name: 'display',
    className: 'font-display text-display font-semibold',
    sample: "Let's build something",
    use: 'Footer headline, case study titles',
  },
  {
    name: 'h1',
    className: 'font-display text-h1 font-semibold',
    sample: 'Featured work',
    use: 'Page titles',
  },
  {
    name: 'h2',
    className: 'font-display text-h2 font-semibold',
    sample: 'Key design decisions',
    use: 'Section headings',
  },
  {
    name: 'h3',
    className: 'font-display text-h3 font-semibold',
    sample: 'Grouper',
    use: 'Tile and card titles',
  },
  {
    name: 'lead',
    className: 'text-lead',
    sample: 'Product designer who builds what he designs.',
    use: 'Intro paragraphs, positioning line',
  },
  {
    name: 'body',
    className: 'text-body',
    sample:
      'A group trip planner for itineraries, car assignments and debt tracking. Body copy runs at a comfortable 1.6 line height.',
    use: 'Paragraphs',
  },
  {
    name: 'small',
    className: 'text-small',
    sample: 'Won the Figma Design track at LA Hacks 2026.',
    use: 'Captions, outcomes, nav',
  },
  {
    name: 'label',
    className: 'text-label font-medium uppercase',
    sample: 'Role · Timeline · Team',
    use: 'Meta labels (Role, Timeline)',
  },
  {
    name: 'micro',
    className: 'text-micro font-medium',
    sample: '642 × 148',
    use: 'Tags, selection labels, counts',
  },
];

export const displayWeights = [
  { weight: 200, className: 'font-extralight' },
  { weight: 300, className: 'font-light' },
  { weight: 400, className: 'font-normal' },
  { weight: 500, className: 'font-medium' },
  { weight: 600, className: 'font-semibold' },
  { weight: 700, className: 'font-bold' },
] as const;

export const radii = [
  { token: '--radius-tile-sm', className: 'rounded-tile-sm', use: 'Small cards' },
  { token: '--radius-tile', className: 'rounded-tile', use: 'Bento tiles' },
  { token: '--radius-tile-lg', className: 'rounded-tile-lg', use: 'Large tiles, hero media' },
  { token: '--radius-pill', className: 'rounded-pill', use: 'Chips, buttons, tags' },
] as const;

/** 8px base. Class names are Tailwind steps (1 step = 4px). */
export const spacing = [
  { px: 8, className: 'w-2' },
  { px: 16, className: 'w-4' },
  { px: 24, className: 'w-6' },
  { px: 32, className: 'w-8' },
  { px: 48, className: 'w-12' },
  { px: 64, className: 'w-16' },
  { px: 96, className: 'w-24' },
  { px: 128, className: 'w-32' },
] as const;

export const sections = [
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Type' },
  { id: 'shape', label: 'Shape + space' },
  { id: 'components', label: 'Components' },
  { id: 'motifs', label: 'Motifs' },
  { id: 'motion', label: 'Motion' },
] as const;
