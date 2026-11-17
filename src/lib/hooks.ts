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
