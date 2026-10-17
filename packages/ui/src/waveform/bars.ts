// The bars of a waveform, shared by AudioPlayer (the seekable one) and Waveform (the decorative one). Pure: no React.

/** Resamples peaks to `count` bars (the maximum of each slice), normalised to the loudest. No peaks: a flat line at 15 %. */
export function resamplePeaks(peaks: readonly number[], count: number): number[] {
  if (peaks.length === 0) return Array.from({ length: count }, () => 0.15);
  const out = Array.from({ length: count }, (_, i) => {
    const from = Math.floor((i / count) * peaks.length);
    const to = Math.max(from + 1, Math.floor(((i + 1) / count) * peaks.length));
    return Math.max(...peaks.slice(from, to).map(Math.abs));
  });
  const loudest = Math.max(...out, 0.0001);
  return out.map((v) => Math.max(0.08, v / loudest));
}
