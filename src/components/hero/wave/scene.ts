import { resolveColor } from '@/lib/color';
import type { Rgba } from '@/lib/color';
import { drawBoat, HULL_HALF_SPAN, STACK_TOP } from './boat';
import { resolveSettings } from './settings';
import type { WavePalette, WaveSettings } from './settings';
import { clamp01, createWaveField, pushFactor, sampleWave, smoothstep } from './waveMath';
import type { WaveField, WaveSample } from './waveMath';

/**
 * The hero scene: grid, layered water, tugboat and smoke on one 2D canvas.
 * It knows nothing about React or GSAP. The component calls `frame(dt)` from
 * gsap.ticker and tweens the `intro` values.
 */

export type WaveScene = {
  /** Match the canvas to its CSS box. */
  resize: (width: number, height: number, dpr: number) => void;
  setSettings: (settings: WaveSettings) => void;
  /** Re-read the CSS color tokens. */
  refreshColors: () => void;
  /**
   * Keep the waterline at least this many px from the top, so the boat never
   * sails behind content laid over the canvas. 0 = no floor.
   */
  setMinWaterline: (px: number) => void;
  /** Advance the water by `dt` seconds and draw. */
  frame: (dt: number) => void;
  /** Draw one resting frame: the reduced-motion version. */
  drawStill: () => void;
  /** Load sequence, each 0 to 1: grid fades in, water rises, boat sails in. */
  intro: { grid: number; rise: number; boat: number };
};

/** Pixels between surface samples. */
const STEP = 6;
/** Overscan past each edge so the push never exposes a gap. */
const PAD = 60;
/** A gradient stop every N samples (12px) carries the stroke opacity. */
const STOP_EVERY = 2;
const ALPHA_LEVELS = 40;
const GRID_BUCKETS = 14;
/** The grid fades in over this many px from the top edge. */
const GRID_TOP_FADE = 96;
/** How quickly the boat's lean catches up with the slope (per second). */
const TILT_RESPONSE = 5;
const MAX_TILT = 0.42;
/** Time and position used for the still frame. */
const STILL_TIME = 3.2;
const STILL_BOAT_X = 0.3;
/** Where the boat settles after sailing in, as a fraction of the width. */
const INTRO_BOAT_X = 0.2;
/** The sky stays deep until this fraction of its height, then brightens to the horizon. */
const SKY_HOLD = 0.8;
const SMOKE_INTERVAL = 0.95;
const SMOKE_LIFE = 2.2;
/** Peak opacity of a fresh puff. */
const SMOKE_ALPHA = 0.5;
/** Boat and smoke outline width before scaling. Matches the wave's weight. */
const BOAT_LINE = 1.6;
const SMOKE_LINE = 1;
/** The boat's outline is a touch softer than solid. */
const BOAT_STROKE_ALPHA = 0.9;
/** Never push the water closer than this to the bottom edge. */
const MIN_WATER_DEPTH = 40;

/** Index 0 is the main line. The others sit behind it with parallax. */
const LAYERS = [
  { amp: 1, wavelength: 1, speed: 1, lift: 0, alpha: 1, width: 1 },
  { amp: 0.62, wavelength: 0.78, speed: 0.8, lift: 0.9, alpha: 0.5, width: 0.7 },
  { amp: 0.4, wavelength: 0.6, speed: 0.62, lift: 1.7, alpha: 0.28, width: 0.55 },
] as const;

/** Which CSS token feeds each part, per palette. */
const PALETTE_TOKENS: Record<
  WavePalette,
  {
    sky: [string, string, string] | null;
    water: string;
    stroke: string;
    grid: string;
    boatFill: string;
    boatStroke: string;
  }
> = {
  light: {
    sky: null,
    water: '--surface',
    stroke: '--ink',
    grid: '--ink',
    boatFill: '--surface',
    boatStroke: '--ink-base',
  },
  blue: {
    sky: ['--sky-top', '--sky-mid', '--sky-bottom'],
    water: '--water-deep',
    stroke: '--on-accent',
    grid: '--on-accent',
    boatFill: '--boat-fill',
    boatStroke: '--on-accent',
  },
};

type Colors = {
  sky: [string, string, string] | null;
  water: string;
  /** Stroke color at each quantised opacity. */
  strokeLevels: string[];
  grid: Rgba;
  boatFill: string;
  boatStroke: string;
};

