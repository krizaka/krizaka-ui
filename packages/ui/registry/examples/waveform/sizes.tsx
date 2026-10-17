import { Waveform } from "@krizaka/ui/waveform";

const PEAKS = [0.3, 0.7, 0.45, 1, 0.6, 0.25, 0.8, 0.5, 0.9, 0.35, 0.6, 0.75];

// Three sizes, in the brand's accent and in a quiet neutral tone. Still: nothing is playing.
export default function WaveformSizes() {
  return (
    <div className="flex flex-col gap-4">
      <Waveform peaks={PEAKS} bars={36} size="sm" />
      <Waveform peaks={PEAKS} bars={36} size="md" />
      <Waveform peaks={PEAKS} bars={36} size="lg" tone="neutral" />
    </div>
  );
}
