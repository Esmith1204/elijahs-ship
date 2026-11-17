import { Section } from '@/components/home/Section';
import { BentoGrid } from '@/components/work/BentoGrid';
import { home } from '@/content/home';
import { featuredProjects } from '@/content/projects';

/** Featured work: filter chips and the bento grid of case studies. */
export function FeaturedWork() {
  const { work } = home;

  return (
    <Section id="work" heading={work.heading} intro={work.intro}>
      <BentoGrid
        projects={featuredProjects}
        filterLabel={work.filterLabel}
        allLabel={work.allLabel}
      />
    </Section>
  );
}