type Surface = {
  field: WaveField;
  push: number;
  baseline: number;
  xs: Float32Array;
  ys: Float32Array;
  /** 0 (trough / falling) to 1 (crest / rising): drives stroke and grid opacity. */
  levels: Float32Array;
};

type Puff = { x: number; y: number; vx: number; vy: number; age: number };

const FALLBACK: Rgba = { r: 0, g: 0, b: 0, a: 1 };

function rgba(color: Rgba, alpha: number): string {
  return `rgba(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)},${alpha.toFixed(3)})`;
}

function token(name: string): Rgba {
  return resolveColor(`var(${name})`) ?? FALLBACK;
}

function readColors(palette: WavePalette): Colors {
  const tokens = PALETTE_TOKENS[palette];
  const stroke = token(tokens.stroke);
  return {
    sky: tokens.sky
      ? [
          rgba(token(tokens.sky[0]), 1),
          rgba(token(tokens.sky[1]), 1),
          rgba(token(tokens.sky[2]), 1),
        ]
      : null,
    water: rgba(token(tokens.water), 1),
    strokeLevels: Array.from({ length: ALPHA_LEVELS + 1 }, (_, level) =>
      rgba(stroke, level / ALPHA_LEVELS),
    ),
    grid: token(tokens.grid),
    boatFill: rgba(token(tokens.boatFill), 1),
    boatStroke: rgba(token(tokens.boatStroke), BOAT_STROKE_ALPHA),
  };
}

