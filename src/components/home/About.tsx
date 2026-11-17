import { Section } from '@/components/home/Section';
import { Reveal, RevealList, RevealListItem } from '@/components/motion/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { experience } from '@/content/experience';
import { home } from '@/content/home';

/** About: portrait, short bio and the experience list. */
export function About() {
  const { about } = home;

  return (
    <Section id="about" heading={about.heading}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <Reveal>
          <div className="aspect-4/5 overflow-hidden rounded-tile-lg border border-line">
            <SmartImage image={about.photo} label="Portrait" className="size-full" />
          </div>
        </Reveal>

        <div className="flex flex-col gap-12">
          <Reveal className="flex max-w-prose flex-col gap-4">
            {about.bio.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'text-lead' : 'text-ink-muted'}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="flex flex-col gap-4">
            <h3 className="text-h3 font-semibold">{about.experienceHeading}</h3>
            <RevealList className="flex flex-col">
              {experience.map((job) => (
                <RevealListItem
                  key={`${job.role}-${job.org}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line py-4 last:border-b"
                >
                  <p>
                    <span className="font-display text-body font-semibold">{job.role}</span>
                    <span className="text-ink-muted">, {job.org}</span>
                  </p>
                  <p className="text-small text-ink-muted tabular-nums">
                    {job.start} → {job.end}
                  </p>
                </RevealListItem>
              ))}
            </RevealList>
          </div>
        </div>
      </div>
    </Section>
  );
}
