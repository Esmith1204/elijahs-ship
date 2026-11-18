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
  /** Cap on how deep the water below the waterline is, in px (0 = no cap). */
  maxWaterDepth?: number;
  /** Fade the water out toward the bottom so the page behind shows through. */
  fadeWater?: boolean;
  className?: string;
};

/** Sharper than 2x costs fill rate and isn't visible on thin strokes. */
const MAX_DPR = 2;
/** Phones and tablets: fewer pixels and half the frames. The swell is slow, so it still reads as smooth. */
const TOUCH_MAX_DPR = 1.5;
const TOUCH_FRAME_MS = 1000 / 30;
/** Longest step the water may take in one frame, so a stalled tab doesn't lurch. */
const MAX_FRAME_SECONDS = 1 / 20;
const FPS_REPORT_MS = 500;
/** Longest the wave waits for an idle moment after load before starting anyway. */
const IDLE_TIMEOUT_MS = 700;

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
  maxWaterDepth = 0,
  fadeWater = false,
  className,
}: HeroWaveProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WaveScene | null>(null);
  const settingsRef = useRef(settings);
  const onFpsRef = useRef(onFps);
  const minWaterlineRef = useRef(minWaterline);
  const depthRef = useRef({ maxWaterDepth, fadeWater });
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
    depthRef.current = { maxWaterDepth, fadeWater };
    sceneRef.current?.setMaxWaterDepth(maxWaterDepth);
    sceneRef.current?.setFadeWater(fadeWater);
    repaintRef.current?.();
  }, [maxWaterDepth, fadeWater]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const scene = createWaveScene(canvas, skyRef.current, settingsRef.current);
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const maxDpr = touch ? TOUCH_MAX_DPR : MAX_DPR;
    /** Time banked toward the next frame when frames are capped. */
    let pending = 0;
    if (!scene) return;
    sceneRef.current = scene;
    scene.setMinWaterline(minWaterlineRef.current);
    scene.setMaxWaterDepth(depthRef.current.maxWaterDepth);
    scene.setFadeWater(depthRef.current.fadeWater);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let onscreen = true;
    let running = false;
    let frames = 0;
    let lastReport = performance.now();
    // The loop and intro wait until the page has loaded and the main thread is
    // idle, so the canvas never competes with the first render on slow phones.
    let ready = false;

    const tick = (_time: number, deltaMs: number) => {
      pending += deltaMs;
      if (touch && pending < TOUCH_FRAME_MS) return;
      scene.frame(Math.min(pending / 1000, MAX_FRAME_SECONDS));
      pending = 0;

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
      const shouldRun = ready && !reduced && onscreen && !document.hidden;
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
        .timeline({ paused: true })
        .to(scene.intro, { grid: 1, duration: 0.7, ease: 'power1.out' }, 0)
        .to(scene.intro, { rise: 1, duration: 1.2, ease: GSAP_EASE }, 0.25)
        .to(scene.intro, { boat: 1, duration: 2.4, ease: 'power2.out' }, 0.8);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.resize(width, height, Math.min(window.devicePixelRatio || 1, maxDpr));
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

    let idleHandle = 0;
    const begin = () => {
      ready = true;
      timeline?.play();
      sync();
    };
    const whenIdle = () => {
      idleHandle =
        typeof window.requestIdleCallback === 'function'
          ? window.requestIdleCallback(begin, { timeout: IDLE_TIMEOUT_MS })
          : window.setTimeout(begin, 1);
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });

    return () => {
      window.removeEventListener('load', whenIdle);
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
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
        <canvas ref={skyRef} aria-hidden="true" className="absolute inset-0 block size-full" />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block size-full" />
      </div>
    </div>
  );
}
