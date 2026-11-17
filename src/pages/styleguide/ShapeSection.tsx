import { readToken } from '@/lib/color';
import { cn } from '@/lib/cn';
import { GuideBlock, GuideSection } from './GuideSection';
import { radii, spacing } from './tokens';
import { useLiveTokens } from './useLiveTokens';

function readRadii(): Record<string, string> {
  return Object.fromEntries(radii.map(({ token }) => [token, readToken(token)]));
}

export function ShapeSection() {
  const radiusValues = useLiveTokens(readRadii);

  return (
    <GuideSection
      id="shape"
      index="03"
      title="Shape + space"
      intro="Soft tiles, full pills, generous whitespace. Spacing sits on an 8px base and content caps at 1200px."
    >
      <GuideBlock title="Radius">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {radii.map(({ token, className, use }) => (
            <li key={token} className="flex flex-col gap-3">
              <div
                className={cn('h-28 border border-line-strong bg-surface shadow-tile', className)}
              />
              <div className="flex flex-col">
                <code className="text-small font-medium">{className}</code>
                <span className="text-micro text-ink-muted">
                  {radiusValues[token]} · {use}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </GuideBlock>

      <GuideBlock
        title="Spacing"
        note="Tailwind's unit stays at 4px, so use even steps: p-2 is 8px, p-4 is 16px, p-6 is 24px."
      >
        <ul className="flex flex-col gap-2 rounded-tile-sm border border-line bg-surface p-6">
          {spacing.map(({ px, className }) => (
            <li key={px} className="flex items-center gap-4">
              <span className="w-12 text-right text-micro text-ink-muted tabular-nums">{px}px</span>
              <span className={cn('h-3 rounded-handle bg-brand-gradient', className)} />
            </li>
          ))}
        </ul>
        <dl className="grid gap-4 text-small md:grid-cols-3">
          <div className="rounded-tile-sm border border-line bg-surface p-4">
            <dt className="font-medium">
              <code>px-gutter</code>
            </dt>
            <dd className="text-ink-muted">Page side padding, 20px to 40px.</dd>
          </div>
          <div className="rounded-tile-sm border border-line bg-surface p-4">
            <dt className="font-medium">
              <code>py-section</code>
            </dt>
            <dd className="text-ink-muted">Space between homepage sections, 80px to 144px.</dd>
          </div>
          <div className="rounded-tile-sm border border-line bg-surface p-4">
            <dt className="font-medium">
              <code>max-w-content</code>
            </dt>
            <dd className="text-ink-muted">1200px content width. Text columns use max-w-prose.</dd>
          </div>
        </dl>
      </GuideBlock>

      <GuideBlock
        title="Elevation"
        note="Two shadows only: resting tiles and lifted (hover) tiles."
      >
        <ul className="grid gap-8 py-2 md:grid-cols-2">
          <li className="flex h-28 items-center justify-center rounded-tile border border-line bg-surface shadow-tile">
            <code className="text-small">shadow-tile</code>
          </li>
          <li className="flex h-28 items-center justify-center rounded-tile border border-line bg-surface shadow-lift">
            <code className="text-small">shadow-lift</code>
          </li>
        </ul>
      </GuideBlock>
    </GuideSection>
  );
}
