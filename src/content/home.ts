/**
 * ─────────────────────────────────────────────────────────────────
 *  HOMEPAGE TEXT
 *  Every word on the homepage lives in this file, in page order.
 *  Change the text between the quotes and save: the site updates.
 *
 *  Projects (bento tiles, archive cards) are in  ./projects.ts
 *  Experience list is in                          ./experience.ts
 *  Name, email and social links are in            ./site.ts
 *  A how-to for all of it is in                   ./README.md
 * ─────────────────────────────────────────────────────────────────
 */

import type { ProjectImage } from './projects';

export const home = {
  /** Links in the floating nav. `to` is a section (#id), a page (/path) or "resume". */
  nav: [
    { label: 'Projects', to: '#work' },
    { label: 'Archive', to: '#archive' },
    { label: 'About', to: '#about' },
    { label: 'Resume', to: 'resume' },
    { label: 'Contact', to: '#contact' },
  ],

  hero: {
    /**
     * One-line positioning statement. Three drafts, each under 15 words:
     * set `statement` to the one you want (or write your own).
     */
    statementOptions: [
      'A product designer who builds and ships projects with purpose.',
      'I design products in Figma, then build them in React so nothing gets lost.',
      'Product designer turning group trips, intake data and campus commutes into clear interfaces.',
    ],
    statement: 0,
    primaryCta: 'See my projects',
    secondaryCta: 'Contact me',
  },

  tools: {
    heading: 'Tools I design with',
    /** `icon` is a file in public/images/tools (PNG or SVG). Until it exists, initials are shown. */
    items: [
      { name: 'Figma', icon: '/images/tools/figma.webp' },
      { name: 'Framer', icon: '/images/tools/framer.webp' },
      { name: 'Affinity', icon: '/images/tools/affinity.webp' },
      { name: 'Illustrator', icon: '/images/tools/illustrator.webp' },
      { name: 'Procreate', icon: '/images/tools/procreate.webp' },
      { name: 'Notion', icon: '/images/tools/notion.webp' },
      { name: 'Claude Code', icon: '/images/tools/claude-code.webp' },
    ],
  },

  orgs: {
    heading: 'Where I’ve designed',
    /** `logo` is a file in public/images/logos (PNG or SVG). Until it exists, the name is shown. */
    items: [
      { name: 'Hack at UCI', logo: '/images/logos/hack-at-uci.webp' },
      { name: 'UCI ICS', logo: '/images/logos/uci-ics.webp' },
      { name: 'VenusHacks', logo: '/images/logos/venushacks.webp' },
      { name: 'FUSION ICS Project', logo: '/images/logos/fusion.webp' },
      { name: 'PreQualy', logo: '/images/logos/prequaly.webp' },
      { name: 'NMM Navigator', logo: '/images/logos/nmm-navigator.webp' },
    ],
  },

  work: {
    heading: 'Select Projects',
    intro: "Projects I've designed ",
    filterLabel: 'Filter projects',
    allLabel: 'All',
  },

  archive: {
    heading: 'The Archive',
    intro: 'Intern projects, experiments, and prototypes.',
  },

  about: {
    heading: 'Hi, I’m Elijah',
    /** One string per paragraph. DRAFT: written from the resume, rewrite freely. */
    bio: [
      'I’m a product designer studying Informatics at UC Irvine with a focus on human-computer interaction; graduating in June 2027. I design in Figma and build prototypes in Framer.',
    ],
    photo: {
      src: '/images/about/portrait.webp',
      alt: 'Elijah Smith in a black suit and tie, smiling, on a tree-lined campus walkway',
      width: 2075,
      height: 3130,
    } satisfies ProjectImage,
    experienceHeading: 'Experience',
  },

  contact: {
    headline: 'Let’s build together',
    blurb:
      'Open to product design positions and side projects. The fastest way to reach me is email!',
    copyLabel: 'Copy email',
    copiedMessage: 'Email copied to clipboard',
    copyFailedMessage: 'Couldn’t copy. The address is ',
    footnote: 'Designed by a sleep deprived product designer.',
  },
} as const;

/** The positioning statement currently selected above. */
export const heroStatement = home.hero.statementOptions[home.hero.statement];
