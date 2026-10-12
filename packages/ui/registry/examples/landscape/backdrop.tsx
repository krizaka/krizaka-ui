import { Landscape } from "@krizaka/ui/landscape";

// A page's end: the Krizaka valley at dusk behind the last words, faded into the surface.
export default function LandscapeBackdrop() {
  return (
    <div className="relative h-80 w-full max-w-3xl overflow-hidden rounded-2xl border border-border-subtle">
      <Landscape animated={false} />
      <p className="relative z-10 p-6 text-lg font-semibold text-fg">Built in the open, in Montréal.</p>
    </div>
  );
}
