import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { GuideBlock, GuideSection } from './GuideSection';
import { displayWeights, typeSteps } from './tokens';
import type { TypeStep } from './tokens';

/** One row of the scale, with the rendered size read back from the browser. */
function Specimen({ step }: { step: TypeStep }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [metrics, setMetrics] = useState('');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element);
      const size = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) / size;
      setMetrics(`${Math.round(size)}px / ${lineHeight.toFixed(2)}`);
    });
    // The fluid sizes depend on the viewport, so watch the root element.
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <li className="grid gap-2 border-b border-line py-6 last:border-0 md:grid-cols-[10rem_1fr] md:gap-8">
      <div className="flex flex-row items-baseline gap-3 md:flex-col md:gap-1">
        <code className="text-small font-medium">text-{step.name}</code>
        <span className="text-micro text-ink-muted tabular-nums">{metrics}</span>
        <span className="text-micro text-ink-muted">{step.use}</span>
      </div>
      <p ref={ref} className={cn(step.className, 'min-w-0 break-words')}>
        {step.sample}
      </p>
    </li>
  );
}

export function TypeSection() {
  return (
    <GuideSection
      id="type"
      index="02"
      title="Typography"
      intro="Stack Sans Notch for display, Stack Sans Text for everything else. Both are variable, self-hosted and swap in without blocking render. Sizes are fluid: resize the window and the readouts follow."
    >
      <GuideBlock title="Scale">
        <ul className="rounded-tile-sm border border-line bg-surface px-6">
          {typeSteps.map((step) => (
            <Specimen key={step.name} step={step} />
          ))}
        </ul>
      </GuideBlock>

      <GuideBlock
        title="Display weights"
        note="Stack Sans Notch runs from 200 to 700. Headings default to 600. The light end echoes the thin, wide type in ref-03."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {displayWeights.map(({ weight, className }) => (
            <li
              key={weight}
              className="flex flex-col gap-2 rounded-tile-sm border border-line bg-surface p-4"
            >
              <span className={cn('font-display text-h2', className)}>Ship</span>
              <span className="text-micro text-ink-muted tabular-nums">{weight}</span>
            </li>
          ))}
        </ul>
      </GuideBlock>

      <GuideBlock title="Body copy" note="Measure is capped near 65 characters.">
        <div className="max-w-prose rounded-tile-sm border border-line bg-surface p-6">
          <p className="text-lead">Product designer who builds what he designs.</p>
          <p className="mt-4 text-ink-muted">
            Sample paragraph in Stack Sans Text at 16px with a 1.6 line height. Links look like{' '}
            <a href="#type" className="text-blue underline underline-offset-4">
              this in blue
            </a>{' '}
            or{' '}
            <a href="#type" className="text-purple underline underline-offset-4">
              this in purple
            </a>
            , and a highlighted phrase can use the{' '}
            <span className="text-brand-gradient font-medium">brand gradient</span> at larger sizes.
          </p>
        </div>
      </GuideBlock>
    </GuideSection>
  );
}
