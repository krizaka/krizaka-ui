import { Landscape } from "@krizaka/ui/landscape";

// `tone="brand"`: the sky and the peaks in the host brand's accents; without the flock, a calmer backdrop.
export default function LandscapeBrand() {
  return (
    <div className="brand-orazaka relative h-64 w-full max-w-3xl overflow-hidden rounded-2xl border border-border-subtle">
      <Landscape tone="brand" flock={false} animated={false} />
    </div>
  );
}
