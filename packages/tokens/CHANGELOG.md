# @krizaka/tokens

## 3.1.0

No changes in this release.

## 3.0.0

No changes in this release.

## 2.10.0

### Minor Changes

- [#105](https://github.com/krizaka/krizaka-ui/pull/105) [`dc6156f`](https://github.com/krizaka/krizaka-ui/commit/dc6156fcac67f6285b966c2a27d56af75fc8db10) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yororis brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yororis` brand — `brands/yororis.css`, `.brand-yororis` in `brands/scoped.css`, `brands.yororis` and `marks.yororis` (web and native) — sand → sage, the accent on sage (≥ 60° from `--kz-success` and `--kz-warning`), the sand (mark, `accent-2`) told apart from the warning amber by its chroma, AA-tested in dark and light. `@krizaka/ui`: `YororisLogo` (web) and `YororisMark` (native) — "the hold": two filled leaves rising into a "Y" that cup a warm core, one node, the moment, on the orbit — `ProductLogo` / `ProductMark` accept `id="yororis"`, the "Brand family" story shows Krizaka and its four products; the flock gains the `crane` ("la grue écoute", the bird of listening). `@krizaka/icons`: `MomentIcon`, `ThreadIcon`, `KeepIcon`.

## 2.9.0

No changes in this release.

## 2.8.0

### Minor Changes

- [#90](https://github.com/krizaka/krizaka-ui/pull/90) [`afce4b2`](https://github.com/krizaka/krizaka-ui/commit/afce4b2ec14c42c7550fc911af7db46d2a5d8bb6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yazakia brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yazakia` brand — `brands/yazakia.css`, `.brand-yazakia` in `brands/scoped.css`, `brands.yazakia` and `marks.yazakia` (web and native) — emerald → turquoise, the accent on turquoise (hue 174, 14° from `--kz-success`), AA-tested in dark and light. `@krizaka/ui`: `YazakiaLogo` (web) and `YazakiaMark` (native) — two arms that lean in and meet, a core, the pair on the orbit — `ProductLogo` / `ProductMark` accept `id="yazakia"`, the "Brand family" story; the flock gains the `lovebird` ("l'inséparable présente", the bird of introductions). `@krizaka/icons`: `BatchIcon`, `DebriefIcon`, `IntroIcon`.

## 2.7.0

No changes in this release.

## 2.6.0

No changes in this release.

## 2.5.0

### Minor Changes

- [#76](https://github.com/krizaka/krizaka-ui/pull/76) [`62906f4`](https://github.com/krizaka/krizaka-ui/commit/62906f4cc2a56675499253d139df2921123cdd6e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **The Krizaka material — tokens and utilities (BRAND.md §6, "Surfaces & materials", and §6.1, "the griffe").** Light
  comes from above: what you press rises, what you fill sinks, what floats is glass, only what acts glows.
  
  - `@krizaka/tokens`: new roles in `material.tokens.json` — `--kz-surface-sheen`, `--kz-fill-shade`, `--kz-edge-light`,
    `--kz-edge-on-fill`, `--kz-edge-well`, `--kz-glass-bg` / `-border` / `-blur`, `--kz-ring-width` / `-offset` / `-halo`,
    `--kz-control-sm|md|lg|field` (tightened under `[data-density="compact"]`), the griffe `--kz-cut-shape` (`bevel`) and
    `--kz-cut-size`; the ink-tinted multi-layer shadows `--kz-shadow-raised|floating|overlay`; the status tints
    `--kz-success-soft|warning-soft|danger-soft`; `--kz-radius-xs` and `--kz-radius-2xl`; `--kz-ease-spring` and
    `--kz-duration-instant|fast|base` — **0 ms under `prefers-reduced-motion`** (a generated block). Native: the new colour
    roles in `themes.*`, `radius.xs` / `radius["2xl"]`, `motion.spring` and `motion.duration`, `shadows.<theme>` as React
    Native `boxShadow` strings, `cut.size`. Contrast tests: text on glass over anything the page shows, text on the status
    tints, on-accent down to the shaded bottom of a fill in every brand and both themes.
  - `@krizaka/tailwind`: `bg-sheen`, `bg-fill-shade`, `bg-halo`, `glass` (+ `bg-glass`, `border-glass-border`),
    `shadow-raised|floating|overlay`, `shadow-glow(-lg)` (the brand's glow, composed where used), `inset-shadow-edge`,
    `inset-shadow-edge-fill`, `inset-shadow-well`, `focus-ring` / `focus-ring-inset` (the signature focus ring),
    `node` / `node-lit`, `ease-spring`, `bg-*-soft`. (`--kz-radius-xs` and `--kz-radius-2xl` are tokens, not mapped: Tailwind's own `rounded-xs` / `rounded-2xl` keep their sizes.)
  - `@krizaka/ui/native`: `Theme`, `Radius` and `Motion` follow the new roles; `useTheme().motion.duration` is 0 ms when
    the system reduces motion.
  
  Nothing changes visually yet: the primitives adopt the material in the next release.

## 2.4.0

### Minor Changes

- [#66](https://github.com/krizaka/krizaka-ui/pull/66) [`1ebdb61`](https://github.com/krizaka/krizaka-ui/commit/1ebdb61ce394a3e584dce40c5740b3193da8ea5e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The Krizaka typography in the tokens. `--kz-font-sans` is Inter, `--kz-font-display` Plus Jakarta Sans (no longer an
  alias of sans), `--kz-font-mono` JetBrains Mono — each followed by its metric-matched fallback of `@krizaka/fonts` —
  and `--kz-font-text` aliases sans. The type scale `--kz-type-<step>-{size,line-height,weight,tracking}` (display-2xl …
  display-sm, title-lg, title-md, body-lg/md/sm, caption, overline, mono-md, mono-sm), exported as `typeScale` (index: CSS;
  native: dp, with the role of each step). `@krizaka/tailwind`: `font-text` and `text-<step>` (size, line height, weight
  and tracking together: `font-display text-display-xl`). Products that override `--kz-font-*` keep their faces.

## 2.3.0

### Minor Changes

- [#65](https://github.com/krizaka/krizaka-ui/pull/65) [`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Signature components and next-level feedback (DS2, wave W1 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)) — additions only, the 2.x API is unchanged:
  
  - **New entries.** `./iso` (the isometric kit: `IsoHub` from data, `IsoScene`, `IsoPrism`, `IsoStack`, `IsoDome`, `IsoTile`, `IsoLink`, `IsoNode`, `IsoLabel` — server-rendered SVG, no client JavaScript), `./nav-bar` (floating bar that tightens on scroll, one light gliding between items, accessible menus, mobile panel), `./loader` (`Loader`: delay, minimum duration, ETA, drawn and announced endings; `LoadingRegion`: content ⇄ skeleton hand-over; `useDelayedWait`), `./number-ticker`, `./glow-card`, `./marquee`, `./stepper`, `./meter`, `./chip-link` (a filter that is a link, server-safe `chipVariants`, [#45](https://github.com/krizaka/krizaka-ui/issues/45)) and `./motion` (`MotionObserver`, `RotatingWord`).
  - **Motion ([#41](https://github.com/krizaka/krizaka-ui/issues/41)).** `MotionObserver` pauses what is off screen (`data-offscreen`), lets the first screen settle (`html[data-motion]`), drives `[data-kz-magnetic]`; `RotatingWord` keeps the width of its longest word (no layout shift); `[data-reveal="soft"]`; icon nodes light up and arrows lean in links and buttons.
  - **Button.** `shape="cut"` (45° corners), `loading` draws the Krizaka loader glyph (`indicator={false}` to keep your own), `progress`, `status` success·error (drawn, a ring opens, an error shakes once), `announce`, `shimmer`, `magnetic`; `IconButton` swaps its icon for the glyph.
  - **Feedback.** `Spinner` is the Krizaka glyph (a hexagon traced by light around a node) and takes a `value`; `LoaderGlyph` exported. `Progress`: `showLabel`, `eta`, `buffer`, `segments`, `status` paused·error. `Skeleton`: one brand reflection across the page, `SkeletonText`, `SkeletonShape` (the real component as its own skeleton). `Toast`: a hairline counts the time left (paused on hover), `undoToast`, `progressToast`, `groupedToast`.
  - **Tabs** glide one light to the active tab in every variant. **Dialog** `placement="left"` ([#43](https://github.com/krizaka/krizaka-ui/issues/43)), drawers slide from their edge.
  - Visual changes (new screenshots): Spinner, Button loading, Skeleton, Tabs, the side dialog's entrance.

## 2.2.0

No changes in this release.

## 2.1.0

### Minor Changes

- [#50](https://github.com/krizaka/krizaka-ui/pull/50) [`248927c`](https://github.com/krizaka/krizaka-ui/commit/248927c06c4c2735bca2e3f5fabe54e140d91913) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **The Orazaka mark wears the brand's orange, and a product can be dark (or light) first without a flash.**
  
  - **Orazaka mark (visual change).** `OrazakaLogo`, `OrazakaMark` (native) and `ProductLogo`/`ProductMark id="orazaka"`
    leave amber (`#b45309 → #f59e0b`, hues 26 → 38 — the light stop was the hue of `--kz-warning` and read at 2:1 on a
    light page) for the brand's orange: deep orange `hsl(26 90.5% 37.1%)` #b45309 → orange `hsl(26 92% 45%)` #dc6509, on
    the accent's hue 26. Every stop reads ≥ 3:1 on surfaces 0–2 in dark and light; the halo and the core's glow follow.
    Geometry and animation unchanged. The 2.0 version stays visible in Storybook, *Brand/Evolution*.
  - **`marks` (`@krizaka/tokens`, `@krizaka/tokens/native`).** Each brand file carries its mark's emblem gradient
    (`$extensions["com.krizaka"].mark`), exported as `marks.<id>` (`[offset, colour]` stops); the three marks read it —
    no colour copied into `@krizaka/ui`. Krizaka and Orochia values are unchanged. The generated constants are marked
    pure, so a bundler keeps only what an app imports.
  - **`ThemeScript defaultMode`** (fixes [#47](https://github.com/krizaka/krizaka-ui/issues/47)). `ThemeScript` takes the same `defaultMode` (`"dark" | "light" | "system"`,
    default `"system"`) as `ThemeProvider`: with nothing persisted, the script applies it before the first paint and the
    provider reports it, so the first toggle is always visible. The visitor's choice (`kz-theme`) still wins; an unknown
    stored value falls back to the default. `ThemeProvider` also applies the mode when an app renders it without the
    script. New type `ThemeScriptProps`.

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

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `.theme-light`: the light values and the aliases on a subtree — a theme preview stays light inside a dark page, the
  counterpart of `.theme-dark` (a separate block: `html.light` is unchanged, so a product's `:root` overrides still win
  there). Tested for parity with `.theme-dark`.

## 2.0.0-beta.6

No changes in this release.

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

## 2.0.0-beta.4

No changes in this release.

## 2.0.0-beta.3

No changes in this release.

## 2.0.0-beta.2

### Minor Changes

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `.theme-light`: the light values and the aliases on a subtree — a theme preview stays light inside a dark page, the
  counterpart of `.theme-dark` (a separate block: `html.light` is unchanged, so a product's `:root` overrides still win
  there). Tested for parity with `.theme-dark`.

## 2.0.0-beta.1

No changes in this release.

## 2.0.0-beta.0

No changes in this release.

## 1.3.0

No changes in this release.

## 1.2.0

### Minor Changes

- [#3](https://github.com/krizaka/krizaka-ui/pull/3) [`adc494b`](https://github.com/krizaka/krizaka-ui/commit/adc494b9d1e0d7469e696ffe463e83f54bcbdde5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - @krizaka/tokens: initial release — the semantic `--kz-*` tokens from one DTCG source: `tokens.css` (dark on `:root`
  and `.theme-dark`, light on `html.light`, media invariants), typed constants (`tokens`, `values`) and React Native
  themes (`@krizaka/tokens/native`).
