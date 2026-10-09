# @krizaka/i18n

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
