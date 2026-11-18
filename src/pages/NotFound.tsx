import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { HeroWave } from '@/components/hero/HeroWave';
import { useWaterlineBelow } from '@/components/hero/useWaterlineBelow';
import { defaultWaveSettings } from '@/components/hero/wave/settings';
import type { WaveSettings } from '@/components/hero/wave/settings';
import { MaskedHeading } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { notFoundPage } from '@/content/pages';
import { site } from '@/content/site';
import { DURATION, EASE_OUT, RISE } from '@/lib/motion';

const waveSettings: WaveSettings = { ...defaultWaveSettings, palette: site.theme };

/** Room between the buttons and the water for the boat, in px. */
const BOAT_CLEARANCE = 96;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: RISE },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT, delay },
});

/** 404: the boat is still out there, just not where you were looking. */
export default function NotFound() {
  const actionsRef = useRef<HTMLDivElement>(null);
  const minWaterline = useWaterlineBelow(actionsRef, BOAT_CLEARANCE);

  useEffect(() => {
    document.title = `Page not found — ${site.name}`;
    return () => {
      document.title = site.title;
    };
  }, []);

  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative isolate flex min-h-[max(92svh,40rem)] flex-col overflow-hidden"
    >
      <HeroWave
        settings={waveSettings}
        minWaterline={minWaterline}
        fadeWater
        className="absolute inset-0 -z-10"
      />

      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-6 px-gutter pt-nav pb-64">
        <SelectionBox mode="draw" delay={0.6} label="Not found">
          <p aria-hidden="true" className="px-2 pb-2 font-display text-hero font-semibold">
            {notFoundPage.code}
          </p>
        </SelectionBox>

        <MaskedHeading
          as="h1"
          id="not-found-heading"
          immediate
          delay={0.2}
          className="mt-4 text-h1 font-semibold"
        >
          {notFoundPage.heading}
        </MaskedHeading>

        <motion.p {...rise(0.45)} className="max-w-prose text-lead">
          {notFoundPage.body}
        </motion.p>

        <motion.div ref={actionsRef} {...rise(0.55)} className="flex flex-wrap gap-3">
          <Button to="/" size="lg">
            {notFoundPage.primaryCta}
          </Button>
          <Button to="/#work" variant="secondary" size="lg">
            {notFoundPage.secondaryCta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
