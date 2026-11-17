import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { GSAP_EASE } from '@/lib/motion';
import { createWaveScene } from './wave/scene';
import type { WaveScene } from './wave/scene';
import { defaultWaveSettings } from './wave/settings';
import type { WaveSettings } from './wave/settings';

type HeroWaveProps = {
  settings?: WaveSettings;
  /** Play the load sequence: grid fades in, water rises, boat sails in. */
  intro?: boolean;
  /** Called twice a second with the measured frame rate (for the tuning panel). */
  onFps?: (fps: number) => void;
  /** Lowest the waterline may sit is this many px from the top (keeps the boat clear of text). */
  minWaterline?: number;
  className?: string;
};

/** Sharper than 2x costs fill rate and isn't visible on thin strokes. */
const MAX_DPR = 2;
/** Longest step the water may take in one frame, so a stalled tab doesn't lurch. */
const MAX_FRAME_SECONDS = 1 / 20;
const FPS_REPORT_MS = 500;

/**
 * The signature scene: a living wave, a reactive Figma grid and a tugboat,
 * drawn on a 2D canvas and driven by gsap.ticker.
 *
 * - Pauses when scrolled offscreen or when the tab is hidden.
 * - prefers-reduced-motion: one still frame, no animation.
 * - Decorative: the canvas is aria-hidden. Keep real content in the DOM.
 *
 * Size it with `className`; the canvas fills the wrapper.
 */
export function HeroWave({
  settings = defaultWaveSettings,
  intro = true,
  onFps,
  minWaterline = 0,
  className,
}: HeroWaveProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WaveScene | null>(null);
  const settingsRef = useRef(settings);
  const onFpsRef = useRef(onFps);
  const minWaterlineRef = useRef(minWaterline);
  /** Repaints once when the loop isn't running (paused or reduced motion). */
  const repaintRef = useRef<(() => void) | null>(null);

  // Declared before the setup effect so the first scene gets current settings.
  useEffect(() => {
    settingsRef.current = settings;
    sceneRef.current?.setSettings(settings);
    repaintRef.current?.();
  }, [settings]);

  useEffect(() => {
    onFpsRef.current = onFps;
  }, [onFps]);

  useEffect(() => {
    minWaterlineRef.current = minWaterline;
    sceneRef.current?.setMinWaterline(minWaterline);
    repaintRef.current?.();
  }, [minWaterline]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const scene = createWaveScene(canvas, settingsRef.current);
    if (!scene) return;
    sceneRef.current = scene;
    scene.setMinWaterline(minWaterlineRef.current);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let onscreen = true;
    let running = false;
    let frames = 0;
    let lastReport = performance.now();

    const tick = (_time: number, deltaMs: number) => {
      scene.frame(Math.min(deltaMs / 1000, MAX_FRAME_SECONDS));

      frames++;
      const now = performance.now();
      if (now - lastReport >= FPS_REPORT_MS) {
        onFpsRef.current?.(Math.round((frames * 1000) / (now - lastReport)));
        frames = 0;
        lastReport = now;
      }
    };

    const repaint = () => {
      if (running) return;
      if (reduced) scene.drawStill();
      else scene.frame(0);
    };
    repaintRef.current = repaint;

    /** Start or stop the loop to match visibility and motion preference. */
    const sync = () => {
      const shouldRun = !reduced && onscreen && !document.hidden;
      if (shouldRun && !running) {
        frames = 0;
        lastReport = performance.now();
        gsap.ticker.add(tick);
        running = true;
      } else if (!shouldRun && running) {
        gsap.ticker.remove(tick);
        running = false;
      }
      if (reduced) {
        scene.intro.grid = scene.intro.rise = scene.intro.boat = 1;
        scene.drawStill();
      }
    };

    // Load sequence. Reduced-motion users skip straight to the still frame.
    let timeline: gsap.core.Timeline | null = null;
    if (intro && !reduced) {
      scene.intro.grid = scene.intro.rise = scene.intro.boat = 0;
      timeline = gsap
        .timeline()
        .to(scene.intro, { grid: 1, duration: 0.7, ease: 'power1.out' }, 0)
        .to(scene.intro, { rise: 1, duration: 1.2, ease: GSAP_EASE }, 0.25)
        .to(scene.intro, { boat: 1, duration: 2.4, ease: 'power2.out' }, 0.8);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.resize(width, height, Math.min(window.devicePixelRatio || 1, MAX_DPR));
      repaint();
    });
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(wrapper);

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      if (reduced) timeline?.progress(1);
      sync();
    };
    motionQuery.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', sync);

    sync();

    return () => {
      timeline?.kill();
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', sync);
      sceneRef.current = null;
      repaintRef.current = null;
    };
  }, [intro]);

  return (
    // The outer div takes the caller's sizing/positioning (which may itself be
    // `absolute`); the inner one is the positioning context for the canvas.
    <div className={cn('overflow-hidden', className)}>
      <div ref={wrapperRef} className="relative size-full">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full" />
      </div>
    </div>
  );
}
