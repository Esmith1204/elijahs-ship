import type { CaseStudy } from './types';

/**
 * Needle. Placeholder: the description is from the brief, the rest is TODO.
 * Needle needs a login, so this page has to carry every visual itself:
 * screenshots and the demo video matter more here than anywhere else.
 */
export const needle: CaseStudy = {
  slug: 'needle',

  hero: {
    src: '/images/needle/cover.webp',
    alt: 'Needle wordmark: a social media platform for music',
    width: 1920,
    height: 1080,
    caption: 'TODO: caption for the hero mockup.',
  },

  meta: {
    role: 'Designer & Developer',
    timeline: 'TODO: dates',
    team: 'Solo passion project',
    platform: 'Web app',
    tools: ['Figma', 'TODO: confirm the stack (React? Tailwind?)'],
  },

  tldr: {
    problem: 'TODO: the problem in one line.',
    did: 'I designed and built Needle: log albums on a 10-point scale, rank them against each other, and see what the people you follow are spinning.',
    result: 'TODO: the result in one line.',
  },

  demo: {
    src: '/images/needle/demo.mp4',
    poster: '/images/needle/demo-poster.webp',
    caption: 'TODO: what the demo shows (e.g. logging an album, then ranking it).',
  },

  problem: {
    statement: 'TODO: the problem statement.',
    audience: 'TODO: who it is for.',
  },

  role: {
    mine: ['Designed and built every part of Needle, end to end.'],
  },

  research: {
    methods: ['TODO: methods.'],
    participants: 'TODO: who you talked to.',
    insights: [
      { title: 'TODO: insight 1', body: 'TODO: what you learned.' },
      { title: 'TODO: insight 2', body: 'TODO: what you learned.' },
    ],
  },

  decisions: [
    {
      title: 'TODO: decision 1 (e.g. why a 10-point scale)',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/needle/01.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption.',
      },
    },
    {
      title: 'TODO: decision 2 (e.g. how ranking albums against each other works)',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/needle/02.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption.',
      },
    },
  ],

  beforeAfter: {
    before: {
      src: '/images/needle/before.webp',
      alt: 'TODO: describe the earlier version',
      width: 2400,
      height: 1500,
      caption: 'TODO: before.',
    },
    after: {
      src: '/images/needle/after.webp',
      alt: 'TODO: describe the final version',
      width: 2400,
      height: 1500,
      caption: 'TODO: after.',
    },
  },

  results: {
    stats: [
      { value: 'TODO', label: 'TODO: a real number (users, albums logged...)' },
      { value: 'TODO', label: 'TODO: a real number' },
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: ['TODO: what you would do next.'],
  },
};
