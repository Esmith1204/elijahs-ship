import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DURATION, GSAP_EASE, RISE, revealGroup, revealItem, STAGGER } from '@/lib/motion';
import { GuideBlock, GuideSection } from './GuideSection';

const rules = [
  { label: 'Durations', value: `${DURATION.fast}s · ${DURATION.base}s · ${DURATION.slow}s` },
  { label: 'Ease (Motion)', value: '[0.22, 1, 0.36, 1]' },
  { label: 'Ease (GSAP)', value: GSAP_EASE },
  { label: 'Stagger', value: `${STAGGER}s` },
  { label: 'Rise', value: `${RISE}px` },
];

const demoItems = ['Problem', 'My role', 'Research', 'Decisions', 'Results'];

export function MotionSection() {
  const [run, setRun] = useState(0);

  return (
    <GuideSection
      id="motion"
      index="06"
      title="Motion"
      intro="Noticeable, never overbearing. Quick, confident moves everywhere, with the bold moments saved for the hero, the bento hover and the footer. Reduced-motion users get opacity only."
    >
      <GuideBlock
        title="Values"
        note="Defined once in src/lib/motion.ts and mirrored as CSS tokens."
      >
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {rules.map(({ label, value }) => (
            <div key={label} className="rounded-tile-sm border border-line bg-surface p-4">
              <dt className="text-label text-ink-muted uppercase">{label}</dt>
              <dd className="mt-2 text-small font-medium tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </GuideBlock>

      <GuideBlock
        title="Reveal"
        note="The standard entrance: fade plus a short rise, staggered. Plays once when a section first scrolls into view."
      >
        <div className="flex flex-col items-start gap-6 rounded-tile-sm border border-line bg-surface p-6">
          <motion.ul
            key={run}
            variants={revealGroup}
            initial="hidden"
            animate="visible"
            className="grid w-full grid-cols-2 gap-4 md:grid-cols-5"
          >
            {demoItems.map((item) => (
              <motion.li
                key={item}
                variants={revealItem}
                className="flex h-24 items-end rounded-tile-sm bg-blue-tint p-4 text-small font-medium text-blue"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
          <Button variant="secondary" onClick={() => setRun((count) => count + 1)}>
            Replay
          </Button>
        </div>
      </GuideBlock>
    </GuideSection>
  );
}
