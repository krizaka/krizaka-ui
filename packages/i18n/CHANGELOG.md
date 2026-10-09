# @krizaka/i18n

## 0.1.0-beta.2

### Minor Changes

- [#26](https://github.com/krizaka/krizaka-ui/pull/26) [`440f052`](https://github.com/krizaka/krizaka-ui/commit/440f052ba070f73fd7cf4c968ece3e61a6a47054) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `<Rich>` takes `slots` (nodes in place of `{name}` placeholders — a link, an emphasised value — in plain text, bold and
  links; a placeholder without a slot stays as written) and `renderBold` (style the `<b>`, default `<strong>`): what
  Orochia's own `Rich` did, so it can re-export this one.

## 0.1.0-beta.1

### Patch Changes

- [#23](https://github.com/krizaka/krizaka-ui/pull/23) [`c97c6e4`](https://github.com/krizaka/krizaka-ui/commit/c97c6e4bf0cc9a09dc0c298226cc088433fe42f3) Thanks [@oussamaABID](https://github.com/oussamaABID)! - One set of declarations for every entry: `./react` now imports the `I18n` type from `.` instead of carrying its own
  copy, so `createI18nReact(createI18n(…))` type-checks in an app (the two copies of the conditional `Translate` type did
  not match). The publint step compiles a consumer against `dist/` to keep it that way.

## 0.1.0-beta.0

### Minor Changes

- [#20](https://github.com/krizaka/krizaka-ui/pull/20) [`c8f38f7`](https://github.com/krizaka/krizaka-ui/commit/c8f38f7f4244f085c53ed155f298279bf46e7759) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Initial release: the i18n engine of every Krizaka app, written once.
  
  `createI18n<Dict, Locale>(dictionaries, { defaultLocale })` → `{ t, translator, format, getDictionary, locales,
  asLocale, isLocale }` with keys typed by path (`"auction.phase.SOLD"`) and placeholders typed for literal catalogues;
  plural sets (`{ one, other, … }`) chosen by `@krizaka/intl`; fallback to the default locale, then the key. `format`
  (`{placeholder}`), `<Rich>` (`<b>`, `<a>` with `href`/`renderLink`, server-safe) in `./rich`, `createI18nReact(i18n)`
  → `I18nProvider`/`useI18n` in `./react` (client). The `krizaka-i18n` CLI: `check <dir>` (same keys as `en.json`, no
  empty string, same placeholders and markup, `--unused`, `--json`) and `scan <path>…` (hard-coded user-facing strings,
  TypeScript optional peer). Replaces the site's `scripts/check-messages.mjs` and Orochia's `scripts/check-i18n.mjs`.
