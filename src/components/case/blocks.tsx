import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Figure } from '@/components/case/Figure';
import { Text } from '@/components/case/Text';
import { Reveal, RevealList, RevealListItem } from '@/components/motion/Reveal';
import { SelectionBox } from '@/components/ui/SelectionBox';
import type { CaseStudy } from '@/content/caseStudies';
import type { Decision, Insight, Stat } from '@/content/caseStudies/types';
import type { Project } from '@/content/projects';
import { cn } from '@/lib/cn';
import { imageExists } from '@/lib/images';
import { isTodo } from '@/lib/todo';

/** One numbered section of the case study. */
export function CaseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex scroll-mt-28 flex-col gap-8 border-t border-line py-16 first:border-t-0 first:pt-0"
    >
      <Reveal>
        <h2 id={`${id}-heading`} className="text-h2 font-semibold">
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

/** A small bold label inside a section ("Options considered", "Why"). */
export function Label({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-body font-semibold">{children}</h3>;
}

/** Bulleted list where each item can be a TODO. */
export function Bullets({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink-muted" />
          <Text as="span">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

/** Role · Timeline · Team · Platform · Tools. */
export function MetaRow({ meta }: { meta: CaseStudy['meta'] }) {
  const rows = [
    ['Role', meta.role],
    ['Timeline', meta.timeline],
    ['Team', meta.team],
    ['Platform', meta.platform],
    ['Tools', meta.tools.join(', ')],
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 md:grid-cols-5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="text-small text-ink-muted">{label}</dt>
          <Text as="dd" className="font-medium">
            {value}
          </Text>
        </div>
      ))}
    </dl>
  );
}

/** TL;DR: problem, what I did, result. */
export function Tldr({ tldr }: { tldr: CaseStudy['tldr'] }) {
  const rows = [
    ['Problem', tldr.problem],
    ['What I did', tldr.did],
    ['Result', tldr.result],
  ] as const;

  return (
    <RevealList className="grid gap-4 md:grid-cols-3">
      {rows.map(([label, value]) => (
        <RevealListItem key={label} className="flex flex-col gap-3 rounded-tile bg-surface p-6">
          <Label>{label}</Label>
          <Text className="text-ink-muted">{value}</Text>
        </RevealListItem>
      ))}
    </RevealList>
  );
}

export function InsightCards({ insights }: { insights: Insight[] }) {
  return (
    <RevealList className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, index) => (
        <RevealListItem
          key={index}
          className="flex flex-col gap-3 rounded-tile border border-line bg-surface p-6"
        >
          <span aria-hidden="true" className="font-display text-h3 font-semibold text-highlight">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Text as="h3" className="font-display text-lead font-semibold">
            {insight.title}
          </Text>
          <Text className="text-ink-muted">{insight.body}</Text>
        </RevealListItem>
      ))}
    </RevealList>
  );
}

export function DecisionBlock({ decision, index }: { decision: Decision; index: number }) {
  return (
    <article className="grid gap-8 rounded-tile-lg border border-line bg-surface p-6 md:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className="font-display text-h3 font-semibold text-highlight">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Text as="h3" className="font-display text-h3 font-semibold">
            {decision.title}
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Options I considered</Label>
          <Bullets items={decision.options} className="text-ink-muted" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>What I chose</Label>
          <Text>{decision.choice}</Text>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Why</Label>
          <Text className="text-ink-muted">{decision.why}</Text>
        </div>
      </div>
      {decision.image && <Figure image={decision.image} />}
    </article>
  );
}

/** Big numbers. Never put these inside images. */
export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <RevealList className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <RevealListItem
          key={index}
          className={cn(
            'flex flex-col gap-2 rounded-tile bg-surface p-6',
            isTodo(stat.value) && 'outline-1 -outline-offset-1 outline-highlight/60 outline-dashed',
          )}
        >
          <p className="font-display text-display leading-none font-semibold break-words">
            {isTodo(stat.value) ? '—' : stat.value}
          </p>
          <Text className="text-small text-ink-muted">{stat.label}</Text>
        </RevealListItem>
      ))}
    </RevealList>
  );
}

/** Demo video slot. Plays inline, muted, with controls. */
export function DemoVideo({ demo }: { demo: NonNullable<CaseStudy['demo']> }) {
  const hasVideo = imageExists(demo.src);
  const poster = demo.poster && imageExists(demo.poster) ? demo.poster : undefined;

  return (
    <figure className="flex flex-col gap-3">
      {hasVideo ? (
        <video
          src={demo.src}
          poster={poster}
          controls
          muted
          playsInline
          loop
          preload="metadata"
          className="block w-full rounded-tile border border-line bg-ink-base"
        />
      ) : (
        <div
          role="img"
          aria-label="Placeholder: demo video"
          className="flex aspect-video flex-col items-center justify-center gap-2 rounded-tile border border-line bg-surface bg-grid text-center"
        >
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-full text-h3 text-cta-fg bg-cta"
          >
            ▶
          </span>
          <span className="text-small font-medium">Demo video</span>
          <code className="text-micro text-ink-muted">public{demo.src}</code>
        </div>
      )}
      <Text as="figcaption" className="text-small text-ink-muted">
        {demo.caption}
      </Text>
    </figure>
  );
}

/** Large link to the next case study. */
export function NextProject({ project }: { project: Project }) {
  return (
    <SelectionBox mode="hover" label="Next →" labelPosition="top-left">
      <Link
        to={`/work/${project.slug}`}
        className="group/next flex flex-col gap-3 rounded-tile-lg border border-line bg-surface p-8 transition-shadow duration-300 hover:shadow-lift md:p-12"
      >
        <span className="text-small text-ink-muted">Next project</span>
        <span className="flex items-end justify-between gap-6">
          <span className="font-display text-display font-semibold">{project.title}</span>
          <span
            aria-hidden="true"
            className="font-display text-h1 transition-transform duration-300 ease-out-expo group-hover/next:translate-x-2"
          >
            →
          </span>
        </span>
        <span className="max-w-prose text-ink-muted">{project.summary}</span>
      </Link>
    </SelectionBox>
  );
}
