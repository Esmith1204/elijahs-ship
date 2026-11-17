import type { ReactNode } from 'react';

type GuideSectionProps = {
  id: string;
  index: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
};

export function GuideSection({ id, index, title, intro, children }: GuideSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-t border-line-strong py-16">
      <div className="mb-10 flex flex-col gap-3">
        <p className="text-small font-medium text-highlight tabular-nums">{index}</p>
        <h2 id={headingId} className="text-h2 font-semibold">
          {title}
        </h2>
        <p className="max-w-prose text-ink-muted">{intro}</p>
      </div>
      <div className="flex flex-col gap-12">{children}</div>
    </section>
  );
}

type GuideBlockProps = {
  title: string;
  note?: ReactNode;
  children: ReactNode;
};

/** A titled group inside a section. */
export function GuideBlock({ title, note, children }: GuideBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-label font-medium text-ink uppercase">{title}</h3>
        {note && <p className="max-w-prose text-small text-ink-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}
