import type { Transition, Variants } from 'motion/react';

/**
 * Motion language: "noticeable, never overbearing".
 * Mirrors the --ease / --duration tokens in src/styles/index.css.
 */

/** Motion (the library) ease. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** GSAP equivalent, for timelines and the hero scene. */
export const GSAP_EASE = 'power3.out';

/** Seconds. */
export const DURATION = {
  fast: 0.3,
  base: 0.45,
  slow: 0.6,
} as const;

/** Seconds between staggered children. */
export const STAGGER = 0.06;

/** Pixels an element rises as it fades in. */
export const RISE = 20;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE_OUT,
};

/** Parent that staggers its children in. Pair with `revealItem`. */
export const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER },
  },
};

/** Fade + rise. Reduced-motion users get the fade only (see MotionConfig in App). */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: { opacity: 1, y: 0, transition },
};
