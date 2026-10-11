# @krizaka/tokens

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
