import { Tag } from '@/components/ui/Tag';
import { contrastRatio, readToken, resolveColor, toHex } from '@/lib/color';
import { GuideBlock, GuideSection } from './GuideSection';
import { colorTokens, contrastPairs } from './tokens';
import type { ColorToken } from './tokens';
import { useLiveTokens } from './useLiveTokens';

type Swatch = ColorToken & { value: string; hex: string | null };
type ContrastRow = (typeof contrastPairs)[number] & { ratio: number | null };

function readSwatches(): Swatch[] {
  return colorTokens.map((entry) => {
    const value = readToken(entry.token);
    const resolved = entry.token === '--gradient' ? null : resolveColor(`var(${entry.token})`);
    const isPlainHex = value.startsWith('#');
    return {
      ...entry,
      value,
      // Only print a resolved hex when it adds information.
      hex: resolved && resolved.a === 1 && !isPlainHex ? toHex(resolved) : null,
    };
  });
}

function readContrast(): ContrastRow[] {
  return contrastPairs.map((pair) => {
    const fg = resolveColor(`var(${pair.fg})`);
    const bg = resolveColor(`var(${pair.bg})`);
    if (!fg || !bg) return { ...pair, ratio: null };
    // Flatten translucent foregrounds (e.g. --line-strong) onto the background.
    const flat = {
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    };
    return { ...pair, ratio: contrastRatio(flat, bg) };
  });
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  const fill =
    swatch.token === '--gradient'
      ? { backgroundImage: `var(${swatch.token})` }
      : { backgroundColor: `var(${swatch.token})` };

  return (
    <li className="flex flex-col overflow-hidden rounded-tile-sm border border-line bg-surface">
      {/* Checkerboard-free: translucent tokens sit on the surface they are used on. */}
      <div className="h-24 border-b border-line" style={fill} />
      <div className="flex flex-col gap-1 p-4">
        <code className="text-small font-medium text-ink">{swatch.token}</code>
        <code className="text-micro break-words text-ink-muted">
          {swatch.value}
          {swatch.hex && ` → ${swatch.hex}`}
        </code>
        <p className="text-small text-ink-muted">{swatch.use}</p>
      </div>
    </li>
  );
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {swatches.map((swatch) => (
        <SwatchCard key={swatch.token} swatch={swatch} />
      ))}
    </ul>
  );
}

export function ColorSection() {
  const swatches = useLiveTokens(readSwatches);
  const contrast = useLiveTokens(readContrast);

  return (
    <GuideSection
      id="color"
      index="01"
      title="Color"
      intro="The page stays light. Purple and blue are accents: highlights, tags, CTAs, selected states and the occasional tinted tile."
    >
      <GuideBlock title="Core tokens" note="Straight from the brief.">
        <SwatchGrid swatches={swatches.filter((swatch) => swatch.group === 'core')} />
      </GuideBlock>

      <GuideBlock
        title="Extensions"
        note="Added in Phase 1. The tints are mixed from the accents, so changing --purple or --blue updates them too."
      >
        <SwatchGrid swatches={swatches.filter((swatch) => swatch.group === 'extension')} />
      </GuideBlock>

      <GuideBlock
        title="Contrast"
        note="Measured live from the stylesheet against WCAG 2.1 AA. Text needs 4.5:1. Decorative pairs are listed for reference and are never the only cue."
      >
        <div className="overflow-x-auto rounded-tile-sm border border-line bg-surface">
          <table className="w-full min-w-xl text-left text-small">
            <thead>
              <tr className="border-b border-line text-label text-ink-muted uppercase">
                <th scope="col" className="px-4 py-3 font-medium">
                  Sample
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Pair
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Used for
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Ratio
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {contrast.map((row) => {
                const passes = row.ratio !== null && row.ratio >= row.min;
                return (
                  <tr key={`${row.fg}${row.bg}`} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 items-center justify-center rounded-tag border border-line font-display text-body font-semibold"
                        style={{ color: `var(${row.fg})`, backgroundColor: `var(${row.bg})` }}
                      >
                        Aa
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-micro">
                        {row.fg} on {row.bg}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{row.use}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {row.ratio ? `${row.ratio.toFixed(2)}:1` : 'n/a'}
                    </td>
                    <td className="px-4 py-3">
                      {row.decorative ? (
                        <Tag>Decorative</Tag>
                      ) : passes ? (
                        <Tag tone="blue">AA pass</Tag>
                      ) : (
                        <Tag tone="gradient">Fails {row.min}:1</Tag>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GuideBlock>
    </GuideSection>
  );
}
