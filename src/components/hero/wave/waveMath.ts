/**
 * Water as a sum of Gerstner-style components. Each component is a travelling
 * sine; the horizontal push (choppiness) bunches points toward the crests so
 * they read as water, not as a sine curve. Wavelengths are incommensurate, so
 * the surface never visibly repeats.
 */

export type WaveComponent = {
  /** Wavenumber, 2π / wavelength. */
  k: number;
  amp: number;
  /** Angular speed. Sign is the travel direction. */
  omega: number;
  phase: number;
};

export type WaveField = {
  components: WaveComponent[];
  /** Sum of amplitudes: the tallest possible crest. */
  maxHeight: number;
  /** Sum of amp × |omega|: the fastest possible vertical speed. */
  maxVelocity: number;
  /** Sum of amp × k. The horizontal push must stay under 1 / steepness or crests loop. */
  steepness: number;
};

export type WaveSample = {
  /** Screen x after the horizontal push. */
  x: number;
  /** Height above the resting waterline (positive is up). */
  y: number;
  /** Vertical speed (positive is rising). */
  vy: number;
};

/** Relative wavelength, amplitude and direction of each component. */
const RECIPE = [
  { wavelength: 1, amp: 1, direction: 1, phase: 0 },
  { wavelength: 0.47, amp: 0.5, direction: 1, phase: 1.7 },
  { wavelength: 0.26, amp: 0.26, direction: -1, phase: 4.1 },
  { wavelength: 0.135, amp: 0.12, direction: 1, phase: 2.6 },
] as const;

/**
 * Deep-water dispersion: speed grows with the square root of wavelength, so
 * long swells outrun short ripples. Tuned so an 880px swell takes ~6s to pass.
 */
const DISPERSION = 12;

const AMP_TOTAL = RECIPE.reduce((sum, part) => sum + part.amp, 0);

export function createWaveField(
  amplitude: number,
  wavelength: number,
  /** Offsets the phases so each layer is its own piece of water. */
  seed = 0,
  /** Slows a layer down for parallax. */
  speedScale = 1,
): WaveField {
  const components = RECIPE.map((part, index) => {
    const k = (Math.PI * 2) / (wavelength * part.wavelength);
    return {
      k,
      // Normalised so `amplitude` is the tallest possible crest.
      amp: (amplitude * part.amp) / AMP_TOTAL,
      omega: part.direction * DISPERSION * Math.sqrt(k) * speedScale,
      phase: part.phase + seed * (index + 1) * 1.37,
    };
  });

  return {
    components,
    maxHeight: components.reduce((sum, c) => sum + c.amp, 0),
    maxVelocity: components.reduce((sum, c) => sum + c.amp * Math.abs(c.omega), 0),
    steepness: components.reduce((sum, c) => sum + c.amp * c.k, 0),
  };
}

/** How hard the 0-1 choppiness setting pushes before the safety cap. */
const PUSH_GAIN = 2.5;
/** Fraction of the looping limit the push may reach. */
const PUSH_LIMIT = 0.9;

/** Turn the 0-1 choppiness setting into a push factor that can never loop a crest. */
export function pushFactor(field: WaveField, choppiness: number): number {
  if (field.steepness === 0) return 0;
  return Math.min(choppiness * PUSH_GAIN, PUSH_LIMIT / field.steepness);
}

/**
 * Evaluate the surface at rest-position `x0` and time `t`. Writes into `out`.
 * `push` comes from `pushFactor`.
 */
export function sampleWave(
  field: WaveField,
  x0: number,
  t: number,
  push: number,
  out: WaveSample,
): WaveSample {
  let shift = 0;
  let y = 0;
  let vy = 0;

  for (const c of field.components) {
    const theta = c.k * x0 - c.omega * t + c.phase;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    y += c.amp * sin;
    shift += c.amp * cos;
    vy -= c.amp * c.omega * cos;
  }

  out.x = x0 + shift * push;
  out.y = y;
  out.vy = vy;
  return out;
}

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
