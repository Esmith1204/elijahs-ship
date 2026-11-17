import { cn } from '@/lib/cn';

/**
 * Small decorative marks borrowed from the reference posters.
 * All are aria-hidden and inherit `currentColor`.
 */

type MotifProps = { className?: string };

/** Four-point star (ref-01, bottom centre). */
export function Sparkle({ className }: MotifProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn('size-6 fill-current', className)}>
      <path d="M12 0c.9 6.6 4.5 10.9 12 12-7.5 1.1-11.1 5.4-12 12-.9-6.6-4.5-10.9-12-12 7.5-1.1 11.1-5.4 12-12Z" />
    </svg>
  );
}

/** Target reticle (ref-01). */
export function Crosshair({ className }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={cn('size-12 stroke-current', className)}
    >
      <circle cx="24" cy="24" r="14" vectorEffect="non-scaling-stroke" />
      <path d="M24 2v18M24 28v18M2 24h18M28 24h18" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Corner registration mark, for framing a block like a print proof. */
export function CornerMark({ className }: MotifProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn('size-4 stroke-current', className)}
    >
      <path d="M0 .5h16M.5 0v16" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Ruler strip of tick marks (ref-02 control panel). */
export function TickRule({ className }: MotifProps) {
  return <div aria-hidden="true" className={cn('h-2 w-full bg-ticks', className)} />;
}
