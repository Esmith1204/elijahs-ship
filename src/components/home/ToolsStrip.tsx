import { motion } from 'motion/react';
import { Bob } from '@/components/motion/Bob';
import { Reveal } from '@/components/motion/Reveal';
import { home } from '@/content/home';
import { imageExists } from '@/lib/images';
import { DURATION, EASE_OUT } from '@/lib/motion';

/** "Claude Code" → "CC", "Figma" → "Fi". Stand-in until the icon file exists. */
function initials(name: string): string {
  const words = name.split(' ');
  return words.length > 1 ? words.map((word) => word[0]).join('') : name.slice(0, 2);
}

/**
 * Phase for item `index` of `count`, with the right-hand column starting half
 * a swell later, so both rows ride the same wave moving left to right.
 */
const phaseOf = (index: number, count: number, offset = 0) =>
  offset + (index / Math.max(count, 1)) * 0.5;

const headingClass = 'font-display text-h3 font-semibold';

/**
 * Tools row and orgs row, floating in the water just under the wave.
 * Headings, icons and logos all bob. Nothing here is draggable.
 */
export function ToolsStrip() {
  const { tools, orgs } = home;

  return (
    <section
      aria-label="Tools and organizations"
      // Pulled up into the hero so the strip sits in the water under the wave.
      className="relative z-10 mx-auto -mt-40 grid max-w-content gap-14 px-gutter pt-8 lg:-mt-48 lg:grid-cols-2"
    >
      <Reveal className="flex flex-col gap-6">
        <Bob>
          <h2 className={headingClass}>{tools.heading}</h2>
        </Bob>
        <ul className="flex flex-wrap gap-3">
          {tools.items.map((tool, index) => (
            // Outer element bobs, inner element lifts on hover: one animation each.
            <Bob as="li" key={tool.name} phase={phaseOf(index + 1, tools.items.length)}>
              <motion.div
                role="img"
                aria-label={tool.name}
                tabIndex={0}
                whileHover={{ y: -6 }}
                whileFocus={{ y: -6 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="group/tool relative flex size-14 items-center justify-center"
              >
                {imageExists(tool.icon) ? (
                  <img
                    src={tool.icon}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 rounded-tile-sm shadow-tile"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-14 items-center justify-center rounded-tile-sm border border-line-strong bg-surface font-display text-body font-semibold"
                  >
                    {initials(tool.name)}
                  </span>
                )}
                {/* Tooltip */}
                <span
                  aria-hidden="true"
                  className="theme-light pointer-events-none absolute top-full z-10 mt-2 rounded-tag bg-surface px-2 py-1 text-micro font-medium whitespace-nowrap text-ink opacity-0 shadow-tile transition-opacity duration-200 group-hover/tool:opacity-100 group-focus-visible/tool:opacity-100"
                >
                  {tool.name}
                </span>
              </motion.div>
            </Bob>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-6">
        <Bob phase={0.5}>
          <h2 className={headingClass}>{orgs.heading}</h2>
        </Bob>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-5">
          {orgs.items.map((org, index) => (
            <Bob as="li" key={org.name} phase={phaseOf(index + 1, orgs.items.length, 0.5)}>
              {imageExists(org.logo) ? (
                <img
                  src={org.logo}
                  alt={org.name}
                  height={32}
                  className="h-8 w-auto max-w-56 object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                />
              ) : (
                <span className="font-display text-lead font-semibold text-ink-muted transition-colors duration-300 hover:text-ink">
                  {org.name}
                </span>
              )}
            </Bob>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
