# @krizaka/fonts

## 0.5.1

### Patch Changes

- [#702](https://github.com/krizaka/krizaka-ui/pull/702) [`cbe5537`](https://github.com/krizaka/krizaka-ui/commit/cbe55378ad2b38e27612ed504dc0b71c19a30095) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The tests that import the package's own `dist` now depend on its build in turbo (the release pipeline ran them before the build).

## 0.5.0

### Minor Changes

- [#684](https://github.com/krizaka/krizaka-ui/pull/684) [`ba195fb`](https://github.com/krizaka/krizaka-ui/commit/ba195fb1d4ec5458803777bf62abfd77ba5aa827) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Plus Jakarta Sans is back, for the products' titles only (ADR-006 §2, krizaka-ui#670). `@krizaka/fonts` gets the role `product-display` (`--kz-font-product-display`, variable, latin + latin-ext, weights 550 / 650 / 700 in use, never 800): the files are the ones the package already shipped as legacy (`legacyFonts` still lists them), declared in `fonts.css` with a metric-matched fallback (CLS 0), never preloaded, never loaded from Google Fonts. `@krizaka/tokens` adds `--kz-font-product-display` and `--kz-font-mono-meta` (Courier Prime, for identifiers and times). In the product register of `blocks.css`, `--kz-font-display` is the product face (−0.015 em from 24 px, −0.022 em from 40 px, display steps at 550 / 650), identifiers use Courier Prime (`--kz-font-mono-meta`, `font-mono-meta`), code the system monospace (eyebrows follow in [#633](https://github.com/krizaka/krizaka-ui/issues/633)); the Cahier sites keep Young Serif and never fetch the face. The typography page of ui.krizaka.com shows the two registers side by side.

## 0.4.0

### Minor Changes

- [#474](https://github.com/krizaka/krizaka-ui/pull/474) [`f354137`](https://github.com/krizaka/krizaka-ui/commit/f354137cca01e24652ec46ee9c25d250441d6f43) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat: **Krizaka Cahier**, our own pen — derived from Caveat (SIL OFL 1.1, renamed, FONTLOG shipped), weight 500, tabular lining figures, a 1.25 em line box, French alphabet and § — as the `cahier` role: `--kz-font-cahier` (tokens), `font-cahier` (tailwind), `fontStack("cahier")`, `fontFamily("cahier")` (fonts). For margin marks, folios, notes and the café chalkboard line; never headings or body text (krizaka-ui#472).

## 0.3.0

### Minor Changes

- [#423](https://github.com/krizaka/krizaka-ui/pull/423) [`01cfb77`](https://github.com/krizaka/krizaka-ui/commit/01cfb7758294d04434af401f9ae92e292643e405) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Cahier (ADR-004, [#417](https://github.com/krizaka/krizaka-ui/issues/417)): the Krizaka faces are Young Serif (display, one weight), Atkinson Hyperlegible Next (text) and Courier Prime (mono: tags, captions, footnotes, code)** — all SIL OFL 1.1, self-hosted, latin and latin-ext, metric-matched fallbacks (Georgia, Arial, Courier New). Static families get one WOFF2 per weight. Plus Jakarta Sans, Inter and JetBrains Mono stay in `files/` and in the new `legacyFonts` export (out of `fonts.css`), so a pinned `next/font/local` path keeps resolving while an app moves. Native: `YoungSerif-Regular`, `AtkinsonHyperlegibleNext-{Regular,SemiBold,Bold}`, `CourierPrime-{Regular,Bold}`.

## 0.2.1

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.

## 0.2.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

## 0.1.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).

## 0.1.0

### Minor Changes

- [#66](https://github.com/krizaka/krizaka-ui/pull/66) [`1ebdb61`](https://github.com/krizaka/krizaka-ui/commit/1ebdb61ce394a3e584dce40c5740b3193da8ea5e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/fonts` — the Krizaka typefaces, self-hosted (new package). Plus Jakarta Sans (display, 500–800), Inter (text,
  400–700, opsz 14) and JetBrains Mono (mono, 400–700), all SIL OFL 1.1 with their licences: WOFF2 variable subsets
  (latin, latin-ext) and `@krizaka/fonts/css` (`@font-face`, `font-display: swap`, a metric-matched local fallback per
  family for CLS 0); static TrueType for React Native with `fontFamily(role, weight)` (`/native`) and `fontAssets` for
  expo-font (`/native/assets`); `fonts`, `rules`, `preload`, `fontStack` as data for the docs (krizaka.com/docs/ui/typography).
