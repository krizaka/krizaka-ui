# @krizaka/fonts

**The Krizaka typefaces, self-hosted.** Three families, three jobs — **Young Serif** names (headlines, one weight),
**Atkinson Hyperlegible Next** reads (text, interface), **Courier Prime** types the notes (tags, captions, footnotes,
code) — the Cahier identity (ADR-004) — as WOFF2 subsets for the web
with metric-matched fallbacks (CLS 0), and static TrueType for React Native / Expo. All SIL OFL 1.1.

[![npm](https://img.shields.io/npm/v/@krizaka/fonts?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/fonts)

Documentation: [ui.krizaka.com/foundations/typography](https://ui.krizaka.com/foundations/typography) — specimen, scale, rules.

## Web

```bash
npm install @krizaka/fonts @krizaka/tokens @krizaka/tailwind
```

```css
/* app.css */
@import "tailwindcss";
@import "@krizaka/tailwind";      /* --kz-font-display / --kz-font-sans / --kz-font-mono + the type scale */
@import "@krizaka/fonts/css";     /* the @font-face rules and their fallbacks */
```

```html
<h1 class="font-display text-display-xl">Sovereign AI, on your servers</h1>
<p class="font-text text-body-md text-fg-secondary">Atkinson Hyperlegible Next, 16/1.5, for everything you read.</p>
<span class="font-mono text-caption text-fg-muted">fig. 2 · Orazaka v2</span>
```

The CSS points at the files with relative URLs: the bundler copies and fingerprints them. Only the latin files are
fetched for an English or French page (latin-ext loads when a page needs it).

### Next.js

`import "@krizaka/fonts/css"` in the root layout is enough (CLS 0 thanks to the fallbacks). To get next/font's
preloads too, load the files with `next/font/local` (its arguments must be literals, relative to the calling file):

```tsx
import localFont from "next/font/local";

const text = localFont({
  src: "../node_modules/@krizaka/fonts/files/web/atkinson-hyperlegible-next-latin-wght.woff2",
  weight: "400 700",
  variable: "--font-kz-text",
  display: "swap",
});
// :root { --kz-font-sans: var(--font-kz-text), "Atkinson Hyperlegible Next Fallback", system-ui, sans-serif; }
```

`preload` (from `@krizaka/fonts`) lists the latin file of each family.

## React Native / Expo

```bash
npx expo install expo-font
npm install @krizaka/fonts @krizaka/tokens
```

```tsx
import { useFonts } from "expo-font";
import { fontAssets } from "@krizaka/fonts/native/assets";
import { fontFamily } from "@krizaka/fonts/native";
import { typeScale } from "@krizaka/tokens/native";

const [loaded] = useFonts(fontAssets);           // the 6 files, keyed by name ("AtkinsonHyperlegibleNext-Regular"…)

const { role, fontWeight, ...size } = typeScale.displayLg;
<Text style={{ ...size, fontFamily: fontFamily(role, Number(fontWeight)) }}>Your earnings</Text>
// fontFamily("display") → "YoungSerif-Regular" — no fontWeight next to it (Android would bold it twice)
```

Static files only (React Native takes no variable font): display 400, text 400 · 600 · 700, mono 400 · 700. The
faces before 0.3.0 (Plus Jakarta Sans, Inter, JetBrains Mono) are still in `files/` and listed in `legacyFonts`. To embed them at build time instead, list the same files in the `expo-font` config plugin.

## Entries

| Entry | Gives |
| :-- | :-- |
| `@krizaka/fonts` | `fonts` (per role: family, stack, weights, files, licence, fallback metrics, why / use / avoid), `rules`, `preload`, `fontStack(role)`. |
| `@krizaka/fonts/css` | The `@font-face` rules: each family × latin / latin-ext, `font-display: swap`, and `"<Family> Fallback"` (local Georgia, Arial or Courier New, adjusted). |
| `@krizaka/fonts/native` | `nativeFonts`, `fontFamily(role, weight)`. |
| `@krizaka/fonts/native/assets` | `fontAssets` for `useFonts` (React Native only: `require`s the TrueType files). |
| `@krizaka/fonts/files/*` | The files: `files/web/<family>-<subset>-wght.woff2`, `files/native/<Family>-<Style>.ttf`. |
| `@krizaka/fonts/licenses/*` | The OFL of each family. |

## Sizes

| File | Size |
| :-- | :-- |
| Inter latin / latin-ext (400–700) | 50 kB / 61 kB |
| Plus Jakarta Sans latin / latin-ext (500–800) | 26 kB / 20 kB |
| JetBrains Mono latin / latin-ext (400–700) | 30 kB / 10 kB |

A French or English page fetches ≈ 106 kB for the three families (every weight included, one file each).

## Licences

The code of this package: Apache-2.0. The fonts: [SIL Open Font License 1.1](https://openfontlicense.org) —
Inter © The Inter Project Authors, Plus Jakarta Sans © The Plus Jakarta Sans Project Authors, JetBrains Mono © The
JetBrains Mono Project Authors (`licenses/`). The files are subsets of the upstream releases (google/fonts at the commits
in `src/families.json`); the OFL allows it and no family has a Reserved Font Name. Bundle them with any software; do
not sell them on their own.
