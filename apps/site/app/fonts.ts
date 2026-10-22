import localFont from "next/font/local";

/* The Krizaka typefaces (Cahier, ADR-004: Young Serif, Atkinson Hyperlegible Next, Courier Prime) — the files of @krizaka/fonts (the workspace package, SIL OFL 1.1), loaded by next/font/local:
   preloaded, fingerprinted, with a metric-adjusted fallback (CLS 0). The latin file of each family covers English and
   French; globals.css puts them in the token roles (--kz-font-*). The arguments must be literals, relative to this file. */
export const textFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/atkinson-hyperlegible-next-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-text",
  display: "optional",
});
export const displayFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/young-serif-latin-400.woff2",
  weight: "400",
  variable: "--font-kz-display",
  display: "optional",
});
export const monoFace = localFont({
  src: [
    { path: "../node_modules/@krizaka/fonts/files/web/courier-prime-latin-400.woff2", weight: "400" },
    { path: "../node_modules/@krizaka/fonts/files/web/courier-prime-latin-700.woff2", weight: "700" },
  ],
  variable: "--font-kz-mono",
  display: "swap",
  preload: false, // labels and code, never the first paint
  adjustFontFallback: false,
  fallback: ["Courier New", "ui-monospace", "Menlo", "monospace"],
});

/* Krizaka Cahier, the pen (derived from Caveat, SIL OFL 1.1): margin marks, folios, notes, a chalkboard line — never body text. Pages that use it set preload: true. */
export const cahierFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/krizaka-cahier-latin-wght.woff2",
  weight: "500",
  variable: "--font-kz-cahier",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Marker Felt", "Bradley Hand", "cursive"],
});

export const fontVariables = [textFace.variable, displayFace.variable, monoFace.variable, cahierFace.variable].join(" ");
