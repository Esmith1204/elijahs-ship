/**
 * The shape of a case study. Each project gets one file in this folder
 * (grouper.ts, needle.ts, ...) that fills this in.
 *
 * Writing rules
 * - Any text that starts with "TODO" shows on the page as a dashed, labelled
 *   placeholder, so gaps are easy to spot. Replace it when you have the real thing.
 * - Never invent numbers, quotes or research. Leave the TODO instead.
 * - Write in first person ("I"), not "we", for what you did.
 * - Images live in public/images/<project>/. Until a file exists the page
 *   shows a placeholder naming the file it is waiting for.
 *
 * Title, one-line summary, tags and live link come from ../projects.ts.
 */

import type { ProjectImage } from '../projects';

/** An image with a caption. Every case study image needs one. */
export type CaseImage = ProjectImage & {
  caption: string;
};

export type Insight = {
  title: string;
  body: string;
};

export type Decision = {
  title: string;
  /** The options I weighed, one per line. */
  options: string[];
  /** What I picked. */
  choice: string;
  /** Why it won. */
  why: string;
  image?: CaseImage;
};

export type Stat = {
  /** Big number, e.g. "$11,000" or "470". */
  value: string;
  /** What it counts, e.g. "settled between friends". */
  label: string;
};

export type CaseStudy = {
  /** Must match the project's slug in ../projects.ts. */
  slug: string;

  /** Full-width mockup at the top. */
  hero: CaseImage;

  /** The meta row under the title. */
  meta: {
    role: string;
    timeline: string;
    team: string;
    platform: string;
    tools: string[];
  };

  /** Three lines: the problem, what I did, the result. */
  tldr: {
    problem: string;
    did: string;
    result: string;
  };

  /** Optional demo video (e.g. for apps behind a login). */
  demo?: {
    /** Path under /public, e.g. "/images/needle/demo.mp4". */
    src: string;
    /** Still frame shown before playing. */
    poster?: string;
    caption: string;
  };

  problem: {
    /** One or two sentences. */
    statement: string;
    /** Who it is for. */
    audience: string;
    /** Extra paragraphs, optional. */
    details?: string[];
    images?: CaseImage[];
  };

  role: {
    /** What I owned, one item per line. */
    mine: string[];
    /** What teammates owned, if anyone. */
    team?: string[];
  };

  research: {
    /** How I learned about the problem (interviews, surveys, competitive audit...). */
    methods: string[];
    /** Who I talked to, and how many. */
    participants: string;
    /** 2 to 4 key insights. */
    insights: Insight[];
    images?: CaseImage[];
  };

  /** 2 to 4 key decisions. */
  decisions: Decision[];

  /** Before / after comparison slider. Both images should be the same size. */
  beforeAfter?: {
    before: CaseImage;
    after: CaseImage;
  };

  results: {
    stats: Stat[];
    notes?: string[];
  };

  reflection: {
    learned: string[];
    next: string[];
  };
};