export function createWaveScene(
  canvas: HTMLCanvasElement,
  initial: WaveSettings,
): WaveScene | null {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const ctx: CanvasRenderingContext2D = context;

  let raw = initial;
  let settings = initial;
  let colors = readColors(initial.palette);
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;
  let minWaterline = 0;

  let surfaces: Surface[] = [];
  const gridBuckets: number[][] = Array.from({ length: GRID_BUCKETS + 1 }, () => []);

  const boat = { x: 0, y: 0, angle: 0, drift: 0, launched: false };
  const puffs: Puff[] = [];
  let smokeTimer = 0;

  const intro = { grid: 1, rise: 1, boat: 1 };
  const stern: WaveSample = { x: 0, y: 0, vy: 0 };
  const middle: WaveSample = { x: 0, y: 0, vy: 0 };
  const bow: WaveSample = { x: 0, y: 0, vy: 0 };
  const point: WaveSample = { x: 0, y: 0, vy: 0 };

  /** Rebuild everything derived from settings and size. */
  function configure() {
    settings = resolveSettings(raw, width);
    const count = Math.ceil((width + PAD * 2) / STEP) + 1;
    const layerCount = Math.max(1, Math.min(LAYERS.length, Math.round(settings.layers)));

    surfaces = LAYERS.slice(0, layerCount).map((layer, index) => {
      const field = createWaveField(
        settings.amplitude * layer.amp,
        settings.wavelength * layer.wavelength,
        index,
        layer.speed,
      );
      return {
        field,
        push: pushFactor(field, settings.choppiness),
        baseline: 0,
        xs: new Float32Array(count),
        ys: new Float32Array(count),
        levels: new Float32Array(count),
      };
    });
  }

  function boatMargin() {
    return 60 * settings.boatScale + 40;
  }

  /** Sample every layer's surface at the current time. */
  function updateSurfaces() {
    const rise = intro.rise;
    // During the intro the water comes up from below the canvas.
    const sunk = (1 - rise) * (height * (1 - settings.waterline) + settings.amplitude + 8);
    const rest = Math.min(
      Math.max(height * settings.waterline, minWaterline),
      height - MIN_WATER_DEPTH,
    );
    const mainBaseline = rest + sunk;

    surfaces.forEach((surface, index) => {
      const { field, push, xs, ys, levels } = surface;
      surface.baseline = mainBaseline - LAYERS[index].lift * settings.amplitude * rise;

      for (let i = 0; i < xs.length; i++) {
        sampleWave(field, -PAD + i * STEP, time, push, point);
        xs[i] = point.x;
        ys[i] = surface.baseline - point.y * rise;

        const heightPart = field.maxHeight ? point.y / field.maxHeight : 0;
        const speedPart = field.maxVelocity ? point.vy / field.maxVelocity : 0;
        const mixed = (1 - settings.velocityMix) * heightPart + settings.velocityMix * speedPart;
        // Four summed sines rarely reach ±1, so stretch the middle of the range.
        levels[i] = smoothstep(0, 1, 0.5 + 0.75 * mixed);
      }
    });
  }

  function drawSky() {
    ctx.clearRect(0, 0, width, height);
    if (!colors.sky) return;
    const gradient = ctx.createLinearGradient(0, 0, 0, height * settings.waterline);
    gradient.addColorStop(0, colors.sky[0]);
    gradient.addColorStop(SKY_HOLD, colors.sky[1]);
    gradient.addColorStop(1, colors.sky[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Figma-style grid above the water. Every cell has a faint base opacity;
   * cells beside a passing crest brighten, fading with distance from the surface.
   */
  function drawGrid() {
    const main = surfaces[0];
    const cell = settings.gridCell;
    const maxAlpha = Math.min(1, settings.gridBase + settings.gridBoost);
    if (!main || cell < 4 || maxAlpha * intro.grid < 0.003) return;

    for (const bucket of gridBuckets) bucket.length = 0;
    const last = main.xs.length - 1;

    for (let x = 0; x < width; x += cell) {
      const index = Math.min(last, Math.max(0, Math.round((x + cell / 2 + PAD) / STEP)));
      const surfaceY = main.ys[index];
      const crest = smoothstep(0.45, 1, main.levels[index]);

      for (let y = 0; y < surfaceY; y += cell) {
        const distance = Math.max(0, surfaceY - (y + cell / 2));
        const nearness = Math.exp(-distance / settings.gridReach);
        const fade = smoothstep(0, GRID_TOP_FADE, y + cell / 2);
        const alpha = (settings.gridBase + settings.gridBoost * crest * nearness) * fade;
        const bucket = Math.round((alpha / maxAlpha) * GRID_BUCKETS);
        if (bucket > 0) gridBuckets[bucket].push(x, y);
      }
    }

    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    for (let bucket = 1; bucket <= GRID_BUCKETS; bucket++) {
      const cells = gridBuckets[bucket];
      if (cells.length === 0) continue;
      ctx.beginPath();
      for (let i = 0; i < cells.length; i += 2) {
        const x = cells[i] + 0.5;
        const y = cells[i + 1] + 0.5;
        // Left and top edge of the cell.
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x, y);
        ctx.lineTo(x + cell, y);
      }
      ctx.strokeStyle = rgba(colors.grid, (maxAlpha * bucket * intro.grid) / GRID_BUCKETS);
      ctx.stroke();
    }
  }

  function traceSurface({ xs, ys }: Surface) {
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
  }

  /** Fill the water body, then stroke the surface with breathing opacity. */
  function drawSurface(surface: Surface, layerIndex: number) {
    const layer = LAYERS[layerIndex];
    const { xs, levels } = surface;
    const last = xs.length - 1;

    traceSurface(surface);
    ctx.lineTo(xs[last], height + 2);
    ctx.lineTo(xs[0], height + 2);
    ctx.closePath();
    ctx.fillStyle = colors.water;
    ctx.fill();

    // Opacity varies along x, so one horizontal gradient carries it for the whole line.
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const range = settings.strokeMax - settings.strokeMin;
    let previous = -1;
    for (let i = 0; i <= last; i += STOP_EVERY) {
      const offset = xs[i] / width;
      if (offset < 0 || offset > 1 || offset <= previous) continue;
      previous = offset;
      const alpha = clamp01((settings.strokeMin + range * levels[i]) * layer.alpha);
      gradient.addColorStop(offset, colors.strokeLevels[Math.round(alpha * ALPHA_LEVELS)]);
    }

    traceSurface(surface);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(0.5, settings.strokeWidth * layer.width);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  /** Rest the hull on the main surface and lean it with the slope. */
  function updateBoat(dt: number, settle: boolean) {
    const main = surfaces[0];
    if (!main) return;
    const span = HULL_HALF_SPAN * settings.boatScale;
    const rise = intro.rise;

    // Sampling under the stern and bow averages out ripples shorter than the hull.
    sampleWave(main.field, boat.x - span, time, main.push, stern);
    sampleWave(main.field, boat.x, time, main.push, middle);
    sampleWave(main.field, boat.x + span, time, main.push, bow);

    boat.drift = middle.x;
    boat.y = main.baseline - ((stern.y + middle.y * 2 + bow.y) / 4) * rise;

    const target = Math.atan2(-(bow.y - stern.y) * rise, bow.x - stern.x) * settings.boatTilt;
    const clamped = Math.max(-MAX_TILT, Math.min(MAX_TILT, target));
    const blend = settle ? 1 : 1 - Math.exp(-dt * TILT_RESPONSE);
    boat.angle += (clamped - boat.angle) * blend;
  }

  function stackTop() {
    const cos = Math.cos(boat.angle);
    const sin = Math.sin(boat.angle);
    const x = STACK_TOP.x * settings.boatScale;
    const y = STACK_TOP.y * settings.boatScale;
    return { x: boat.drift + x * cos - y * sin, y: boat.y + x * sin + y * cos };
  }

  function updateSmoke(dt: number) {
    for (let i = puffs.length - 1; i >= 0; i--) {
      const puff = puffs[i];
      puff.age += dt;
      puff.x += puff.vx * dt;
      puff.y += puff.vy * dt;
      if (puff.age >= SMOKE_LIFE) puffs.splice(i, 1);
    }

    if (!settings.smoke || intro.boat < 0.15) return;
    smokeTimer += dt;
    if (smokeTimer < SMOKE_INTERVAL) return;
    smokeTimer = 0;
    const top = stackTop();
    puffs.push({
      x: top.x,
      y: top.y,
      // Puffs trail behind the boat and wander a little.
      vx: -(6 + settings.boatSpeed * 0.35) + (Math.random() - 0.5) * 6,
      vy: -(14 + Math.random() * 5),
      age: 0,
    });
  }

  function drawPuff(x: number, y: number, progress: number) {
    ctx.globalAlpha = (1 - progress) ** 1.5 * SMOKE_ALPHA;
    ctx.beginPath();
    ctx.arc(x, y, (2 + 5 * progress) * settings.boatScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function drawSmoke(still: boolean) {
    if (!settings.smoke) return;
    ctx.fillStyle = colors.boatFill;
    ctx.strokeStyle = colors.boatStroke;
    ctx.lineWidth = SMOKE_LINE;

    if (still) {
      // Three fixed puffs so the resting boat still looks alive.
      const top = stackTop();
      const scale = settings.boatScale;
      drawPuff(top.x - 4 * scale, top.y - 8 * scale, 0.2);
      drawPuff(top.x - 12 * scale, top.y - 18 * scale, 0.5);
    } else {
      for (const puff of puffs) drawPuff(puff.x, puff.y, puff.age / SMOKE_LIFE);
    }
    ctx.globalAlpha = 1;
  }

  function draw(still: boolean) {
    if (width === 0 || height === 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawSky();
    drawGrid();
    // Back to front. The main water is drawn after the boat so the hull sits in it.
    for (let i = surfaces.length - 1; i >= 1; i--) drawSurface(surfaces[i], i);
    drawSmoke(still);
    drawBoat(
      ctx,
      boat.drift,
      boat.y,
      boat.angle,
      settings.boatScale,
      colors.boatFill,
      colors.boatStroke,
      BOAT_LINE,
    );
    if (surfaces[0]) drawSurface(surfaces[0], 0);
  }

  return {
    intro,

    resize(nextWidth, nextHeight, nextDpr) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      configure();
    },

    setSettings(next) {
      const paletteChanged = next.palette !== raw.palette;
      raw = next;
      if (paletteChanged) colors = readColors(next.palette);
      configure();
    },

    refreshColors() {
      colors = readColors(raw.palette);
    },

    setMinWaterline(px) {
      minWaterline = px;
    },

    frame(dt) {
      time += dt * settings.speed;
      const margin = boatMargin();

      if (intro.boat < 1) {
        // Sailing in: GSAP eases the boat from off-canvas to its starting spot.
        boat.x = -margin + (width * INTRO_BOAT_X + margin) * intro.boat;
        boat.launched = false;
      } else {
        if (!boat.launched) {
          boat.launched = true;
          boat.x = width * INTRO_BOAT_X;
        }
        boat.x += settings.boatSpeed * dt;
        // Sail off the right edge, come back on the left: no visible jump.
        if (boat.x > width + margin) boat.x = -margin;
      }

      updateSurfaces();
      updateBoat(dt, false);
      updateSmoke(dt);
      draw(false);
    },

    drawStill() {
      time = STILL_TIME;
      boat.x = width * STILL_BOAT_X;
      updateSurfaces();
      updateBoat(0, true);
      // At rest the boat leans less than the live slope would have it.
      boat.angle *= 0.6;
      draw(true);
    },
  };
}
