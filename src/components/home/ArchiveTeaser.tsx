import { Section } from '@/components/home/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { ArchiveGrid } from '@/components/work/ArchiveGrid';
import { home } from '@/content/home';
import { archiveProjects } from '@/content/projects';
import type { Project } from '@/content/projects';

/**
 * One archive card. If the project has a live link (`href` in projects.ts),
 * the whole card opens it in a new tab; otherwise the card is just a card.
 */
function ArchiveCard({ project }: { project: Project }) {
  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-tile-sm border border-line bg-surface transition-shadow duration-300 hover:shadow-lift">
      <div className="aspect-4/3 overflow-hidden">
        <SmartImage
          image={project.cover}
          label={project.title}
          compact
          className="size-full transition-transform duration-500 ease-out-expo group-hover/card:scale-103"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-display text-body font-semibold">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="outline-none after:absolute after:inset-0 after:rounded-tile-sm focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
            >
              {project.title} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="text-micro text-ink-muted">{project.tags.join(' · ')}</p>
      </div>
    </article>
  );
}

/** The archive: a compact grid of smaller projects. */
export function ArchiveTeaser() {
  const { archive } = home;

  return (
    <Section id="archive" heading={archive.heading} intro={archive.intro}>
      <ArchiveGrid
        items={archiveProjects}
        getKey={(project) => project.slug}
        renderItem={(project) => <ArchiveCard project={project} />}
      />
    </Section>
  );
}
