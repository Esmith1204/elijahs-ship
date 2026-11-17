import { useEffect, useState } from 'react';

/** True once the page has scrolled past `offset` px. */
export function useScrolled(offset = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);

  return scrolled;
}

/**
 * The id of the section currently crossing the upper-middle of the viewport,
 * or null. `ids` must be a stable array (define it outside the component).
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // If two sections overlap the band, the later one on the page wins.
        setActive(ids.findLast((id) => visible.has(id)) ?? null);
      },
      // A thin band 40% of the way down the viewport.
      { rootMargin: '-40% 0px -55% 0px' },
    );

    // Sections can mount after the nav (lazy routes), so look again shortly.
    const observe = () => {
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    };
    observe();
    const retry = window.setTimeout(observe, 600);

    return () => {
      window.clearTimeout(retry);
      observer.disconnect();
      setActive(null);
    };
  }, [ids, enabled]);

  return active;
}

/** Pixels of scroll in one direction before the smart nav reacts. */
const NAV_SCROLL_THRESHOLD = 8;
/** The nav always shows above this scroll position. */
const NAV_ALWAYS_SHOW_ABOVE = 120;

/**
 * Smart nav: true while scrolling down (hide), false when scrolling up or
 * near the top (show). Also mirrors the state onto <html data-nav-hidden>
 * so other sticky bars can move up into the space.
 */
export function useNavHidden(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (y < NAV_ALWAYS_SHOW_ABOVE) setHidden(false);
      else if (delta > NAV_SCROLL_THRESHOLD) setHidden(true);
      else if (delta < -NAV_SCROLL_THRESHOLD) setHidden(false);
      else return;
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (hidden) root.dataset.navHidden = '';
    else delete root.dataset.navHidden;
    return () => {
      delete root.dataset.navHidden;
    };
  }, [hidden]);

  return hidden;
}
