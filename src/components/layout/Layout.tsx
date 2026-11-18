import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ContactFooter } from '@/components/layout/ContactFooter';
import { Nav } from '@/components/layout/Nav';
import { UnderwaterBackdrop } from '@/components/layout/UnderwaterBackdrop';
import { site } from '@/content/site';

/** How long to keep looking for a #section that a lazy route hasn't rendered yet. */
const HASH_RETRIES = 30;
const HASH_RETRY_MS = 50;

/** Page shell: skip link, floating nav, main landmark, contact footer. */
export function Layout() {
  const { pathname, hash, key } = useLocation();
  // Every page follows site.theme, so moving between pages never flips the palette.
  const blue = site.theme === 'blue';

  // On <html> so the nav, footer and the area behind overscroll all match.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('theme-blue', blue);
    return () => document.documentElement.classList.remove('theme-blue');
  }, [blue]);

  // Scroll to the #section in the URL, or to the top on a plain page change.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let timer = 0;
    const seek = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView();
      else if (tries++ < HASH_RETRIES) timer = window.setTimeout(seek, HASH_RETRY_MS);
    };
    seek();
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]);

  return (
    <>
      <a
        href="#main"
        className="theme-light sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-pill focus:bg-surface focus:px-4 focus:py-2 focus:text-small focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />

      {/* The underwater backdrop sits behind the page content and the footer. */}
      <div className="relative isolate">
        <UnderwaterBackdrop />
        <main id="main">
          <Outlet />
        </main>
        <ContactFooter />
      </div>
    </>
  );
}
