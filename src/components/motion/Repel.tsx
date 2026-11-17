import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Items drift a little away from the mouse, on a heavy spring so the motion
 * feels resisted, like pushing through water. Mouse only: touch and
 * reduced-motion users get still items.
 */

type Pointer = { x: MotionValue<number>; y: MotionValue<number>; active: MotionValue<number> };

const PointerContext = createContext<Pointer | null>(null);

/** Low stiffness + high mass = slow, resisted drift. */
const SPRING = { stiffness: 90, damping: 16, mass: 1.1 };

type RepelFieldProps = {
  children: ReactNode;
  className?: string;
};

/** Tracks the mouse over an area so the <Repel> items inside can react to it. */
export function RepelField({ children, className }: RepelFieldProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const active = useMotionValue(0);
  const reduce = useReducedMotion();

  return (
    <div
      className={className}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== 'mouse') return;
        x.set(event.clientX);
        y.set(event.clientY);
        active.set(1);
      }}
      onPointerLeave={() => active.set(0)}
    >
      <PointerContext.Provider value={{ x, y, active }}>{children}</PointerContext.Provider>
    </div>
  );
}

type RepelProps = {
  children: ReactNode;
  /** Furthest an item moves, in px, when the mouse is right on it. */
  strength?: number;
  /** How far beyond its own edge the item can feel the mouse, in px. */
  radius?: number;
  className?: string;
};

/** One item that drifts away from the mouse inside a <RepelField>. */
export function Repel({ children, strength = 14, radius = 120, className }: RepelProps) {
  const pointer = useContext(PointerContext);
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  useEffect(() => {
    if (!pointer) return;
    const update = () => {
      // Measure the parent: it doesn't move with the drift, so no feedback loop.
      const anchor = ref.current?.parentElement;
      if (!anchor || !pointer.active.get()) {
        x.set(0);
        y.set(0);
        return;
      }
      const rect = anchor.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - pointer.x.get();
      const dy = rect.top + rect.height / 2 - pointer.y.get();
      const distance = Math.hypot(dx, dy) || 1;
      const reach = radius + Math.max(rect.width, rect.height) / 2;
      const push = distance < reach ? strength * (1 - distance / reach) ** 2 : 0;
      x.set((dx / distance) * push);
      y.set((dy / distance) * push);
    };
    const stops = [
      pointer.x.on('change', update),
      pointer.y.on('change', update),
      pointer.active.on('change', update),
    ];
    return () => stops.forEach((stop) => stop());
  }, [pointer, x, y, strength, radius]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
