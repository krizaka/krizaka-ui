import localFont from "next/font/local";

/* The Krizaka typefaces — the files of @krizaka/fonts (the workspace package, SIL OFL 1.1), loaded by next/font/local:
   preloaded, fingerprinted, with a metric-adjusted fallback (CLS 0). The latin file of each family covers English and
   French; globals.css puts them in the token roles (--kz-font-*). The arguments must be literals, relative to this file. */
export const textFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/inter-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-text",
  display: "optional",
});
export const displayFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/plus-jakarta-sans-latin-wght.woff2",
  weight: "500 800",
  variable: "--font-kz-display",
  display: "optional",
});
export const monoFace = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/jetbrains-mono-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-mono",
  display: "swap",
  preload: false, // labels and code, never the first paint
  adjustFontFallback: false,
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

export const fontVariables = [textFace.variable, displayFace.variable, monoFace.variable].join(" ");
