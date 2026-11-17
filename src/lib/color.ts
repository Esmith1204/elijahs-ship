/** Color helpers used by the styleguide to read tokens and check contrast live. */

export type Rgba = { r: number; g: number; b: number; a: number };

/** The authored value of a CSS custom property on :root, e.g. "#f4f5f9". */
export function readToken(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

/** Resolve any CSS color (including var() and color-mix()) to RGBA 0-255. */
export function resolveColor(cssColor: string): Rgba | null {
  const probe = document.createElement('span');
  probe.style.color = cssColor;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  return parseComputedColor(computed);
}

function parseComputedColor(value: string): Rgba | null {
  const numbers = value.match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number);
  if (!numbers || numbers.length < 3) return null;
  const [r, g, b, a = 1] = numbers;
  // color(srgb r g b / a) reports channels as 0-1; rgb()/rgba() as 0-255.
  const scale = value.startsWith('color(') ? 255 : 1;
  return { r: r * scale, g: g * scale, b: b * scale, a };
}

export function toHex({ r, g, b }: Rgba): string {
  const channel = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

function luminance({ r, g, b }: Rgba): number {
  const linear = (n: number) => {
    const s = n / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG 2.1 contrast ratio between two opaque colors. */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
