import { ColorSection } from './ColorSection';
import { ComponentSection } from './ComponentSection';
import { MotifSection } from './MotifSection';
import { MotionSection } from './MotionSection';
import { ShapeSection } from './ShapeSection';
import { sections } from './tokens';
import { TypeSection } from './TypeSection';

/** /styleguide: every token and base component in one place. */
export default function Styleguide() {
  return (
    <div className="mx-auto max-w-content px-gutter pb-section">
      <header className="flex flex-col gap-6 pt-nav pb-16">
        <h1 className="text-display font-semibold">Styleguide</h1>
        <p className="max-w-prose text-lead text-ink-muted">
          Every token and base component the site is built from. Change a value in{' '}
          <code className="text-body text-ink">src/styles/index.css</code> and this page updates.
        </p>
        <nav aria-label="Styleguide sections">
          <ul className="flex flex-wrap gap-2">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex h-10 items-center rounded-pill border border-line-strong bg-surface px-4 text-small font-medium transition-colors duration-200 hover:border-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <ColorSection />
      <TypeSection />
      <ShapeSection />
      <ComponentSection />
      <MotifSection />
      <MotionSection />
    </div>
  );
}
