import { cn } from '@/lib/cn';

type ImagePlaceholderProps = {
  /** What will go here, e.g. "Grouper cover". Read by screen readers. */
  label: string;
  /** File to drop into /public to replace this, e.g. "/images/grouper/cover.webp". */
  path?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". Omit to fill the parent. */
  ratio?: string;
  /** For small slots: show only the file name. */
  compact?: boolean;
  className?: string;
};

/** Stand-in for an image that has not been exported yet. */
export function ImagePlaceholder({
  label,
  path,
  ratio,
  compact,
  className,
}: ImagePlaceholderProps) {
  const fileName = path?.split('/').pop();

  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      className={cn(
        'relative isolate flex items-center justify-center overflow-hidden bg-bg bg-grid text-ink',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-line-strong"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M0 0 100 100M100 0 0 100" vectorEffect="non-scaling-stroke" />
      </svg>
      {compact ? (
        fileName && (
          <code className="max-w-[90%] rounded-tag border border-line-strong bg-surface px-2 py-1 text-micro break-all text-ink-muted">
            {fileName}
          </code>
        )
      ) : (
        <div className="flex max-w-[90%] flex-col items-center gap-1 rounded-tile-sm border border-line-strong bg-surface px-4 py-2 text-center">
          <span className="text-small font-medium text-ink">{label}</span>
          {path && <code className="text-micro break-all text-ink-muted">public{path}</code>}
        </div>
      )}
    </div>
  );
}
