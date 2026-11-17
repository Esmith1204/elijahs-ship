/**
 * Everything tunable about the hero wave. Dial values in at /lab/wave, press
 * "Copy settings", and paste the result over `defaultWaveSettings` below.
 */

export type WavePalette = 'light' | 'blue';

export type WaveSettings = {
  /** Height of the main swell in px. */
  amplitude: number;
  /** Length of the longest swell in px. Shorter swells scale with it. */
  wavelength: number;
  /** Time multiplier. 0 freezes the water. */
  speed: number;
  /** 0 = smooth sine, 1 = sharp Gerstner crests. */
  choppiness: number;
  /** Wave lines drawn, 1 to 3. Extra lines sit behind the main one. */
  layers: number;
  /** Where the water sits, as a fraction of the canvas height from the top. */
  waterline: number;

  /** Stroke opacity in the troughs. */
  strokeMin: number;
  /** Stroke opacity on the crests. */
  strokeMax: number;
  /** Stroke width of the main line in px. */
  strokeWidth: number;
  /** 0 = opacity follows height only, 1 = follows vertical speed only. */
  velocityMix: number;

  /** Grid cell size in px. */
  gridCell: number;
  /** Grid opacity everywhere. */
  gridBase: number;
  /** Extra grid opacity next to a passing crest. */
  gridBoost: number;
  /** How far above the water the crest glow reaches, in px. */
  gridReach: number;

  /** Tugboat size multiplier. */
  boatScale: number;
  /** Drift speed in px per second. */
  boatSpeed: number;
  /** How strongly the boat leans with the slope. */
  boatTilt: number;
  /** Puffs from the stack. */
  smoke: boolean;

  /** `light` is the brief. `blue` is the reference-poster version. */
  palette: WavePalette;
};

export const defaultWaveSettings: WaveSettings = {
  amplitude: 15,
  wavelength: 610,
  speed: 1.2,
  choppiness: 0,
  layers: 1,
  waterline: 0.67,

  strokeMin: 0.25,
  strokeMax: 0.34,
  strokeWidth: 1.75,
  velocityMix: 0.4,

  gridCell: 36,
  gridBase: 0.035,
  gridBoost: 0.2,
  gridReach: 220,

  boatScale: 0.85,
  boatSpeed: 62,
  boatTilt: 0.95,
  smoke: true,

  palette: 'blue',
};

/** Below this canvas width the scene simplifies (fewer lines, lower swell). */
export const MOBILE_BREAKPOINT = 640;

/** Mobile gets fewer layers, a lower swell and a smaller boat. */
export function resolveSettings(settings: WaveSettings, width: number): WaveSettings {
  if (width >= MOBILE_BREAKPOINT) return settings;
  return {
    ...settings,
    amplitude: settings.amplitude * 0.6,
    wavelength: settings.wavelength * 0.6,
    layers: Math.min(settings.layers, 2),
    boatScale: settings.boatScale * 0.8,
    boatSpeed: settings.boatSpeed * 0.7,
  };
}

type NumericKey = {
  [K in keyof WaveSettings]: WaveSettings[K] extends number ? K : never;
}[keyof WaveSettings];

export type SliderControl = {
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
};

export type ControlGroup = { title: string; controls: SliderControl[] };

/** Slider definitions for the tuning panel. */
export const controlGroups: ControlGroup[] = [
  {
    title: 'Wave',
    controls: [
      { key: 'amplitude', label: 'Amplitude', min: 2, max: 60, step: 1, unit: 'px' },
      { key: 'wavelength', label: 'Wavelength', min: 300, max: 1600, step: 10, unit: 'px' },
      { key: 'speed', label: 'Speed', min: 0, max: 2.5, step: 0.05, unit: '×' },
      { key: 'choppiness', label: 'Choppiness', min: 0, max: 1, step: 0.05 },
      { key: 'layers', label: 'Layers', min: 1, max: 3, step: 1 },
      { key: 'waterline', label: 'Waterline', min: 0.3, max: 0.9, step: 0.01 },
    ],
  },
  {
    title: 'Stroke',
    controls: [
      { key: 'strokeMin', label: 'Opacity in troughs', min: 0, max: 1, step: 0.01 },
      { key: 'strokeMax', label: 'Opacity on crests', min: 0, max: 1, step: 0.01 },
      { key: 'strokeWidth', label: 'Width', min: 0.5, max: 4, step: 0.25, unit: 'px' },
      { key: 'velocityMix', label: 'Height ↔ speed', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Grid',
    controls: [
      { key: 'gridCell', label: 'Cell size', min: 16, max: 64, step: 1, unit: 'px' },
      { key: 'gridBase', label: 'Base opacity', min: 0, max: 0.2, step: 0.005 },
      { key: 'gridBoost', label: 'Crest boost', min: 0, max: 0.5, step: 0.01 },
      { key: 'gridReach', label: 'Reach', min: 40, max: 500, step: 10, unit: 'px' },
    ],
  },
  {
    title: 'Tugboat',
    controls: [
      { key: 'boatScale', label: 'Size', min: 0.5, max: 2, step: 0.05, unit: '×' },
      { key: 'boatSpeed', label: 'Drift', min: 0, max: 80, step: 1, unit: 'px/s' },
      { key: 'boatTilt', label: 'Tilt', min: 0, max: 1.5, step: 0.05 },
    ],
  },
];
