import { cn } from '@/lib/cn';

export type Spec = { label: string; value: string };

type SpecListProps = {
  items: Spec[];
  /** `on-accent` is for use on the gradient or a dark image. */
  tone?: 'ink' | 'on-accent';
  className?: string;
};

/** Label / value pairs in small technical type (the posters' "STATS" block). */
export function SpecList({ items, tone = 'ink', className }: SpecListProps) {
  return (
    <dl className={cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-micro uppercase', className)}>
      {items.map(({ label, value }) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid">
          <dt className={tone === 'ink' ? 'text-ink-muted' : 'text-on-accent'}>{label}</dt>
          <dd className={cn('font-medium', tone === 'ink' ? 'text-ink' : 'text-on-accent')}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
