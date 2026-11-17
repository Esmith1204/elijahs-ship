import { motion, useScroll } from 'motion/react';
import { useState } from 'react';
import type { RefObject } from 'react';
import { cn } from '@/lib/cn';
import { useActiveSection } from '@/lib/hooks';

export type TocItem = { id: string; label: string };

type CaseTocProps = {
  items: readonly TocItem[];
  ids: readonly string[];
  /** The article whose scroll progress the bar shows. */
  articleRef: RefObject<HTMLElement | null>;
};

/**
 * Table of contents. Desktop: a sticky column with a progress rail beside the
 * links. Mobile: a sticky bar under the nav showing the current section and a
 * progress line; tap it to open the full list.
 */
export function CaseToc({ items, ids, articleRef }: CaseTocProps) {
  const active = useActiveSection(ids);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start 40%', 'end 60%'],
  });
  const current = items.find((item) => item.id === active) ?? items[0];

  const links = (onNavigate?: () => void) => (
    <ul className="flex flex-col">
      {items.map((item) => {
        const isActive = item.id === current?.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={onNavigate}
              className={cn(
                'block py-1.5 text-small transition-colors duration-200',
                isActive ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink',
              )}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop */}
      <nav aria-label="On this page" className="sticky top-28 hidden self-start lg:flex lg:gap-5">
        <div aria-hidden="true" className="relative w-0.5 shrink-0 rounded-pill bg-line">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute inset-0 origin-top rounded-pill bg-ink"
          />
        </div>
        {links()}
      </nav>

      {/* Mobile */}
      <details
        open={menuOpen}
        onToggle={(event) => setMenuOpen(event.currentTarget.open)}
        className="group/toc sticky top-20 z-20 rounded-tile-sm border border-line-strong bg-surface/90 shadow-tile backdrop-blur-md transition-[top] duration-500 ease-out-expo lg:hidden [html[data-nav-hidden]_&]:top-4"
      >
        <summary className="flex h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-small font-medium [&::-webkit-details-marker]:hidden">
          <span>
            <span className="sr-only">On this page: </span>
            {current?.label}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-open/toc:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="px-4 pb-3">{links(() => setMenuOpen(false))}</div>
        <div aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full origin-left rounded-pill bg-ink"
          />
        </div>
      </details>
    </>
  );
}
