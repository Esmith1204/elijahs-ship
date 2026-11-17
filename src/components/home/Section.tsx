import type { ReactNode } from 'react';
import { MaskedHeading, Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type SectionProps = {
  /** Anchor id, used by the nav (#work, #about). */
  id: string;
  heading: string;
  intro?: string;
  /** Sits to the right of the heading on desktop (e.g. a "View archive" link). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Standard homepage section: masked heading, optional intro, content. */
export function Section({ id, heading, intro, action, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('mx-auto flex max-w-content flex-col gap-10 px-gutter pt-section', className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col items-start gap-4">
          <MaskedHeading id={headingId} className="text-h1 font-semibold">
            {heading}
          </MaskedHeading>
          {intro && (
            <Reveal>
              <p className="max-w-prose text-lead text-ink-muted">{intro}</p>
            </Reveal>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
