# @krizaka/i18n

## 0.1.0

### Minor Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Ship one language to the browser. `createI18nReact({ locales, defaultLocale })` binds the React side without the
  catalogues, and `<I18nProvider locale messages>` takes the active catalogue resolved on the server
  (`i18n.getDictionary(locale)`); over a full engine `messages` is optional and falls back to the default catalogue.
  `createTranslator(locale, messages, fallback?)` is exported from `@krizaka/i18n`. First stable release: 0.1.0.

- [#20](https://github.com/krizaka/krizaka-ui/pull/20) [`c8f38f7`](https://github.com/krizaka/krizaka-ui/commit/c8f38f7f4244f085c53ed155f298279bf46e7759) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Initial release: the i18n engine of every Krizaka app, written once.
  
  `createI18n<Dict, Locale>(dictionaries, { defaultLocale })` → `{ t, translator, format, getDictionary, locales,
  asLocale, isLocale }` with keys typed by path (`"auction.phase.SOLD"`) and placeholders typed for literal catalogues;
  plural sets (`{ one, other, … }`) chosen by `@krizaka/intl`; fallback to the default locale, then the key. `format`
  (`{placeholder}`), `<Rich>` (`<b>`, `<a>` with `href`/`renderLink`, server-safe) in `./rich`, `createI18nReact(i18n)`
  → `I18nProvider`/`useI18n` in `./react` (client). The `krizaka-i18n` CLI: `check <dir>` (same keys as `en.json`, no
  empty string, same placeholders and markup, `--unused`, `--json`) and `scan <path>…` (hard-coded user-facing strings,
  TypeScript optional peer). Replaces the site's `scripts/check-messages.mjs` and Orochia's `scripts/check-i18n.mjs`.

- [#26](https://github.com/krizaka/krizaka-ui/pull/26) [`440f052`](https://github.com/krizaka/krizaka-ui/commit/440f052ba070f73fd7cf4c968ece3e61a6a47054) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `<Rich>` takes `slots` (nodes in place of `{name}` placeholders — a link, an emphasised value — in plain text, bold and
  links; a placeholder without a slot stays as written) and `renderBold` (style the `<b>`, default `<strong>`): what
  Orochia's own `Rich` did, so it can re-export this one.

### Patch Changes

- [#23](https://github.com/krizaka/krizaka-ui/pull/23) [`c97c6e4`](https://github.com/krizaka/krizaka-ui/commit/c97c6e4bf0cc9a09dc0c298226cc088433fe42f3) Thanks [@oussamaABID](https://github.com/oussamaABID)! - One set of declarations for every entry: `./react` now imports the `I18n` type from `.` instead of carrying its own
  copy, so `createI18nReact(createI18n(…))` type-checks in an app (the two copies of the conditional `Translate` type did
  not match). The publint step compiles a consumer against `dist/` to keep it that way.
- Updated dependencies [[`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`a455498`](https://github.com/krizaka/krizaka-ui/commit/a455498a7aec631c7743861d3fee775bf9a3d057)]:
  - @krizaka/intl@0.1.0

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
