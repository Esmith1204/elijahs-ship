import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { HeroWave } from '@/components/hero/HeroWave';
import { defaultWaveSettings } from '@/components/hero/wave/settings';
import type { WaveSettings } from '@/components/hero/wave/settings';
import { MaskedHeading } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { heroStatement, home } from '@/content/home';
import { site } from '@/content/site';
import { DURATION, EASE_OUT, RISE } from '@/lib/motion';

/** The wave follows the site theme. Everything else comes from the tuned defaults. */
const waveSettings: WaveSettings = { ...defaultWaveSettings, palette: site.theme };

/**
 * Load sequence, in seconds. The canvas runs its own part (grid, water, boat);
 * these are the DOM beats layered over it.
 */
const NAME_AT = 0.15;
const COPY_AT = 0.7;
const PEN_AT = 1.3;

/** Room between the buttons and the water for the boat and its smoke, in px. */
const BOAT_CLEARANCE = 104;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: RISE },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT, delay },
});

/** Hero: the name inside a pen-drawn Figma selection, above the living wave. */
export function Hero() {
  const { hero } = home;
  const actionsRef = useRef<HTMLDivElement>(null);
  const [minWaterline, setMinWaterline] = useState(0);

  // Wherever the text ends (it wraps differently at every width), the water
  // sits below it, so the boat is never hidden behind the buttons.
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) return;
    const measure = () =>
      setMinWaterline(actions.offsetTop + actions.offsetHeight + BOAT_CLEARANCE);
    const observer = new ResizeObserver(measure);
    observer.observe(actions);
    if (actions.offsetParent) observer.observe(actions.offsetParent);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Introduction"
      className="relative isolate flex min-h-hero flex-col overflow-hidden"
    >
      <HeroWave
        settings={waveSettings}
        minWaterline={minWaterline}
        className="absolute inset-0 -z-10"
      />

      {/* The bottom padding is the open water the boat sails on. */}
      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-6 px-gutter pt-nav pb-80">
        <SelectionBox mode="draw" delay={PEN_AT}>
          {/* overflow-hidden is the reveal mask; the bottom padding keeps the "j" inside it. */}
          <MaskedHeading
            as="h1"
            immediate
            delay={NAME_AT}
            className="overflow-hidden px-2 pb-4 text-hero font-semibold"
          >
            {site.name}
          </MaskedHeading>
        </SelectionBox>

        <motion.p {...rise(COPY_AT)} className="mt-6 max-w-prose text-lead font-medium">
          {heroStatement}
        </motion.p>

        <motion.div ref={actionsRef} {...rise(COPY_AT + 0.1)} className="flex flex-wrap gap-3">
          <Button href="#work" size="lg">
            {hero.primaryCta}
          </Button>
          <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
            {hero.secondaryCta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
