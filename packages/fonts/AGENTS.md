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

- **The `product-display` role** (`--kz-font-product-display`, 0.5.0, ADR-006 §2, krizaka-ui#670): **Plus Jakarta Sans**, the
  titles of the product register only (550 / 650 / 700, never 800; −0.015 em from 24 px, −0.022 em from 40 px). It comes back
  from `legacyFonts` as a role (the files are the same, `legacyFonts` still lists it so no pinned path breaks). It is
  declared in `fonts.css` (the browser downloads it only where it is used) but never in `preload`: the Cahier sites keep Young
  Serif and never fetch it. `@krizaka/ui`'s `blocks.css` points the product register's `--kz-font-display` at it.
  Courier Prime is the register's `--kz-font-mono-meta` (identifiers, references, times); code is the system monospace;
  the pen is never inside a product.
- **The pen role** (`cahier`, `--kz-font-cahier`, 0.4.0): **Krizaka Cahier**, our own face, derived by `scripts/subset.py` (`derive_cahier`) from Caveat (SIL OFL 1.1, no Reserved Font Name; renamed anyway). Margin marks (§ 4), rule numbers, page folios, handwritten notes and stamps, a café chalkboard line: never headings, body text, interface, buttons or tables, one short line per block, from 20 px. French alphabet only (one subset), weight 500, line box 1.25 em, figures tabular; `licenses/KrizakaCahier-OFL.txt` + `-FONTLOG.txt` ship. Not preloaded by the package; a site that uses it sets `preload: true`.

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
- **Size budgets:** `fonts.css` ≤ 1.25 kB gzip, `.` ≤ 6 kB gzip, `./native` ≤ 0.75 kB gzip; each WOFF2 by file (Young
  Serif latin ≤ 20 kB, latin-ext ≤ 12 kB, Plus Jakarta Sans latin ≤ 28 kB, latin-ext ≤ 22 kB, Atkinson ≤ 22 / 13 kB, Courier Prime ≤ 13 / 8 kB per weight); native ≤ 180 kB
  per file, ≤ 1.6 MB in all (the legacy files included). 0.3.0: +0.1 kB / +0.5 kB for a second mono weight and `legacyFonts`.
- Published surface: `.`, `./css`, `./native`, `./native/assets`, `./files/*`, `./licenses/*`, `./package.json`.
  Removing a family, a weight, a file or an export is a breaking change; a new weight or subset is a minor.

## 4. Release

A changeset for every change to `src/`, `files/` or `scripts/build.mjs`. Not in the `fixed` group: `@krizaka/fonts`
versions on its own (0.x while the products adopt it).
