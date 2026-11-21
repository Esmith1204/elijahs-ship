import type { CaseStudy } from './types';

/**
 * Rideshare. Seeded from the resume and the project site
 * (rideshare.framer.website: Understand, Design, Evaluate). The site doesn't
 * say who on the team did what, so ownership stays TODO. Write those parts in
 * first person ("I") once you fill them in.
 */
export const rideshare: CaseStudy = {
  slug: 'rideshare',

  hero: {
    src: '/images/rideshare/cover.webp',
    alt: 'Rideshare. logo beside two phones showing upcoming group trips and a trip itinerary',
    width: 1440,
    height: 834,
    caption: 'Rideshare. pairs group hangouts with shared rides.',
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
      'Students without a car get stuck on campus: transit is slow and pricey, and ride-hailing is too expensive unless the cost is split.',
    did: 'I designed a mobile-first carpooling app that pairs social ridesharing with safety features.',
    result:
      'Usability testing with six students set the next priorities: verified sign-up, gender-preference rides and fewer navigation dead ends.',
  },

  problem: {
    statement:
      'Ride-hailing keeps evolving, but commuting students still struggle to find each other and affordable rides. Students without their own way to get around tend to stay on campus.',
    audience:
      'College students without a car: commuters who live off campus, residents who are stuck on campus for anything far, and upperclassmen who lean on Uber.',
    details: [
      'Transportation can be a student’s second or third largest expense after tuition and housing. In the research the project cites, over a quarter of students report missing class because of transportation.',
    ],
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
    methods: [
      'Competitive analysis of five platforms: Uber, Lyft, inDrive, BlaBlaCar and Nomadtable.',
      'One-on-one interviews, with “5 Whys” follow-ups on pricing, safety and unreliable transit.',
    ],
    participants:
      'Five students: commuters without cars, on-campus residents and upperclassmen who get around without a car.',
    insights: [
      {
        title: 'Safety is the main barrier to trust',
        body: 'For riders and drivers alike. Every app studied has SOS features, but none lets students set a gender preference, which one interviewee asked for.',
      },
      {
        title: 'Uber and Lyft cost too much, even split',
        body: 'Tips and fees make the total unpredictable, so budgeting is hard. Students wanted to know the full price up front.',
      },
      {
        title: 'Rides decide plans',
        body: 'Students often go to an event only if they can get a ride, so their schedules depend on other people’s, especially off campus without a car.',
      },
      {
        title: 'Meeting students online is hard',
        body: 'No app studied pairs ride-hailing with meeting people. One interviewee used Discord for classes, clubs and roommates but hadn’t made friends through it.',
      },
    ],
  },

  decisions: [
    {
      title: 'Rides start as posts on the home page',
      options: [
        'TODO: the other option(s) you weighed (e.g. a search-first ride request flow)',
        'Posts on the home page with a title, time, location and description',
      ],
      choice:
        'Ride posts live on the home page, where people can comment. Drivers set a price within a range based on distance, or take the suggested price.',
      why: 'Putting posts up front makes rides easy to find and surfaces interesting places to go. The price range keeps drivers from overcharging, and a character limit keeps posts short.',
      image: {
        src: '/images/rideshare/01.webp',
        alt: 'TODO: describe the screen',
        width: 1920,
        height: 1080,
        caption: 'TODO: caption (e.g. the user flow and wireframes for creating a post).',
      },
    },
    {
      title: 'Every hangout gets its own group chat',
      options: ['TODO: the other option(s) you weighed', 'A built-in group chat per hangout'],
      choice:
        'Each hangout has a group chat with its title and a live member count at the top, and a menu to see members, rename, post a notice, search, mute, pin, share or leave.',
      why: 'TODO: why a chat per hangout beat the alternatives.',
      image: {
        src: '/images/rideshare/02.webp',
        alt: 'TODO: describe the screen',
        width: 1920,
        height: 1080,
        caption: 'TODO: caption.',
      },
    },
    {
      title: 'Share live trip progress in one tap',
      options: ['TODO: the other option(s) you weighed', 'A live trip view with one-tap sharing'],
      choice:
        'Upcoming events show the host, spots left, the time window and an itinerary of stops. During the trip, a live view shows the current stop and arrival times, and one tap shares it.',
      why: 'Seeing the host and who’s going builds trust, the itinerary shows exactly what you’re joining, and sharing your trip adds comfort when you’re somewhere new.',
      image: {
        src: '/images/rideshare/03.webp',
        alt: 'TODO: describe the screen',
        width: 1920,
        height: 1080,
        caption: 'TODO: caption (e.g. the storyboard and the live trip screen).',
      },
    },
  ],

  beforeAfter: {
    before: {
      src: '/images/rideshare/before.webp',
      alt: 'TODO: describe the first draft of the profile screen',
      width: 1920,
      height: 1080,
      caption: 'TODO: before (e.g. the first profile draft, with the photo asked for at sign-up).',
    },
    after: {
      src: '/images/rideshare/after.webp',
      alt: 'TODO: describe the current profile screen',
      width: 1920,
      height: 1080,
      caption:
        'TODO: after (e.g. the photo moved to profile editing, details grouped into dropdowns).',
    },
  },

  results: {
    stats: [
      { value: '6', label: 'students in think-aloud usability tests' },
      { value: '5', label: 'students interviewed one-on-one' },
    ],
    notes: [
      'A heuristic evaluation against Nielsen’s heuristics flagged fixes such as checkmarks on completed fields, clearly marked required fields, an easier switch between Driver and Rider, and an info icon explaining suggested prices.',
      'Testers’ biggest concerns were safety (no identity check at sign-up, no gender-preference rides), navigation dead ends and choppy profile transitions.',
      'TODO: which of these you changed, and what happened when you did.',
    ],
  },

  reflection: {
    learned: ['TODO: what you learned.'],
    next: ['TODO: what you would do next.'],
  },
};
