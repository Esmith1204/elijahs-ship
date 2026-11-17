import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { SpecList } from '@/components/ui/SpecList';
import { Tag } from '@/components/ui/Tag';
import { BentoGrid } from '@/components/work/BentoGrid';
import { featuredProjects } from '@/content/projects';
import { cn } from '@/lib/cn';
import { GuideBlock, GuideSection } from './GuideSection';

function Stage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-tile-sm border border-line bg-surface p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ComponentSection() {
  return (
    <GuideSection
      id="components"
      index="04"
      title="Components"
      intro="The base pieces every page is built from. Hover them, tab through them, and try them at a narrow width."
    >
      <GuideBlock
        title="Buttons"
        note="Pills. The gradient is reserved for the one primary action in a view."
      >
        <Stage>
          <Button size="lg">See my work</Button>
          <Button size="lg" variant="secondary">
            Say hi
          </Button>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">View archive →</Button>
        </Stage>
      </GuideBlock>

      <GuideBlock
        title="Tags"
        note="Non-interactive labels. Neutral by default, tinted when a tile needs a little color."
      >
        <Stage>
          <Tag>Product Design</Tag>
          <Tag>Web App</Tag>
          <Tag tone="purple">Passion project</Tag>
          <Tag tone="blue">Development</Tag>
          <Tag tone="gradient">Hackathon Winner</Tag>
        </Stage>
      </GuideBlock>

      <GuideBlock title="Spec list" note="Label and value pairs for meta rows.">
        <Stage className="items-start gap-12">
          <SpecList
            items={[
              { label: 'Role', value: 'Product Designer' },
              { label: 'Team', value: '1 designer + 1 SWE' },
              { label: 'Event', value: 'LA Hacks 2026' },
            ]}
          />
        </Stage>
      </GuideBlock>

      <GuideBlock
        title="Selection box"
        note="The signature motif: a Figma selection with corner handles and a label. With no label set it prints its own live size. It is decorative and hidden from screen readers."
      >
        <Stage className="items-start gap-x-16 gap-y-14 pb-14">
          <SelectionBox>
            <p className="px-2 font-display text-h1 font-semibold">Elijah Smith</p>
          </SelectionBox>
          <SelectionBox label="Fill × Hug">
            <p className="px-2 font-display text-h2 font-light">Custom label</p>
          </SelectionBox>
          <SelectionBox mode="hover" label="Hover or focus me" labelPosition="top-left">
            <Button variant="secondary">Hover mode</Button>
          </SelectionBox>
        </Stage>
      </GuideBlock>

      <GuideBlock
        title="Image placeholder"
        note="Shown wherever an image hasn't been exported yet. It names the file to drop into public/images."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ImagePlaceholder
            label="Grouper cover"
            path="/images/grouper/cover.webp"
            ratio="16 / 10"
            className="rounded-tile border border-line"
          />
          <ImagePlaceholder
            label="Portrait"
            path="/images/about/portrait.webp"
            ratio="16 / 10"
            className="rounded-tile border border-line"
          />
        </div>
      </GuideBlock>

      <GuideBlock
        title="Bento tiles + filter chips"
        note="A preview of the featured work grid. Hover a tile: it lifts, the cover scales to 1.03 and the selection outline appears. Filtering animates with Motion layout."
      >
        <BentoGrid projects={featuredProjects} filterLabel="Filter projects" allLabel="All" />
      </GuideBlock>
    </GuideSection>
  );
}
