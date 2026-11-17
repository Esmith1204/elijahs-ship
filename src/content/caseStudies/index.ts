/**
 * Every case study, by slug. To add one: copy a file in this folder (needle.ts
 * is the most bare), rename it, fill it in, and add it to the list below.
 * The project must also exist in ../projects.ts with `featured: true`.
 */

import { featuredProjects } from '../projects';
import { grouper } from './grouper';
import { kainNa } from './kainNa';
import { needle } from './needle';
import { rideshare } from './rideshare';
import type { CaseStudy } from './types';

const caseStudies: CaseStudy[] = [grouper, needle, rideshare, kainNa];

const bySlug = new Map(caseStudies.map((study) => [study.slug, study]));

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return bySlug.get(slug);
}

/** The featured project after this one (wrapping around), for the "Next project" link. */
export function getNextProject(slug: string) {
  const withStudies = featuredProjects.filter((project) => bySlug.has(project.slug));
  const index = withStudies.findIndex((project) => project.slug === slug);
  if (index === -1 || withStudies.length < 2) return undefined;
  return withStudies[(index + 1) % withStudies.length];
}

export type { CaseImage, CaseStudy } from './types';
