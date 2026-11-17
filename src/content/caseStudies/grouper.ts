import type { CaseStudy } from './types';

/**
 * Grouper. Seeded from the old site and the resume (Nov 2026).
 * Everything marked TODO is a gap only Elijah can fill.
 */
export const grouper: CaseStudy = {
  slug: 'grouper',

  hero: {
    src: '/images/grouper/cover.webp',
    alt: 'Grouper trip planner showing a shared itinerary',
    width: 2400,
    height: 1500,
    caption: 'Grouper keeps a group’s itinerary, rides and money in one place.',
  },

  meta: {
    role: 'Product Designer',
    timeline: 'Apr 2026 → Now',
    team: '1 designer + 1 SWE',
    platform: 'Web app',
    tools: ['Figma'],
  },

  tldr: {
    problem:
      'Group trip plans get lost in the group chat: the itinerary, who is driving and who owes whom.',
    did: 'I designed Grouper, one place for itineraries, car assignments and shared debts, and prototyped it in Figma.',
    result:
      'Won the Figma Design track at LA Hacks 2026. Since then: 30 trips planned and $11,000 settled across 470 shared debts.',
  },

  problem: {
    statement:
      'Where group chat plans go to survive. When friends plan a trip, the plan lives in a group chat: the schedule, the rides and the money owed get buried under messages.',
    audience: 'Friend groups planning trips together.',
    details: [
      'TODO: what specifically broke down? A moment from a real trip (the missed ride, the debt nobody remembered) makes this land.',
    ],
  },

  role: {
    mine: [
      'Designed the user flows for real-time itinerary management and shared expense allocation.',
      'Designed the flows for settling debts between friends.',
      'Built high-fidelity, interactive Figma prototypes to stress-test edge cases and validate user pathways before engineering handoff.',
    ],
    team: ['TODO: what did the SWE own? (e.g. front end, back end, deployment)'],
  },

  research: {
    methods: [
      'TODO: how did you learn about the problem? (interviews, surveys, competitive audit)',
    ],
    participants: 'TODO: who did you talk to, and how many?',
    insights: [
      { title: 'TODO: insight 1', body: 'TODO: what you learned, and the evidence for it.' },
      { title: 'TODO: insight 2', body: 'TODO: what you learned, and the evidence for it.' },
    ],
  },

  decisions: [
    {
      title: 'TODO: decision 1 (e.g. how a shared cost gets split)',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/grouper/01.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption for this screen.',
      },
    },
    {
      title: 'TODO: decision 2 (e.g. how car assignments work)',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/grouper/02.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption for this screen.',
      },
    },
  ],

  beforeAfter: {
    before: {
      src: '/images/grouper/before.webp',
      alt: 'TODO: describe the earlier version',
      width: 2400,
      height: 1500,
      caption: 'TODO: what the earlier version got wrong.',
    },
    after: {
      src: '/images/grouper/after.webp',
      alt: 'TODO: describe the final version',
      width: 2400,
      height: 1500,
      caption: 'TODO: what changed, and why.',
    },
  },

  results: {
    stats: [
      { value: 'Winner', label: 'Figma Design track, LA Hacks 2026' },
      { value: '30', label: 'trips planned' },
      { value: '$11,000', label: 'settled between friends' },
      { value: '470', label: 'shared debts resolved' },
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: ['TODO: what you would do next.'],
  },
};
