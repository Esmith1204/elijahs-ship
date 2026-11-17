import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Seconds for one slow rise and fall. */
const BOB_SECONDS = 4.5;
/** Pixels of travel. Kept small so text stays easy to read. */
const BOB_PX = 4;

type BobProps = {
  children: ReactNode;
  /**
   * Position along the row, 0 to 1 (left to right). Items further right start
   * later, so a row reads as one swell passing under it.
   */
  phase?: number;
  /** Render as a list item instead of a div. */
  as?: 'div' | 'li';
  className?: string;
};

/**
 * Floats its content up and down, as if riding the water. Transform only, so
 * reduced-motion users (MotionConfig reducedMotion="user") see it still.
 */
export function Bob({ children, phase = 0, as = 'div', className }: BobProps) {
  const Tag = motion[as];
  return (
    <Tag
      animate={{ y: [0, -BOB_PX, 0] }}
      transition={{
        duration: BOB_SECONDS,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: phase * BOB_SECONDS,
      }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </Tag>
  );
}
