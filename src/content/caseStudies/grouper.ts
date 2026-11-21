import type { CaseStudy } from './types';

/**
 * Grouper. Seeded from the old site and the resume (Nov 2026).
 * Everything marked TODO is a gap only Elijah can fill.
 */
export const grouper: CaseStudy = {
  slug: 'grouper',

  hero: {
    src: '/images/grouper/cover.webp',
    alt: 'Grouper’s trip dashboard on a phone beside the Grouper fish logo',
    width: 1920,
    height: 1280,
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
      'My friend and I had each built a small project for our own group trips: one tracked who owed whom, the other organized car assignments. Both helped on real trips, but they lived apart from the schedule and from each other.',
      'At LA Hacks 2026 we asked, “Why not just combine our projects together?” That became Grouper: one place for group organization, debt tracking, car assignments and itinerary planning.',
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
      'Hackathon time was tight, so I cut parts of the standard design process and leaned on quick feedback.',
      'Gathered feedback on core features from friends attending LA Hacks.',
      'Reused the feedback friends had already given on our two earlier projects.',
    ],
    participants:
      'Friends attending LA Hacks 2026, plus friends who had used our earlier debt tracking and car organization projects.',
    insights: [
      {
        title: 'Groups needed a reason to use it',
        body: 'The main pattern in the feedback was one question: what features would make this feasibly useful for groups?',
      },
      {
        title: 'People asked why they needed a planning website at all',
        body: 'Two tools were not enough to answer that. The concern pushed me to expand the scope around two ideas: group organization and itinerary planning.',
      },
    ],
  },

  decisions: [
    {
      title: 'Combine our two projects into one platform',
      options: [
        'Keep the debt tracker and the car organizer as separate tools',
        'Merge them into one centralized planning website',
      ],
      choice: 'Merged them into one planning website (and soon an app).',
      why: 'We already had a working basis for the core features, and one place for a trip was a stronger idea than two small tools, especially with only a hackathon’s worth of time.',
      image: {
        src: '/images/grouper/01.webp',
        alt: 'TODO: describe the screen',
        width: 2400,
        height: 1500,
        caption: 'TODO: caption for this screen.',
      },
    },
    {
      title: 'Make itinerary planning the main answer to “why Grouper?”',
      options: [
        'Stay focused on debt tracking and car assignments',
        'Expand around group organization and itinerary planning',
      ],
      choice:
        'Itinerary planning became the main pillar, with groups as a supplement that organizes friends or club members.',
      why: 'Itinerary planning is what made the product useful on its own, adding shared plans, locating destinations, car assignments and schedule planning.',
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
    notes: [
      'Grouper is still in development. After LA Hacks it went through a UI overhaul that gave the site its current visual identity.',
      'UX changes since: relative sizing, optimistic UI, a simplified dashboard with quick actions and trips, a smart navbar, feature tutorials and easy-to-access profile editing.',
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: [
      'Launch the mobile app.',
      'Market Grouper to students at our university.',
    ],
  },
};
