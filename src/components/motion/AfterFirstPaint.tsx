import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/** Longest to wait for an idle moment before rendering anyway, in ms. */
const IDLE_TIMEOUT_MS = 400;

/**
 * Renders its children in the first idle moment after the page paints, instead
 * of in the same burst of work as the hero. Use only for content that starts
 * below the first screen, so nothing visible shifts. On slow phones this keeps
 * the hero quick to appear and respond.
 */
export function AfterFirstPaint({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const show = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(show, { timeout: IDLE_TIMEOUT_MS });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(show, 1);
    return () => window.clearTimeout(handle);
  }, []);

  return ready ? children : null;
}
