import { CornerMark, Crosshair, Sparkle, TickRule } from '@/components/ui/Motifs';
import { SpecList } from '@/components/ui/SpecList';
import { Tag } from '@/components/ui/Tag';
import { GuideBlock, GuideSection } from './GuideSection';

/**
 * The loud version of the brand: the gradient as a poster, with the guide
 * lines, dots and tiny stat type from the reference images.
 */
function PosterTile() {
  return (
    <div className="relative isolate flex min-h-112 flex-col justify-between overflow-hidden rounded-tile-lg bg-brand-gradient p-8 text-on-accent">
      {/* Guide lines (ref-03) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)] opacity-40" />
        <span className="absolute inset-y-0 left-1/3 border-l border-on-accent/25" />
        <span className="absolute inset-y-0 right-24 border-l border-on-accent/25" />
        <span className="absolute inset-x-0 top-24 border-t border-on-accent/25" />
        <span className="absolute inset-x-0 bottom-40 border-t border-on-accent/25" />
        <span className="absolute -top-16 -left-16 size-72 rounded-full border border-on-accent/25" />
        <Crosshair className="absolute top-14 right-14 size-20 text-on-accent/60" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <Tag tone="on-accent">Passion project</Tag>
        <p className="text-label font-medium uppercase [writing-mode:vertical-rl]">Elijah's Ship</p>
      </div>

      <div className="flex flex-col gap-6">
        <p className="font-display text-hero font-extralight lowercase">needle</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SpecList
            tone="on-accent"
            items={[
              { label: 'Type', value: 'Album log' },
              { label: 'Scale', value: '10-point' },
              { label: 'Role', value: 'Designer & developer' },
            ]}
          />
          <Sparkle className="size-8" />
        </div>
        <TickRule />
      </div>
    </div>
  );
}

export function MotifSection() {
  return (
    <GuideSection
      id="motifs"
      index="05"
      title="Motifs from the references"
      intro="A proposal, not part of the brief. The three posters share thin guide lines, small technical labels and blue as the loud color. These pieces carry that feel into a light site without turning the whole page blue."
    >
      <GuideBlock
        title="Marks"
        note="Decorative only. They inherit the text color, so they work on light tiles and on the gradient."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <li className="flex flex-col items-start gap-4 rounded-tile-sm border border-line bg-surface p-6">
            <Sparkle className="text-blue" />
            <code className="text-small">Sparkle</code>
          </li>
          <li className="flex flex-col items-start gap-4 rounded-tile-sm border border-line bg-surface p-6">
            <Crosshair className="size-6 text-purple" />
            <code className="text-small">Crosshair</code>
          </li>
          <li className="flex flex-col items-start gap-4 rounded-tile-sm border border-line bg-surface p-6">
            <span className="flex size-6 items-center justify-center">
              <CornerMark />
            </span>
            <code className="text-small">CornerMark</code>
          </li>
          <li className="flex flex-col items-start gap-4 rounded-tile-sm border border-line bg-surface p-6">
            <span className="flex h-6 w-full items-center">
              <TickRule />
            </span>
            <code className="text-small">TickRule</code>
          </li>
        </ul>
      </GuideBlock>

      <GuideBlock
        title="Patterns"
        note="Grid for anything canvas-like, dots for texture. Both stay quieter than the content on top."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          <li className="flex h-40 items-end rounded-tile-sm border border-line bg-surface bg-grid p-4">
            <code className="rounded-tag bg-surface px-2 py-1 text-small">bg-grid</code>
          </li>
          <li className="flex h-40 items-end rounded-tile-sm border border-line bg-surface bg-dots p-4">
            <code className="rounded-tag bg-surface px-2 py-1 text-small">bg-dots</code>
          </li>
        </ul>
      </GuideBlock>

      <GuideBlock
        title="Poster tile"
        note="Where the references show up at full volume: one gradient tile with guide lines, vertical type and a stat block. Could be the Needle bento tile, a case study header or the footer. Use it once per page at most."
      >
        <PosterTile />
      </GuideBlock>
    </GuideSection>
  );
}
