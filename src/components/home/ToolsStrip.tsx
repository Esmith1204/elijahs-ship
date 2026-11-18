import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import type { CSSProperties } from 'react';
import {
  fallbackSpot,
  LOGOS_ASPECT,
  orgSpots,
  TOOL_SIZE,
  toolSpots,
  TOOLS_ASPECT,
} from '@/components/home/toolsLayout';
import type { Spot } from '@/components/home/toolsLayout';
import { Bob } from '@/components/motion/Bob';
import { Repel, RepelField } from '@/components/motion/Repel';
import { MaskedHeading } from '@/components/motion/Reveal';
import { home } from '@/content/home';
import { imageExists } from '@/lib/images';

/** "Claude Code" → "CC", "Figma" → "Fi". Stand-in until the icon file exists. */
function initials(name: string): string {
  const words = name.split(' ');
  return words.length > 1 ? words.map((word) => word[0]).join('') : name.slice(0, 2);
}

/** The cluster reveals once, when it scrolls into view. */
const viewport = { once: true, margin: '0px 0px -10% 0px' } as const;

const cluster: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

/** Each item floats up into place, settling at its depth's opacity. */
const surface: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.8 },
  visible: (depth: number) => ({
    opacity: depth,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 14, mass: 0.9 },
  }),
};

/** Position an item in its cluster box. */
const place = (spot: Spot, width: number): CSSProperties => ({
  left: `${spot.left}%`,
  top: `${spot.top}%`,
  width: `${width}%`,
});

/** Extra lean (degrees) a tool icon takes on hover, in the direction it already leans. */
const TOOL_HOVER_LEAN = 6;
/** On hover a logo eases this fraction of the way toward level. Small on purpose. */
const LOGO_HOVER_LEVEL = 0.3;

/**
 * Resting and hover tilt as CSS variables. Applied through the CSS `rotate`
 * and `scale` properties, which stack with Motion's transforms.
 */
const tiltVars = (rest: number, hover: number) =>
  ({ '--tilt': `${rest}deg`, '--tilt-hover': `${hover}deg` }) as CSSProperties;

const toolTilt = (spot: Spot) =>
  tiltVars(spot.tilt, spot.tilt + Math.sign(spot.tilt || 1) * TOOL_HOVER_LEAN);

const logoTilt = (spot: Spot) => tiltVars(spot.tilt, spot.tilt * (1 - LOGO_HOVER_LEVEL));

/** Tools: grow a little and lean further on hover / keyboard focus. */
const toolHoverClass =
  '[rotate:var(--tilt)] transition-[rotate,scale] duration-300 ease-out-expo hover:[rotate:var(--tilt-hover)] hover:scale-110';

/** Logos: only a slight ease toward level on hover. */
const logoHoverClass =
  '[rotate:var(--tilt)] transition-[rotate] duration-500 ease-out-expo hover:[rotate:var(--tilt-hover)]';

const headingClass = 'text-h2 font-semibold';

/**
 * Tools and orgs, adrift in the water just below the hero. An "elegantly
 * disorganized" cluster (layout in toolsLayout.ts): every item tilts and bobs
 * with the swell. Tools lean in on hover; logos drift slightly away from the mouse.
 */
export function ToolsStrip() {
  const { tools, orgs } = home;

  return (
    <section
      aria-label="Tools and organizations"
      className="mx-auto grid max-w-content gap-x-16 gap-y-16 px-gutter pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:pt-8"
    >
      <div className="flex flex-col gap-8">
        <MaskedHeading className={headingClass}>{tools.heading}</MaskedHeading>
        <motion.ul
          variants={cluster}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          style={{ aspectRatio: TOOLS_ASPECT }}
          className="relative w-full max-w-88"
        >
          {tools.items.map((tool, index) => {
            const spot = toolSpots[tool.name] ?? fallbackSpot(index);
            return (
              <motion.li
                key={tool.name}
                variants={surface}
                custom={spot.depth ?? 1}
                style={place(spot, TOOL_SIZE)}
                className="absolute hover:z-10"
              >
                <Bob phase={(spot.left / 100) * 0.6}>
                  <div
                    role="img"
                    aria-label={tool.name}
                    style={toolTilt(spot)}
                    className={`group/tool relative ${toolHoverClass}`}
                  >
                    {imageExists(tool.icon) ? (
                      <img
                        src={tool.icon}
                        alt=""
                        width={128}
                        height={128}
                        className="block aspect-square h-auto w-full rounded-[22%] shadow-lift"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex aspect-square w-full items-center justify-center rounded-[22%] border border-line-strong bg-surface font-display text-body font-semibold"
                      >
                        {initials(tool.name)}
                      </span>
                    )}
                    {/* Tooltip */}
                    <span
                      aria-hidden="true"
                      className="theme-light pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-tag bg-surface px-2 py-1 text-micro font-medium whitespace-nowrap text-ink opacity-0 shadow-tile transition-opacity duration-200 group-hover/tool:opacity-100"
                    >
                      {tool.name}
                    </span>
                  </div>
                </Bob>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <div className="flex flex-col gap-8">
        <MaskedHeading className={headingClass}>{orgs.heading}</MaskedHeading>
        <RepelField className="w-full max-w-xl">
          <motion.ul
            variants={cluster}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            style={{ aspectRatio: LOGOS_ASPECT }}
            className="relative"
          >
            {orgs.items.map((org, index) => {
              const spot = orgSpots[org.name] ?? fallbackSpot(index, 30);
              return (
                <motion.li
                  key={org.name}
                  variants={surface}
                  custom={spot.depth ?? 0.92}
                  style={place(spot, spot.width ?? 30)}
                  className="absolute"
                >
                  <Bob phase={0.3 + (spot.left / 100) * 0.6}>
                    <Repel>
                      <div style={logoTilt(spot)} className={logoHoverClass}>
                        {imageExists(org.logo) ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="block h-auto w-full object-contain"
                          />
                        ) : (
                          <span className="font-display text-lead font-semibold">{org.name}</span>
                        )}
                      </div>
                    </Repel>
                  </Bob>
                </motion.li>
              );
            })}
          </motion.ul>
        </RepelField>
      </div>
    </section>
  );
}
