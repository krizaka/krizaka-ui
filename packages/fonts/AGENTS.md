# @krizaka/fonts — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/fonts`**. Lives in `packages/fonts` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. The decision (which faces, why) is §5 of
> [`../tokens/BRAND.md`](../tokens/BRAND.md).

## 1. What belongs here

- The **Krizaka typefaces** (level 0 — foundations), the Cahier identity (#417, ADR-004): Young Serif (display, one
  weight), Atkinson Hyperlegible Next (text), Courier Prime (mono: tags, captions, footnotes, code), self-hosted. The faces
  before 0.3.0 (Plus Jakarta Sans, Inter, JetBrains Mono) stay as `legacy: true` families: their files are still
  shipped (a pinned path keeps resolving) and listed in `legacyFonts`, never in `fonts.css` nor in a role. Web: WOFF2 variable files per subset (latin, latin-ext) and `fonts.css` (`@font-face`, `font-display:
  swap`, metric-matched local fallbacks). React Native: static TrueType per weight, `nativeFonts`, `fontFamily(role,
  weight)`, `fontAssets` for expo-font. The words of ui.krizaka.com/foundations/typography (`fonts[].why/use/avoid`, `rules`).
- Not here: the token values (`--kz-font-*`, the type scale: `@krizaka/tokens`), utilities (`@krizaka/tailwind`).
- **Only SIL OFL 1.1 faces** with no Reserved Font Name (subsetting is a modification); their licence ships in
  `licenses/`. A face under another licence is refused.

## 2. Rules

- **The accent role** (`accent`, `--kz-font-accent`, 0.4.0): Caveat Brush (OFL), a chalkboard hand for a menu line, a sign, one word (Yororis, the café). A sparing accent: never body text, interface, buttons or tables, one short line per block, from 24 px. French alphabet only (one subset), not preloaded.

- **Sources:** `src/families.json` (by hand: upstream commit, axes, subsets, native weights, fallbacks, the docs words).
  `scripts/subset.py` (Python, fontTools — run by hand with `pnpm subset`, never in CI) downloads the pinned upstream,
  cuts `files/` and writes `src/faces.json` (metrics, bytes, sha256) and `licenses/`; all committed.
  `scripts/build.mjs` (Node, zero dependency) writes `dist/`. Never edit `files/`, `faces.json` or `dist/` by hand.
- Web files keep only the weight axis the scale uses (text 400–700) and every OpenType feature. A static family
  (`upstream.fonts`, one file per weight: Young Serif 400, Courier Prime 400 · 700) gets one WOFF2 per weight and subset. Native files are unhinted static instances named `<Family>-<Style>`.
- `fonts.css` uses relative `url("../files/web/…")`: every bundler (Next.js, Vite, webpack, Metro web) resolves it.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/fonts`: ESLint + `tsc` (`checkJs` on the scripts), tests (the files match
  `faces.json` — bytes and sha256 —, WOFF2/TrueType signatures, French in latin, the CSS: one face per family and
  subset, swap, unicode-range, fallbacks; the licences; the entries), build, size, publint + attw (`esm-only`).
- **Size budgets:** `fonts.css` ≤ 1.25 kB gzip, `.` ≤ 5 kB gzip, `./native` ≤ 0.75 kB gzip; each WOFF2 by file (Young
  Serif latin ≤ 20 kB, latin-ext ≤ 12 kB, Atkinson ≤ 22 / 13 kB, Courier Prime ≤ 13 / 8 kB per weight); native ≤ 180 kB
  per file, ≤ 1.6 MB in all (the legacy files included). 0.3.0: +0.1 kB / +0.5 kB for a second mono weight and `legacyFonts`.
- Published surface: `.`, `./css`, `./native`, `./native/assets`, `./files/*`, `./licenses/*`, `./package.json`.
  Removing a family, a weight, a file or an export is a breaking change; a new weight or subset is a minor.

## 4. Release

A changeset for every change to `src/`, `files/` or `scripts/build.mjs`. Not in the `fixed` group: `@krizaka/fonts`
versions on its own (0.x while the products adopt it).
