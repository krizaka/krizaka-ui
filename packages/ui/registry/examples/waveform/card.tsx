import { Waveform } from "@krizaka/ui/waveform";

const PEAKS = [0.2, 0.35, 0.6, 0.9, 0.5, 0.4, 0.8, 1, 0.7, 0.3, 0.5, 0.65, 0.4, 0.25, 0.55, 0.85, 0.6, 0.35, 0.2, 0.45, 0.7, 0.5, 0.3, 0.15];

// A voice on a card: the waveform is decoration, the name and the length say what it is, and it moves while it plays.
export default function WaveformCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-fg">Eric</p>
        <p className="text-xs text-fg-secondary">Voice note · 0:42</p>
      </div>
      <Waveform peaks={PEAKS} bars={24} size="sm" playing className="w-40" />
    </div>
  );
}
