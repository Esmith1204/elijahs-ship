import type { CaseStudy } from './types';

/**
 * Rideshare. Placeholder: the summary and role come from the resume
 * (Advanced Topics in HCI, Jan–Mar 2026); the rest is TODO.
 */
export const rideshare: CaseStudy = {
  slug: 'rideshare',

  hero: {
    src: '/images/rideshare/cover.webp',
    alt: 'Rideshare. app showing transportation options for students',
    width: 2400,
    height: 1500,
    caption: 'TODO: caption for the hero mockup.',
  },

  meta: {
    role: 'Product Designer',
    timeline: 'Jan 2026 → Mar 2026',
    team: 'TODO: team',
    platform: 'Mobile app',
    tools: ['Figma'],
  },

  tldr: {
    problem:
      'Students living on campus need ways to get around that are affordable and sustainable.',
    did: 'I designed a mobile-first carpooling interface that pairs social ridesharing with safety protocols.',
    result: 'TODO: the result in one line.',
  },

  problem: {
    statement:
      'TODO: the problem statement (e.g. what getting off campus costs a student today, in money and in time).',
    audience: 'Students who live on campus.',
  },

  role: {
    mine: [
      'Conceptualized and designed a mobile-first carpooling interface aimed at cutting student transit costs and environmental impact.',
      'Applied human-computer interaction principles to combine social interaction with safety protocols.',
      'Iterated on user flows to make the app more accessible and reliable.',
    ],
    team: ['TODO: who else was on the project, and what they owned.'],
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
      title: 'TODO: decision 1 (e.g. how riders verify who they are riding with)',
      options: ['TODO: option A', 'TODO: option B'],
      choice: 'TODO: what you picked.',
      why: 'TODO: why it won.',
      image: {
        src: '/images/rideshare/01.webp',
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
        src: '/images/rideshare/02.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption.',
      },
    },
  ],

  beforeAfter: {
    before: {
      src: '/images/rideshare/before.webp',
      alt: 'TODO: describe the earlier version',
      width: 2400,
      height: 1500,
      caption: 'TODO: before.',
    },
    after: {
      src: '/images/rideshare/after.webp',
      alt: 'TODO: describe the final version',
      width: 2400,
      height: 1500,
      caption: 'TODO: after.',
    },
  },

  results: {
    stats: [
      { value: 'TODO', label: 'TODO: a real number (usability test results, task time...)' },
      { value: 'TODO', label: 'TODO: a real number' },
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: ['TODO: what you would do next.'],
  },
};
