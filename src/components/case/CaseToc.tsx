import { AnimatePresence, motion, useScroll } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { cn } from '@/lib/cn';
import { useActiveSection } from '@/lib/hooks';
import { DURATION, EASE_OUT } from '@/lib/motion';

export type TocItem = { id: string; label: string };

type CaseTocProps = {
  items: readonly TocItem[];
  ids: readonly string[];
  /** The article whose scroll progress the bar shows. */
  articleRef: RefObject<HTMLElement | null>;
  /** `rail`: segmented progress in the desktop sidebar. `bar`: sticky dropdown (mobile). */
  variant: 'rail' | 'bar';
};

/**
 * Table of contents.
 *
 * Desktop (`rail`): one segment per section, filled up to the section being
 * read. Each segment is a link (hover shows its name). Below it: "04 / 09" and
 * the current section, plus an "All sections" button that opens the full
 * list above the progress, so the sidebar never has to grow to fit it.
 *
 * Mobile (`bar`): a sticky bar under the nav showing the current section and a
 * progress line; tap it to open the full list.
 */
export function CaseToc({ items, ids, articleRef, variant }: CaseTocProps) {
  const active = useActiveSection(ids);
  const currentIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  );
  const current = items[currentIndex];

  if (variant === 'rail') {
    return <Rail items={items} currentIndex={currentIndex} />;
  }
  return <Bar items={items} current={current} articleRef={articleRef} />;
}

function SectionLinks({
  items,
  currentId,
  onNavigate,
  columns = 1,
}: {
  items: readonly TocItem[];
  currentId?: string;
  onNavigate?: () => void;
  columns?: number;
}) {
  return (
    <ul
      className="grid grid-flow-col gap-x-5"
      // Fills top to bottom, then the next column, so reading order is kept.
      style={{ gridTemplateRows: `repeat(${Math.ceil(items.length / columns)}, auto)` }}
    >
      {items.map((item) => {
        const isActive = item.id === currentId;
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
}

function Rail({ items, currentIndex }: { items: readonly TocItem[]; currentIndex: number }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const listId = useId();
  const current = items[currentIndex];
  const pad = (n: number) => String(n).padStart(2, '0');

  // Close the list on Escape or a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <nav ref={navRef} aria-label="On this page" className="relative flex flex-col gap-1.5">
      <ol className="flex gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="flex-1">
            <a
              href={`#${item.id}`}
              aria-current={index === currentIndex ? 'location' : undefined}
              className="group/seg relative block py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            >
              <span className="sr-only">{item.label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  'block h-1 rounded-pill transition-colors duration-300',
                  index <= currentIndex ? 'bg-ink' : 'bg-line group-hover/seg:bg-line-strong',
                )}
              />
              {/* Hover label */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-tile-sm px-2 py-1 text-micro font-medium whitespace-nowrap text-cta-fg opacity-0 shadow-tile transition duration-200 bg-cta group-hover/seg:translate-y-0 group-hover/seg:opacity-100"
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="flex items-baseline justify-between gap-3 text-small">
        <p className="min-w-0 truncate">
          <span className="mr-2 text-ink-muted tabular-nums">
            {pad(currentIndex + 1)} / {pad(items.length)}
          </span>
          <span className="font-semibold">{current?.label}</span>
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex shrink-0 items-center gap-1 text-ink-muted transition-colors hover:text-ink"
        >
          All sections
          <span
            aria-hidden="true"
            className={cn('transition-transform duration-300', open && 'rotate-180')}
          >
            ▴
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="absolute inset-x-0 bottom-full z-20 mb-2 rounded-tile-sm border border-line-strong bg-surface/95 px-4 py-3 shadow-lift backdrop-blur-md"
          >
            <SectionLinks
              items={items}
              currentId={current?.id}
              onNavigate={() => setOpen(false)}
              columns={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Bar({
  items,
  current,
  articleRef,
}: {
  items: readonly TocItem[];
  current?: TocItem;
  articleRef: RefObject<HTMLElement | null>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start 40%', 'end 60%'],
  });

  return (
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
      <div className="px-4 pb-3">
        <SectionLinks items={items} currentId={current?.id} onNavigate={() => setMenuOpen(false)} />
      </div>
      <div aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden">
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="h-full origin-left rounded-pill bg-ink"
        />
      </div>
    </details>
  );
}
