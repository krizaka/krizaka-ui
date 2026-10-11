# @krizaka/tailwind

## 2.3.0

### Minor Changes

- [#65](https://github.com/krizaka/krizaka-ui/pull/65) [`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Signature components and next-level feedback (DS2, wave W1 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)) — additions only, the 2.x API is unchanged:
  
  - **New entries.** `./iso` (the isometric kit: `IsoHub` from data, `IsoScene`, `IsoPrism`, `IsoStack`, `IsoDome`, `IsoTile`, `IsoLink`, `IsoNode`, `IsoLabel` — server-rendered SVG, no client JavaScript), `./nav-bar` (floating bar that tightens on scroll, one light gliding between items, accessible menus, mobile panel), `./loader` (`Loader`: delay, minimum duration, ETA, drawn and announced endings; `LoadingRegion`: content ⇄ skeleton hand-over; `useDelayedWait`), `./number-ticker`, `./glow-card`, `./marquee`, `./stepper`, `./meter`, `./chip-link` (a filter that is a link, server-safe `chipVariants`, [#45](https://github.com/krizaka/krizaka-ui/issues/45)) and `./motion` (`MotionObserver`, `RotatingWord`).
  - **Motion ([#41](https://github.com/krizaka/krizaka-ui/issues/41)).** `MotionObserver` pauses what is off screen (`data-offscreen`), lets the first screen settle (`html[data-motion]`), drives `[data-kz-magnetic]`; `RotatingWord` keeps the width of its longest word (no layout shift); `[data-reveal="soft"]`; icon nodes light up and arrows lean in links and buttons.
  - **Button.** `shape="cut"` (45° corners), `loading` draws the Krizaka loader glyph (`indicator={false}` to keep your own), `progress`, `status` success·error (drawn, a ring opens, an error shakes once), `announce`, `shimmer`, `magnetic`; `IconButton` swaps its icon for the glyph.
  - **Feedback.** `Spinner` is the Krizaka glyph (a hexagon traced by light around a node) and takes a `value`; `LoaderGlyph` exported. `Progress`: `showLabel`, `eta`, `buffer`, `segments`, `status` paused·error. `Skeleton`: one brand reflection across the page, `SkeletonText`, `SkeletonShape` (the real component as its own skeleton). `Toast`: a hairline counts the time left (paused on hover), `undoToast`, `progressToast`, `groupedToast`.
  - **Tabs** glide one light to the active tab in every variant. **Dialog** `placement="left"` ([#43](https://github.com/krizaka/krizaka-ui/issues/43)), drawers slide from their edge.
  - Visual changes (new screenshots): Spinner, Button loading, Skeleton, Tabs, the side dialog's entrance.

### Patch Changes

- Updated dependencies [[`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36)]:
  - @krizaka/ui@2.3.0
  - @krizaka/tokens@2.3.0

## 2.2.0

### Patch Changes

- Updated dependencies [[`430dc6d`](https://github.com/krizaka/krizaka-ui/commit/430dc6dacf233e8c9f754d4e5ccc1ab8cbac23ce)]:
  - @krizaka/ui@2.2.0
  - @krizaka/tokens@2.2.0

## 2.1.0

### Patch Changes

- Updated dependencies [[`248927c`](https://github.com/krizaka/krizaka-ui/commit/248927c06c4c2735bca2e3f5fabe54e140d91913)]:
  - @krizaka/tokens@2.1.0
  - @krizaka/ui@2.1.0

## 2.0.0

### Major Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **@krizaka/ui 2.0.0 — stable.** The primitives layer the products were missing, on one token vocabulary. `@krizaka/tokens`
  and `@krizaka/tailwind` ship with it at **2.0.0**: they form one `fixed` group with `@krizaka/ui` (one version for the
  foundations and the primitives), so they skip 1.x.
  
  Migrating from `@krizaka/ui` 1.x:
  
  - **Nothing changes for the marks and the motion signature**: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`,
    `ProductLogo`, the `/native` marks and `motion.css` keep their names and props.
  - **New: the primitives**, one entry each (`@krizaka/ui/button`, `/card`, `/dialog`, `/toast`, `/tabs`, `/command`,
    `/countdown`…), their React Native parity in `@krizaka/ui/native`, and the registry (`@krizaka/ui/registry/*`) that
    krizaka.com/docs/ui renders.
  - **Peers**: React 19 (`react`, `react-dom` ≥ 19 recommended — 18 still resolves), Tailwind CSS ^4.1 with
    `@krizaka/tailwind` 2 (`@import "tailwindcss"; @import "@krizaka/tailwind";`), React Native ≥ 0.76 and
    react-native-svg ≥ 15 for `/native`.
  - **Theme**: one mechanism (`html.light`, the `--kz-*` tokens); a product's identity is a brand theme
    (`@krizaka/tokens/brands/<id>.css`), never a fork.
  
  The support policy (N and N-1, 6 months, deprecation with a codemod) is in `SUPPORT.md`.

### Minor Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Status colours that read as text, and a section gradient that ends on the page.
  
  - **`--kz-success-text`, `--kz-warning-text`, `--kz-danger-text`, `--kz-info-text`** (native: `successText`…): the
    statuses as small text, ≥ 4.5:1 on every surface in both themes (tested) — the fills stay for dots, borders and
    icons (`danger` was 3.6:1 in light). Preset utilities `text-fg-success`, `text-fg-warning`, `text-fg-danger`,
    `text-fg-info`; `info-text` is a brand role. Used by `Countdown` (urgent), `Field.Error`, the danger
    `DropdownMenu.Item` and the native `Txt` tones `success`/`warning`/`danger`.
  - **`--kz-brand-gradient-to` is an alias of `--kz-surface-0`** (krizaka/krizaka-ui#38), in `tokens.css` and every
    brand file: an app that changes its page surface no longer gets a line under each `SectionBackdrop`. The resolved
    values (`values`, `brands`, `/native`) are unchanged.

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Brand themes: one colour per Krizaka brand. `@krizaka/tokens/brands/{krizaka,orazaka,orochia}.css` (a product's
  identity, dark and light, imported after the tokens), `brands/scoped.css` (`.brand-<id>` classes for pages that show
  several brands), `brands` in the web and native modules (`<ThemeProvider overrides={brands.orazaka}>`). Orazaka is
  orange (from its mark: `hsl(26 92% 55%)` dark under near-black text, `#b45309` light under white), Orochia velvet →
  magenta, Krizaka ink + blue (the platform default). New roles: `--kz-accent-text` (the accent as text, ≥ 4.5:1 on
  every surface; `text-fg-accent`) and the section gradient `--kz-brand-gradient-{from,via,to}`
  (`from-brand-from via-brand-via to-brand-to`), every pair tested at WCAG AA in both themes. `BRAND.md` documents the
  brand system: colours, marks, icons and the visual language of pages.

### Patch Changes

- Updated dependencies [[`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b), [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab), [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b), [`7de0337`](https://github.com/krizaka/krizaka-ui/commit/7de0337830983f4f2e1794d0a2cad1c77a77bda0), [`5167bcb`](https://github.com/krizaka/krizaka-ui/commit/5167bcbb4857022b1e9562a10f17bc58e8691301), [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab), [`c612967`](https://github.com/krizaka/krizaka-ui/commit/c612967ca62df35017c701aeeaba4b062e313318), [`f5bf3c5`](https://github.com/krizaka/krizaka-ui/commit/f5bf3c5622d5c3d7068ba011b29b64b61dfb059f), [`8147bb6`](https://github.com/krizaka/krizaka-ui/commit/8147bb658fa2841f53e81230d216d6882a182e4b)]:
  - @krizaka/tokens@2.0.0
  - @krizaka/ui@2.0.0

## 2.0.0-beta.6

### Patch Changes

- Updated dependencies [[`5167bcb`](https://github.com/krizaka/krizaka-ui/commit/5167bcbb4857022b1e9562a10f17bc58e8691301)]:
  - @krizaka/ui@2.0.0-beta.6
  - @krizaka/tokens@2.0.0-beta.6

## 2.0.0-beta.5

### Minor Changes

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Brand themes: one colour per Krizaka brand. `@krizaka/tokens/brands/{krizaka,orazaka,orochia}.css` (a product's
  identity, dark and light, imported after the tokens), `brands/scoped.css` (`.brand-<id>` classes for pages that show
  several brands), `brands` in the web and native modules (`<ThemeProvider overrides={brands.orazaka}>`). Orazaka is
  orange (from its mark: `hsl(26 92% 55%)` dark under near-black text, `#b45309` light under white), Orochia velvet →
  magenta, Krizaka ink + blue (the platform default). New roles: `--kz-accent-text` (the accent as text, ≥ 4.5:1 on
  every surface; `text-fg-accent`) and the section gradient `--kz-brand-gradient-{from,via,to}`
  (`from-brand-from via-brand-via to-brand-to`), every pair tested at WCAG AA in both themes. `BRAND.md` documents the
  brand system: colours, marks, icons and the visual language of pages.

### Patch Changes

- Updated dependencies [[`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b), [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b)]:
  - @krizaka/tokens@2.0.0-beta.5
  - @krizaka/ui@2.0.0-beta.5

## 2.0.0-beta.4

### Patch Changes

- Updated dependencies [[`c612967`](https://github.com/krizaka/krizaka-ui/commit/c612967ca62df35017c701aeeaba4b062e313318)]:
  - @krizaka/ui@2.0.0-beta.4
  - @krizaka/tokens@2.0.0-beta.4

## 2.0.0-beta.3

### Patch Changes

- Updated dependencies [[`8147bb6`](https://github.com/krizaka/krizaka-ui/commit/8147bb658fa2841f53e81230d216d6882a182e4b)]:
  - @krizaka/ui@2.0.0-beta.3
  - @krizaka/tokens@2.0.0-beta.3

## 2.0.0-beta.2

### Patch Changes

- Updated dependencies [[`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab), [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab)]:
  - @krizaka/tokens@2.0.0-beta.2
  - @krizaka/ui@2.0.0-beta.2

## 2.0.0-beta.1

### Patch Changes

- Updated dependencies [[`7de0337`](https://github.com/krizaka/krizaka-ui/commit/7de0337830983f4f2e1794d0a2cad1c77a77bda0)]:
  - @krizaka/ui@2.0.0-beta.1
  - @krizaka/tokens@2.0.0-beta.1

## 2.0.0-beta.0

### Patch Changes

- Updated dependencies [[`f5bf3c5`](https://github.com/krizaka/krizaka-ui/commit/f5bf3c5622d5c3d7068ba011b29b64b61dfb059f)]:
  - @krizaka/ui@2.0.0-beta.0
  - @krizaka/tokens@2.0.0-beta.0

## 1.3.0

### Patch Changes

- Updated dependencies [[`559b9b7`](https://github.com/krizaka/krizaka-ui/commit/559b9b70478e3e42c98f6dd220515d477d3f0b78)]:
  - @krizaka/ui@1.3.0
  - @krizaka/tokens@1.3.0

## 1.2.0

### Minor Changes

- [#5](https://github.com/krizaka/krizaka-ui/pull/5) [`dae54c9`](https://github.com/krizaka/krizaka-ui/commit/dae54c96626ad15cf3c55ec9129c3011358a230d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - @krizaka/tailwind: initial release — the Tailwind CSS v4 preset. `@import "@krizaka/tailwind"` brings the `--kz-*`
  tokens and the motion signature, maps every role to utilities with `@theme inline` (`bg-surface-1`, `text-fg-secondary`,
  `border-border-default`, `text-accent`, `rounded-xl`, `shadow-md`, `ease-kz`…), declares the illustration-only
  `light:` / `dark:` variants and makes `--kz-ease` the default transition easing.

### Patch Changes

- Updated dependencies [[`a46f9d4`](https://github.com/krizaka/krizaka-ui/commit/a46f9d423f1c151f37a10237f8cd5a27a25466ba), [`dae54c9`](https://github.com/krizaka/krizaka-ui/commit/dae54c96626ad15cf3c55ec9129c3011358a230d), [`adc494b`](https://github.com/krizaka/krizaka-ui/commit/adc494b9d1e0d7469e696ffe463e83f54bcbdde5)]:
  - @krizaka/ui@1.2.0
  - @krizaka/tokens@1.2.0
