import { motion } from 'motion/react';
import { Link } from 'react-router';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { SmartImage } from '@/components/ui/SmartImage';
import { Tag } from '@/components/ui/Tag';
import type { Project } from '@/content/projects';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT } from '@/lib/motion';

type ProjectTileProps = {
  project: Project;
  className?: string;
};

const tones: Record<NonNullable<Project['tone']>, string> = {
  surface: 'bg-surface',
  purple: 'bg-purple-tint',
  blue: 'bg-blue-tint',
};

const transition = { duration: DURATION.base, ease: EASE_OUT };

/**
 * Bento tile for a featured project: cover, title, tags and a one-line outcome
 * (or the summary, until there is an outcome). Hover / focus: the tile lifts,
 * the cover scales to 1.03 and a Figma selection outline appears.
 */
export function ProjectTile({ project, className }: ProjectTileProps) {
  const { slug, title, role, outcome, summary, tags, cover, tone = 'surface' } = project;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: -4 } }}
      transition={transition}
      className={cn('h-full', className)}
    >
      <SelectionBox mode="hover" label={`${title} · ${role}`} className="h-full">
        <article
          className={cn(
            'relative flex h-full flex-col overflow-hidden rounded-tile border border-line shadow-tile transition-shadow duration-300 group-focus-within/selection:shadow-lift group-hover/selection:shadow-lift',
            tones[tone],
          )}
        >
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
              transition={transition}
              className="absolute inset-0"
            >
              <SmartImage
                image={cover}
                label={`${title} cover`}
                className="size-full bg-transparent"
              />
            </motion.div>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-5">
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
            <h3 className="text-h3 font-semibold">
              <Link
                to={`/work/${slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-tile focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
              >
                {title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-small text-ink-muted">{outcome || summary}</p>
          </div>
        </article>
      </SelectionBox>
    </motion.div>
  );
}
