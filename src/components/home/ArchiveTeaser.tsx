import { Link } from 'react-router';
import { Section } from '@/components/home/Section';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { ArchiveGrid } from '@/components/work/ArchiveGrid';
import { home } from '@/content/home';
import { archiveProjects } from '@/content/projects';
import type { Project } from '@/content/projects';

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
          <Link
            to={{ pathname: '/archive', hash: `#${project.slug}` }}
            className="outline-none after:absolute after:inset-0 after:rounded-tile-sm focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-micro text-ink-muted">{project.tags.join(' · ')}</p>
      </div>
    </article>
  );
}

/** Compact row of archive projects with a link through to /archive. */
export function ArchiveTeaser() {
  const { archive } = home;

  return (
    <Section
      id="archive"
      heading={archive.heading}
      intro={archive.intro}
      action={
        <Button to="/archive" variant="secondary">
          {archive.linkLabel} <span aria-hidden="true">→</span>
        </Button>
      }
    >
      <ArchiveGrid
        items={archiveProjects}
        getKey={(project) => project.slug}
        renderItem={(project) => <ArchiveCard project={project} />}
      />
    </Section>
  );
}
