import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { HeroWave } from '@/components/hero/HeroWave';
import { defaultWaveSettings } from '@/components/hero/wave/settings';
import type { WaveSettings } from '@/components/hero/wave/settings';
import { WaveTuner } from '@/components/hero/WaveTuner';
import { SelectionBox } from '@/components/ui/SelectionBox';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'elijahs-ship:wave-settings';

/** Saved tuning, merged over the defaults so new settings always have a value. */
function loadSettings(): WaveSettings {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultWaveSettings, ...JSON.parse(saved) } : defaultWaveSettings;
  } catch {
    return defaultWaveSettings;
  }
}

/** /lab/wave: the hero wave on its own, full screen, with the tuning panel. */
export default function WaveLab() {
  const [settings, setSettings] = useState(loadSettings);
  const [fps, setFps] = useState<number | null>(null);
  const [showContent, setShowContent] = useState(true);
  const [run, setRun] = useState(0);
  const onBlue = settings.palette === 'blue';

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Private mode or blocked storage: tuning just won't persist.
    }
  }, [settings]);

  return (
    <main className="relative h-svh min-h-144 overflow-hidden">
      <h1 className="sr-only">Hero wave lab</h1>

      {/* `key` remounts the scene, which replays the load sequence. */}
      <HeroWave key={run} settings={settings} onFps={setFps} className="absolute inset-0" />

      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex flex-col items-start gap-8 px-gutter pt-24',
          onBlue ? 'text-on-accent' : 'text-ink',
        )}
      >
        <Link
          to="/"
          className="pointer-events-auto absolute top-6 left-gutter font-display text-body font-semibold tracking-tight"
        >
          ← {site.wordmark}
        </Link>
        {showContent && (
          <>
            <SelectionBox>
              <p className="px-2 pb-4 font-display text-hero font-semibold">{site.name}</p>
            </SelectionBox>
            <p className="max-w-prose text-lead">Product designer who builds what he designs.</p>
          </>
        )}
      </div>

      <WaveTuner
        value={settings}
        onChange={setSettings}
        fps={fps}
        onReplayIntro={() => setRun((count) => count + 1)}
        showContent={showContent}
        onShowContentChange={setShowContent}
        className="absolute inset-x-4 bottom-4 max-h-[60svh] md:inset-x-auto md:top-4 md:right-4 md:bottom-auto md:max-h-[calc(100svh-2rem)] md:w-80"
      />
    </main>
  );
}
