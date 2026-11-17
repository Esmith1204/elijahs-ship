import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { controlGroups, defaultWaveSettings } from './wave/settings';
import type { SliderControl, WavePalette, WaveSettings } from './wave/settings';

type WaveTunerProps = {
  value: WaveSettings;
  onChange: (value: WaveSettings) => void;
  /** Measured frame rate, or null before the first report. */
  fps: number | null;
  onReplayIntro: () => void;
  showContent: boolean;
  onShowContentChange: (show: boolean) => void;
  className?: string;
};

const palettes: { value: WavePalette; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'blue', label: 'Blue' },
];

/** The settings as a TypeScript object literal, ready to paste into settings.ts. */
function toSource(settings: WaveSettings): string {
  const lines = Object.entries(settings).map(([key, value]) => {
    const literal = typeof value === 'string' ? `'${value}'` : String(value);
    return `  ${key}: ${literal},`;
  });
  return `export const defaultWaveSettings: WaveSettings = {\n${lines.join('\n')}\n};\n`;
}

function Slider({
  control,
  value,
  onChange,
}: {
  control: SliderControl;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const decimals = control.step < 0.01 ? 3 : control.step < 1 ? 2 : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-small">
          {control.label}
        </label>
        <output htmlFor={id} className="text-micro text-ink-muted tabular-nums">
          {value.toFixed(decimals)}
          {control.unit && ` ${control.unit}`}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-6 w-full cursor-pointer accent-blue"
      />
    </div>
  );
}

const panelButton =
  'inline-flex h-9 items-center justify-center rounded-pill border border-line-strong bg-surface px-3 text-small font-medium transition-colors duration-200 hover:border-ink';

/** Dev panel for dialling in the hero wave. Not shipped on the homepage. */
export function WaveTuner({
  value,
  onChange,
  fps,
  onReplayIntro,
  showContent,
  onShowContentChange,
  className,
}: WaveTunerProps) {
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const [copied, setCopied] = useState(false);
  const bodyId = useId();

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const set = <K extends keyof WaveSettings>(key: K, next: WaveSettings[K]) =>
    onChange({ ...value, [key]: next });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toSource(value));
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure origin, denied permission). Log it instead.
      console.info(toSource(value));
    }
  };

  return (
    <aside
      aria-label="Wave tuning"
      className={cn(
        'flex flex-col overflow-hidden rounded-tile-sm border border-line-strong bg-surface text-ink shadow-lift',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-baseline gap-3">
          <h2 className="font-sans text-label font-medium uppercase">Wave tuning</h2>
          <span className="text-micro text-ink-muted tabular-nums" aria-live="off">
            {fps === null ? '-- fps' : `${fps} fps`}
          </span>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((current) => !current)}
          className={panelButton}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        id={bodyId}
        hidden={!open}
        className={cn(
          'min-h-0 flex-col gap-6 overflow-y-auto border-t border-line px-4 py-4',
          open && 'flex',
        )}
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-label font-medium text-ink-muted uppercase">Palette</legend>
          <div className="flex gap-2">
            {palettes.map((palette) => (
              <button
                key={palette.value}
                type="button"
                aria-pressed={value.palette === palette.value}
                onClick={() => set('palette', palette.value)}
                className={cn(
                  panelButton,
                  'flex-1',
                  value.palette === palette.value &&
                    'border-transparent bg-brand-gradient text-on-accent',
                )}
              >
                {palette.label}
              </button>
            ))}
          </div>
        </fieldset>

        {controlGroups.map((group) => (
          <fieldset key={group.title} className="flex flex-col gap-3">
            <legend className="mb-2 text-label font-medium text-ink-muted uppercase">
              {group.title}
            </legend>
            {group.controls.map((control) => (
              <Slider
                key={control.key}
                control={control}
                value={value[control.key]}
                onChange={(next) => set(control.key, next)}
              />
            ))}
            {group.title === 'Tugboat' && (
              <label className="flex items-center gap-2 text-small">
                <input
                  type="checkbox"
                  checked={value.smoke}
                  onChange={(event) => set('smoke', event.target.checked)}
                  className="size-4 accent-blue"
                />
                Smoke puffs
              </label>
            )}
          </fieldset>
        ))}

        <label className="flex items-center gap-2 text-small">
          <input
            type="checkbox"
            checked={showContent}
            onChange={(event) => onShowContentChange(event.target.checked)}
            className="size-4 accent-blue"
          />
          Show hero text on top
        </label>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copy} className={panelButton}>
            {copied ? 'Copied' : 'Copy settings'}
          </button>
          <button type="button" onClick={onReplayIntro} className={panelButton}>
            Replay intro
          </button>
          <button
            type="button"
            onClick={() => onChange(defaultWaveSettings)}
            className={panelButton}
          >
            Reset
          </button>
        </div>
        <p className="text-micro text-ink-muted">
          Changes are saved in this browser. To make them the site default, copy the settings and
          paste them over <code>defaultWaveSettings</code> in{' '}
          <code>src/components/hero/wave/settings.ts</code>.
        </p>
      </div>
    </aside>
  );
}
