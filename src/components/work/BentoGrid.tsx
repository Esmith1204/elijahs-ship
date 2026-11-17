import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { FilterChips } from '@/components/ui/FilterChips';
import type { FilterOption } from '@/components/ui/FilterChips';
import { ProjectTile } from '@/components/work/ProjectTile';
import { categoryLabels } from '@/content/projects';
import type { Project, ProjectCategory } from '@/content/projects';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT } from '@/lib/motion';

type Filter = 'all' | ProjectCategory;

type BentoGridProps = {
  projects: Project[];
  /** Accessible name for the chip group. */
  filterLabel: string;
  allLabel: string;
};

/**
 * Filter chips with counts above a bento grid of project tiles.
 *
 * Layout (desktop): three columns; a `large` tile spans two, a `medium` tile
 * one. Ordering large, medium, medium, large in projects.ts gives the
 * staggered two-row bento. Rows are sized from the viewport height, so two
 * rows fit on one screen. Tiles re-flow with Motion `layout` when filtering.
 */
export function BentoGrid({ projects, filterLabel, allLabel }: BentoGridProps) {
  const [filter, setFilter] = useState<Filter>('all');

  // Categories with no projects don't get a chip.
  const options: FilterOption<Filter>[] = [
    { value: 'all', label: allLabel, count: projects.length },
    ...(Object.keys(categoryLabels) as ProjectCategory[])
      .map((category) => ({
        value: category,
        label: categoryLabels[category],
        count: projects.filter((project) => project.categories.includes(category)).length,
      }))
      .filter((option) => option.count > 0),
  ];

  const visible = projects.filter(
    (project) => filter === 'all' || project.categories.includes(filter),
  );

  return (
    <div className="flex flex-col gap-6">
      <FilterChips label={filterLabel} options={options} value={filter} onChange={setFilter} />
      <ul className="grid grid-flow-dense auto-rows-[minmax(22rem,auto)] gap-4 md:grid-cols-2 lg:auto-rows-[clamp(20rem,38svh,25rem)] lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              // The hovered tile rises above its neighbours so its selection
              // label is never covered by the tile below it.
              className={cn(
                'relative z-0 focus-within:z-10 hover:z-10',
                project.size === 'large' && 'md:col-span-2',
              )}
            >
              <ProjectTile project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
