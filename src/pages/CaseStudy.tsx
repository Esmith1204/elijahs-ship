import { motion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { BeforeAfter } from '@/components/case/BeforeAfter';
import {
  Bullets,
  CaseSection,
  DecisionBlock,
  DemoVideo,
  InsightCards,
  Label,
  MetaRow,
  NextProject,
  StatCards,
  Tldr,
} from '@/components/case/blocks';
import { CaseToc } from '@/components/case/CaseToc';
import type { TocItem } from '@/components/case/CaseToc';
import { Figure } from '@/components/case/Figure';
import { Text } from '@/components/case/Text';
import { MaskedHeading, Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { getCaseStudy, getNextProject } from '@/content/caseStudies';
import type { CaseStudy as CaseStudyData } from '@/content/caseStudies';
import { getProject } from '@/content/projects';
import type { Project } from '@/content/projects';
import { site } from '@/content/site';
import { DURATION, EASE_OUT, RISE } from '@/lib/motion';
import NotFound from '@/pages/NotFound';

/** Sections in page order. Optional ones only appear when the case study has them. */
function buildToc(study: CaseStudyData): TocItem[] {
  return [
    { id: 'overview', label: 'Overview' },
    ...(study.demo ? [{ id: 'demo', label: 'Demo' }] : []),
    { id: 'problem', label: 'Problem' },
    { id: 'role', label: 'My role' },
    { id: 'research', label: 'Research' },
    { id: 'decisions', label: 'Key decisions' },
    ...(study.beforeAfter ? [{ id: 'before-after', label: 'Before → After' }] : []),
    { id: 'results', label: 'Results' },
    { id: 'reflection', label: 'Reflection' },
  ];
}

/** /work/:slug. All content comes from src/content/caseStudies. */
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const study = getCaseStudy(slug);

  if (!project?.featured || !study) return <NotFound />;
  // `key` resets scroll progress and reveals when moving to the next project.
  return <CaseStudyView key={slug} project={project} study={study} />;
}

function CaseStudyView({ project, study }: { project: Project; study: CaseStudyData }) {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useMemo(() => buildToc(study), [study]);
  const ids = useMemo(() => toc.map((item) => item.id), [toc]);
  const next = getNextProject(project.slug);

  useEffect(() => {
    document.title = `${project.title} — ${site.name}`;
    return () => {
      document.title = site.title;
    };
  }, [project.title]);

  return (
    <div className="mx-auto max-w-content px-gutter pt-nav pb-section">
      {/* Header */}
      <header className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col items-start gap-5">
          <motion.ul
            initial={{ opacity: 0, y: RISE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="flex flex-wrap gap-2"
            aria-label="Tags"
          >
            {project.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </motion.ul>
          <MaskedHeading as="h1" immediate className="text-display font-semibold">
            {project.title}
          </MaskedHeading>
          <motion.p
            initial={{ opacity: 0, y: RISE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.25 }}
            className="max-w-prose text-lead text-ink-muted"
          >
            {project.summary}
          </motion.p>
          {project.href && (
            <Button href={project.href} variant="secondary">
              {project.hrefLabel ?? 'Visit the live project'} <span aria-hidden="true">↗</span>
            </Button>
          )}
        </div>

        <Reveal>
          <Figure image={study.hero} priority />
        </Reveal>

        <Reveal>
          <MetaRow meta={study.meta} />
        </Reveal>
      </header>

      {/* Body: contents column + article */}
      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <CaseToc items={toc} ids={ids} articleRef={articleRef} />

        <article ref={articleRef} className="min-w-0">
          <CaseSection id="overview" title="TL;DR">
            <Tldr tldr={study.tldr} />
          </CaseSection>

          {study.demo && (
            <CaseSection id="demo" title="See it in action">
              <Reveal>
                <DemoVideo demo={study.demo} />
              </Reveal>
            </CaseSection>
          )}

          <CaseSection id="problem" title="The problem">
            <Reveal className="flex max-w-prose flex-col gap-4">
              <Text className="text-lead">{study.problem.statement}</Text>
              <div className="flex flex-col gap-1">
                <Label>Who it’s for</Label>
                <Text className="text-ink-muted">{study.problem.audience}</Text>
              </div>
              {study.problem.details?.map((paragraph, index) => (
                <Text key={index} className="text-ink-muted">
                  {paragraph}
                </Text>
              ))}
            </Reveal>
            {study.problem.images?.map((image) => (
              <Figure key={image.src} image={image} />
            ))}
          </CaseSection>

          <CaseSection id="role" title="My role">
            <Reveal className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Label>What I owned</Label>
                <Bullets items={study.role.mine} />
              </div>
              {study.role.team && (
                <div className="flex flex-col gap-3">
                  <Label>What my teammates owned</Label>
                  <Bullets items={study.role.team} className="text-ink-muted" />
                </div>
              )}
            </Reveal>
          </CaseSection>

          <CaseSection id="research" title="Research and insights">
            <Reveal className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Label>How I learned</Label>
                <Bullets items={study.research.methods} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Who I talked to</Label>
                <Text className="text-ink-muted">{study.research.participants}</Text>
              </div>
            </Reveal>
            <InsightCards insights={study.research.insights} />
            {study.research.images?.map((image) => (
              <Figure key={image.src} image={image} />
            ))}
          </CaseSection>

          <CaseSection id="decisions" title="Key design decisions">
            <div className="flex flex-col gap-6">
              {study.decisions.map((decision, index) => (
                <Reveal key={index}>
                  <DecisionBlock decision={decision} index={index} />
                </Reveal>
              ))}
            </div>
          </CaseSection>

          {study.beforeAfter && (
            <CaseSection id="before-after" title="Before → After">
              <Reveal>
                <BeforeAfter before={study.beforeAfter.before} after={study.beforeAfter.after} />
              </Reveal>
            </CaseSection>
          )}

          <CaseSection id="results" title="Results">
            <StatCards stats={study.results.stats} />
            {study.results.notes && (
              <Reveal className="flex max-w-prose flex-col gap-3 text-ink-muted">
                {study.results.notes.map((note, index) => (
                  <Text key={index}>{note}</Text>
                ))}
              </Reveal>
            )}
          </CaseSection>

          <CaseSection id="reflection" title="Reflection">
            <Reveal className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <Label>What I learned</Label>
                <Bullets items={study.reflection.learned} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>What I’d do next</Label>
                <Bullets items={study.reflection.next} />
              </div>
            </Reveal>
          </CaseSection>
        </article>
      </div>

      {next && (
        <Reveal className="pt-16">
          <NextProject project={next} />
        </Reveal>
      )}
    </div>
  );
}
