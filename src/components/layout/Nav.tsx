import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { home } from '@/content/home';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';
import { useActiveSection, useNavHidden, useScrolled } from '@/lib/hooks';
import { DURATION, EASE_OUT } from '@/lib/motion';

/** Section ids the nav can highlight, in page order. */
const SECTION_IDS = home.nav
  .filter((item) => item.to.startsWith('#'))
  .map((item) => item.to.slice(1));

/**
 * Link with an underline that wipes in from the left on hover and out to the
 * right on leave. The current page or section keeps its underline.
 */
const linkBase =
  'relative inline-flex h-10 items-center px-3 text-small font-medium whitespace-nowrap ' +
  'after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:rounded-pill after:bg-current ' +
  'after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out-expo ' +
  'hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100';
const linkCurrent = 'after:origin-left after:scale-x-100';

type NavItemProps = {
  item: (typeof home.nav)[number];
  current: boolean;
  onNavigate?: () => void;
  className?: string;
};

function NavItem({ item, current, onNavigate, className }: NavItemProps) {
  const classes = cn(linkBase, current && linkCurrent, className);

  if (item.to === 'resume') {
    return (
      <a
        href={site.links.resume}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
        className={classes}
      >
        {item.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  const isSection = item.to.startsWith('#');
  return (
    <Link
      to={isSection ? { pathname: '/', hash: item.to } : item.to}
      aria-current={current ? (isSection ? 'location' : 'page') : undefined}
      onClick={onNavigate}
      className={classes}
    >
      {item.label}
    </Link>
  );
}

/**
 * Floating pill nav. Smart: it slides away while you scroll down and comes
 * back as soon as you scroll up. It turns more opaque once the page scrolls,
 * and stays put while the mobile menu is open or a link has keyboard focus.
 */
export function Nav() {
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS, pathname === '/');
  const [open, setOpen] = useState(false);
  const hidden = useNavHidden() && !open;

  const isCurrent = (to: string) =>
    to.startsWith('#') ? pathname === '/' && activeSection === to.slice(1) : pathname === to;

  const shell = cn(
    'border transition-[background-color,border-color,box-shadow] duration-300',
    scrolled || open
      ? 'border-line-strong bg-surface/90 shadow-tile backdrop-blur-md'
      : 'border-line bg-surface/40 backdrop-blur-sm',
  );

  return (
    <>
      <header
        onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
        className={cn(
          'pointer-events-none fixed inset-x-0 top-4 z-40 flex flex-col items-center gap-2 px-4 transition-transform duration-500 ease-out-expo focus-within:translate-y-0',
          hidden && '-translate-y-[calc(100%+2rem)]',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'pointer-events-auto flex h-12 items-center gap-1 rounded-pill px-2',
            shell,
          )}
        >
          <Link
            to="/"
            className="inline-flex h-10 items-center px-3 font-display text-body font-semibold tracking-tight whitespace-nowrap"
          >
            {site.wordmark}
          </Link>

          <ul className="hidden items-center md:flex">
            {home.nav.map((item) => (
              <li key={item.label}>
                <NavItem item={item} current={isCurrent(item.to)} />
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-10 items-center gap-2 rounded-pill px-3 text-small font-medium md:hidden"
          >
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span
                className={cn(
                  'absolute inset-x-0 top-0 h-0.5 rounded-pill bg-current transition-transform duration-300 ease-out-expo',
                  open && 'translate-y-1 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 rounded-pill bg-current transition-transform duration-300 ease-out-expo',
                  open && '-translate-y-1 -rotate-45',
                )}
              />
            </span>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className={cn(
                'pointer-events-auto flex w-full max-w-xs flex-col rounded-tile-sm p-2 md:hidden',
                shell,
              )}
            >
              {home.nav.map((item) => (
                <li key={item.label}>
                  <NavItem
                    item={item}
                    current={isCurrent(item.to)}
                    onNavigate={() => setOpen(false)}
                    className="h-11 w-full"
                  />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
