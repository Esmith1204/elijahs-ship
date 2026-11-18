import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Seconds for one slow rise and fall. Matches the `bob` keyframes in index.css. */
const BOB_SECONDS = 4.5;

type BobProps = {
  children: ReactNode;
  /**
   * Position along the row, 0 to 1 (left to right). Items further right are
   * further through their cycle, so a row reads as one swell passing under it.
   */
  phase?: number;
  /** Render as a list item instead of a div. */
  as?: 'div' | 'li';
  className?: string;
};

/**
 * Floats its content up and down, as if riding the water. A CSS animation,
 * so the GPU runs it off the main thread. The global reduced-motion rule in
 * index.css holds it still.
 */
export function Bob({ children, phase = 0, as: Tag = 'div', className }: BobProps) {
  return (
    <Tag
      // A negative delay starts mid-cycle immediately instead of waiting.
      style={{ animationDelay: `${-phase * BOB_SECONDS}s` }}
      className={cn('animate-bob', className)}
    >
      {children}
    </Tag>
  );
}
