import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'purple' | 'blue' | 'gradient' | 'on-accent';

const tones: Record<Tone, string> = {
  neutral: 'border border-line-strong bg-surface text-ink',
  purple: 'bg-purple-tint text-purple',
  blue: 'bg-blue-tint text-blue',
  gradient: 'bg-brand-gradient text-on-accent',
  'on-accent': 'border border-on-accent/40 text-on-accent',
};

type TagProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

/** Small, non-interactive label pill (project tags, statuses). */
export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-pill px-3 text-micro font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
