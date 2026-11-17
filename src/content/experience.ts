/**
 * Experience list for the About section. Sources: resume (Nov 2026) and the
 * previous Framer site. Highlights are lifted from the resume, lightly trimmed.
 */

export type Experience = {
  role: string;
  org: string;
  start: string;
  /** "Now" for current roles. */
  end: string;
  highlights?: string[];
};

export const experience: Experience[] = [
  {
    role: 'Design Director',
    org: 'Hack at UCI',
    start: 'Apr 2025',
    end: 'Now',
    highlights: [
      'Designed four hackathon websites in Figma for events that have hosted 1,000+ programmers and 30+ sponsors.',
      'Lead the graphics team and plan future events with the director’s board.',
    ],
  },
  {
    role: 'Product Designer',
    org: 'NMM Navigator',
    start: 'Feb 2026',
    end: 'Now',
    highlights: [
      'Mapped end-to-end user journeys and turned complex navigation into a step-by-step guidance tool.',
      'Built high-fidelity prototypes to test edge cases before engineering handoff.',
    ],
  },
  {
    role: 'Product Design Intern',
    org: 'PreQualy Inc.',
    // Confirmed by Elijah (Nov 2026).
    start: 'Feb 2026',
    end: 'Now',
    highlights: [
      'Designed an insights dashboard that turns client intake data into scannable metrics.',
      'Redesigned the main website and interest forms to streamline lead qualification.',
    ],
  },
  {
    role: 'Design Sub-Lead',
    org: 'FUSION ICS Project',
    start: 'Nov 2025',
    end: 'May 2026',
  },
  {
    role: 'Design Organizer',
    org: 'VenusHacks',
    start: 'Nov 2025',
    end: 'May 2026',
  },
];
