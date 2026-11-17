import type { CSSProperties, ReactNode } from 'react';
import { RevealList, RevealListItem } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

/** Most cards in one row on wide screens. More cards start a new row. */
export const MAX_PER_ROW = 6;

type ArchiveGridProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  className?: string;
};

/**
 * Card grid that sizes itself to its content: with 4 projects the row has
 * 4 columns, with 5 it has 5, up to 6 per row; a 7th starts a second row.
 * Adding or removing a project never leaves an empty gap.
 */
export function ArchiveGrid<T>({ items, getKey, renderItem, className }: ArchiveGridProps<T>) {
  const count = Math.max(items.length, 1);
  const style = {
    '--cols-sm': Math.min(count, 2),
    '--cols-md': Math.min(count, 3),
    '--cols-lg': Math.min(count, MAX_PER_ROW),
  } as CSSProperties;

  return (
    <RevealList
      className={cn(
        'grid gap-4',
        'grid-cols-[repeat(var(--cols-sm),minmax(0,1fr))]',
        'md:grid-cols-[repeat(var(--cols-md),minmax(0,1fr))]',
        'lg:grid-cols-[repeat(var(--cols-lg),minmax(0,1fr))]',
        className,
      )}
      style={style}
    >
      {items.map((item) => (
        <RevealListItem key={getKey(item)}>{renderItem(item)}</RevealListItem>
      ))}
    </RevealList>
  );
}
