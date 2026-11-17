import { useId, useState } from 'react';
import { Figure } from '@/components/case/Figure';
import { Text } from '@/components/case/Text';
import type { CaseImage } from '@/content/caseStudies';
import { cn } from '@/lib/cn';
import { imageExists } from '@/lib/images';

type BeforeAfterProps = {
  before: CaseImage;
  after: CaseImage;
};

const toggleClass =
  'inline-flex h-10 items-center rounded-pill px-4 text-small font-medium transition-colors duration-200';

/**
 * Drag the divider (or use the arrow keys) to compare two versions. The
 * Before / After buttons show either one fully, so nothing needs dragging.
 * Until both images exist, the two placeholders sit side by side.
 */
export function BeforeAfter({ before, after }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  if (!imageExists(before.src) || !imageExists(after.src)) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Figure image={before} />
        <Figure image={after} />
      </div>
    );
  }

  const showing = position <= 0 ? 'after' : position >= 100 ? 'before' : 'both';

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-tile border border-line bg-on-accent select-none">
        {/* After sits underneath; Before is clipped to the left of the divider. */}
        <img
          src={after.src}
          alt={after.alt}
          width={after.width}
          height={after.height}
          loading="lazy"
          className="block h-auto w-full"
        />
        <img
          src={before.src}
          alt={before.alt}
          width={before.width}
          height={before.height}
          loading="lazy"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          className="absolute inset-0 block size-full object-cover"
        />

        <div
          aria-hidden="true"
          style={{ left: `${position}%` }}
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-on-accent shadow-tile"
        >
          <span className="absolute top-1/2 left-1/2 flex size-10 -translate-1/2 items-center justify-center rounded-full border border-line-strong bg-on-accent text-small font-semibold text-blue shadow-lift">
            ↔
          </span>
        </div>
        <span className="pointer-events-none absolute top-3 left-3 rounded-tag bg-ink-base/70 px-2 py-0.5 text-micro font-medium text-on-accent">
          Before
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-tag bg-ink-base/70 px-2 py-0.5 text-micro font-medium text-on-accent">
          After
        </span>

        {/* Invisible range input on top: drag, click or use the keyboard. */}
        <label htmlFor={id} className="sr-only">
          Compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ['Before', 100, 'before'],
            ['Compare', 50, 'both'],
            ['After', 0, 'after'],
          ] as const
        ).map(([label, value, state]) => (
          <button
            key={label}
            type="button"
            aria-pressed={showing === state}
            onClick={() => setPosition(value)}
            className={cn(
              toggleClass,
              showing === state
                ? 'text-cta-fg bg-cta'
                : 'border border-line-strong text-ink hover:border-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <figcaption className="grid gap-2 text-small text-ink-muted md:grid-cols-2">
        <Text>{before.caption}</Text>
        <Text>{after.caption}</Text>
      </figcaption>
    </figure>
  );
}
