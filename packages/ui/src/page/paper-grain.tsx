// Server-safe. The kraft paper's grain (krizaka-ui#600): one inline SVG filter with a fixed seed, mounted once by the
// host (the root layout) and referenced by id from blocks.css (`filter: url(#kz-paper-grain)`). No image file.

/** The id the stylesheet references. */
export const PAPER_GRAIN_ID = "kz-paper-grain";

/** Mount once in the root layout: the grain of every `paper="kraft"` page and section. Draws nothing itself. */
export function PaperGrain() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <filter id={PAPER_GRAIN_ID} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.2" />
      </filter>
    </svg>
  );
}
