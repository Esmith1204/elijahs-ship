import { HeroWave } from '@/components/hero/HeroWave';
import { defaultWaveSettings } from '@/components/hero/wave/settings';
import type { WaveSettings } from '@/components/hero/wave/settings';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { site } from '@/content/site';

/** A slightly lower waterline than the hero, so the name has room. */
const settings: WaveSettings = { ...defaultWaveSettings, palette: 'blue', waterline: 0.74 };

/**
 * /lab/share: the social share (Open Graph) image, laid out at exactly
 * 1200 × 630. Screenshot it with reduced motion on to get the still frame:
 * the wave at rest, the boat, and the name in its finished selection box.
 */
export default function ShareImage() {
  return (
    <main className="theme-blue relative h-[630px] w-[1200px] overflow-hidden bg-bg text-ink">
      <h1 className="sr-only">Share image</h1>
      <HeroWave settings={settings} intro={false} className="absolute inset-0" />

      <div className="absolute inset-x-0 top-0 flex flex-col items-start gap-7 px-[88px] pt-[92px]">
        <SelectionBox>
          <p className="px-2 pb-3 font-display text-[136px] leading-[0.92] font-semibold tracking-[-0.045em]">
            {site.name}
          </p>
        </SelectionBox>
        <p className="mt-6 text-[34px] leading-tight font-medium">
          {site.role} · {new URL(site.url).host}
        </p>
      </div>

      <img
        src="/favicon-192.png"
        alt=""
        width={64}
        height={64}
        className="absolute top-[40px] right-[48px] size-16 rounded-[14px]"
      />
    </main>
  );
}
