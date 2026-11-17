import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { GSAP_EASE } from '@/lib/motion';

type SelectionBoxProps = {
  children: ReactNode;
  /** Text in the tag. Defaults to the box's live size, like Figma. */
  label?: string;
  /**
   * `always`: selection is visible.
   * `hover`: appears on hover and keyboard focus.
   * `draw`: a pen cursor draws the outline on load, dropping a handle at each corner.
   */
  mode?: 'always' | 'hover' | 'draw';
  /** Seconds to wait before drawing starts (`draw` mode). */
  delay?: number;
  /** Where the tag sits. */
  labelPosition?: 'bottom' | 'top-left';
  className?: string;
};

/** Corner handles in drawing order: clockwise from the top left. */
const handles = [
  '-top-1 -left-1',
  '-top-1 -right-1',
  '-right-1 -bottom-1',
  '-bottom-1 -left-1',
] as const;

/** The four sides in drawing order, as SVG line coordinates. */
const sides = [
  { x1: '0', y1: '0', x2: '100%', y2: '0' },
  { x1: '100%', y1: '0', x2: '100%', y2: '100%' },
  { x1: '100%', y1: '100%', x2: '0', y2: '100%' },
  { x1: '0', y1: '100%', x2: '0', y2: '0' },
] as const;

/** Where the pen ends up after each side. */
const penStops = [
  { left: '100%', top: '0%' },
  { left: '100%', top: '100%' },
  { left: '0%', top: '100%' },
  { left: '0%', top: '0%' },
] as const;

/** Seconds per side: the long sides take a little longer. */
const SIDE_DURATION = [0.55, 0.32, 0.5, 0.32] as const;

/**
 * Figma-style selection: 1px outline, four corner handles and a label tag.
 * Purely decorative (aria-hidden). It is never the only hover or focus cue.
 */
export function SelectionBox({
  children,
  label,
  mode = 'always',
  delay = 0,
  labelPosition = 'bottom',
  className,
}: SelectionBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || label !== undefined) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [label]);

  // Pen-tool drawing. Layout effect so the hidden start state is set before first paint.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (mode !== 'draw' || !overlay) return;
    // Reduced motion: leave everything in its finished state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGLineElement>('[data-selection-line]');
      const corners = gsap.utils.toArray<HTMLElement>('[data-selection-handle]');
      const pen = '[data-selection-pen]';
      const tag = '[data-selection-label]';

      gsap.set(lines, { strokeDashoffset: 1 });
      gsap.set(corners, { scale: 0 });
      gsap.set(tag, { autoAlpha: 0, y: -6 });
      gsap.set(pen, { autoAlpha: 0, left: '0%', top: '0%' });

      const timeline = gsap.timeline({ delay });
      timeline.to(pen, { autoAlpha: 1, duration: 0.2 });

      sides.forEach((_, index) => {
        const at = `side-${index}`;
        const duration = SIDE_DURATION[index];
        timeline
          .addLabel(at)
          // Click: drop an anchor point, then drag the line to the next corner.
          .to(corners[index], { scale: 1, duration: 0.25, ease: 'back.out(3)' }, at)
          .to(lines[index], { strokeDashoffset: 0, duration, ease: 'power2.inOut' }, at)
          .to(pen, { ...penStops[index], duration, ease: 'power2.inOut' }, at);
      });

      timeline
        .to(pen, { autoAlpha: 0, duration: 0.25 }, '+=0.15')
        .to(tag, { autoAlpha: 1, y: 0, duration: 0.35, ease: GSAP_EASE }, '<');
    }, overlay);

    return () => context.revert();
  }, [mode, delay]);

  const text = label ?? (size ? `${size.width} × ${size.height}` : '');

  return (
    <div ref={ref} className={cn('group/selection relative', className)}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        data-selection=""
        className={cn(
          'pointer-events-none absolute inset-0 z-10',
          mode === 'hover' &&
            'opacity-0 transition-opacity duration-200 group-focus-within/selection:opacity-100 group-hover/selection:opacity-100',
        )}
      >
        {mode === 'draw' ? (
          <svg className="absolute inset-0 size-full overflow-visible" shapeRendering="crispEdges">
            {sides.map((side, index) => (
              <line
                key={index}
                data-selection-line=""
                {...side}
                pathLength={1}
                strokeDasharray={1}
                strokeWidth={1}
                className="stroke-selection"
              />
            ))}
          </svg>
        ) : (
          <span className="absolute inset-0 border border-selection" />
        )}

        {handles.map((position) => (
          <span
            key={position}
            data-selection-handle=""
            className={cn(
              'absolute size-2 rounded-handle border border-selection bg-selection-handle',
              position,
            )}
          />
        ))}

        {/* In draw mode the tag is always rendered so the timeline can find it before the size is known. */}
        {(text || mode === 'draw') && (
          <span
            data-selection-label=""
            className={cn(
              'absolute rounded-tag bg-selection-tag px-1.5 py-0.5 text-micro font-medium whitespace-nowrap text-selection-tag-fg tabular-nums',
              labelPosition === 'bottom' && 'top-full left-1/2 mt-2 -translate-x-1/2',
              labelPosition === 'top-left' && 'bottom-full left-0 mb-2',
            )}
          >
            {text}
          </span>
        )}

        {mode === 'draw' && (
          // Pen-tool cursor. Its nib tip sits exactly on the point being drawn.
          <span data-selection-pen="" className="invisible absolute top-0 left-0 size-6">
            <svg
              viewBox="0 0 24 24"
              className="size-full drop-shadow-sm"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {/* Nib, pointing up-left */}
              <path
                d="M1 1 4 13 9.5 15.5 15.5 9.5 13 4Z"
                className="fill-on-accent stroke-ink-base"
              />
              {/* Collar */}
              <path
                d="M10.5 16.5 16.5 10.5 21 15 15 21Z"
                className="fill-on-accent stroke-ink-base"
              />
              {/* Slit and breather hole */}
              <path d="M1 1 8 8" className="stroke-ink-base" fill="none" />
              <circle cx="9" cy="9" r="1.4" className="fill-ink-base" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
