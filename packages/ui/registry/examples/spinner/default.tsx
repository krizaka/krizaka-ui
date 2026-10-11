import { Spinner } from "@krizaka/ui/spinner";

// A short wait in place: light travels around the hexagon, the node breathes. Still and legible under reduced motion.
export default function SpinnerDefault() {
  return (
    <p className="flex items-center gap-2 text-sm text-fg-secondary">
      <Spinner label="Searching" size="sm" />
      <span aria-hidden>Searching your library…</span>
    </p>
  );
}
