import type { CaseStudy } from './types';

/**
 * Kain Na! Placeholder. The pitch deck is a Canva link the build tools can't
 * read, so everything past the one-line summary is TODO.
 */
export const kainNa: CaseStudy = {
  slug: 'kain-na',

  hero: {
    src: '/images/kain-na/cover.webp',
    alt: 'Kain Na! cooking app showing a family recipe',
    width: 2400,
    height: 1500,
    caption: 'TODO: caption for the hero mockup.',
  },

  meta: {
    role: 'TODO: role',
    timeline: 'TODO: dates',
    team: 'TODO: team',
    platform: 'Mobile app',
    tools: ['Figma'],
  },

  tldr: {
    problem: 'TODO: the problem in one line (e.g. family recipes live in one relative’s head).',
    did: 'TODO: what you did in one line.',
    result: 'TODO: the result in one line.',
  },

  problem: {
    statement: 'TODO: the problem statement.',
    audience: 'TODO: who it is for.',
  },

  role: {
    mine: ['TODO: what you owned.'],
    team: ['TODO: what teammates owned.'],
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
      title: 'TODO: decision 1',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/kain-na/01.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption.',
      },
    },
    {
      title: 'TODO: decision 2',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/kain-na/02.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption.',
      },
    },
  ],

  results: {
    stats: [
      { value: 'TODO', label: 'TODO: a real number' },
      { value: 'TODO', label: 'TODO: a real number' },
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: ['TODO: what you would do next.'],
  },
};
