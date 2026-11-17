import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * The lowest point the water may sit at so it stays below `ref` (plus
 * `clearance` px for the boat and its smoke), measured from the top of the
 * element's offset parent, which should be the box the wave canvas fills.
 * Re-measures whenever the layout changes size.
 */
export function useWaterlineBelow(ref: RefObject<HTMLElement | null>, clearance: number): number {
  const [floor, setFloor] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setFloor(element.offsetTop + element.offsetHeight + clearance);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.offsetParent) observer.observe(element.offsetParent);
    return () => observer.disconnect();
  }, [ref, clearance]);

  return floor;
}
