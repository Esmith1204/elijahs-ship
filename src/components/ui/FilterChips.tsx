import { motion } from 'motion/react';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT } from '@/lib/motion';

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  count: number;
};

type FilterChipsProps<T extends string> = {
  /** Accessible name for the group, e.g. "Filter projects". */
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Single-select filter chips with counts. The selected pill slides between chips. */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  const pillId = useId();

  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative inline-flex h-10 items-center gap-2 rounded-pill px-4 text-small font-medium transition-colors duration-200',
              selected
                ? 'text-cta-fg'
                : 'border border-line-strong bg-surface text-ink hover:border-ink',
            )}
          >
            {selected && (
              <motion.span
                layoutId={pillId}
                aria-hidden="true"
                className="absolute inset-0 rounded-pill bg-cta"
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              />
            )}
            <span className="relative">{option.label}</span>
            <span
              className={cn(
                'relative text-micro tabular-nums',
                selected ? 'text-cta-fg' : 'text-ink-muted',
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
