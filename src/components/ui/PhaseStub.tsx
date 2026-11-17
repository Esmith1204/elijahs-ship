import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

type PhaseStubProps = {
  title: string;
  children: ReactNode;
};

/** Temporary page body for routes that are built in a later phase. */
export function PhaseStub({ title, children }: PhaseStubProps) {
  return (
    <section className="mx-auto flex max-w-content flex-col items-start gap-6 px-gutter pt-nav pb-section">
      <h1 className="text-h1 font-semibold">{title}</h1>
      <p className="max-w-prose text-lead text-ink-muted">{children}</p>
      <div className="flex flex-wrap gap-3">
        <Button to="/">Back home</Button>
        <Button to="/styleguide" variant="secondary">
          Open the styleguide
        </Button>
      </div>
    </section>
  );
}
