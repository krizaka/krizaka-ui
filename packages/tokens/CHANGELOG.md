# @krizaka/tokens

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
