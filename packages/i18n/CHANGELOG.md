# @krizaka/i18n

## 0.2.6

### Patch Changes

- [#781](https://github.com/krizaka/krizaka-ui/pull/781) [`209618f`](https://github.com/krizaka/krizaka-ui/commit/209618fc4e32e620ae426b0598f1f7889ba7a1d9) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Fix 37 SonarCloud bugs in the published packages (comparators, regular expressions, number parsing). No API change. @krizaka/tokens and @krizaka/tailwind follow @krizaka/ui (fixed group).

## 0.2.5

### Patch Changes

- Updated dependencies [[`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812)]:
  - @krizaka/intl@0.4.0

## 0.2.4

### Patch Changes

- Updated dependencies [[`a4ba630`](https://github.com/krizaka/krizaka-ui/commit/a4ba6302e98a5bbef7d86b90e491fee6d0584d76)]:
  - @krizaka/intl@0.3.0

## 0.2.3

### Patch Changes

- [#332](https://github.com/krizaka/krizaka-ui/pull/332) [`057732b`](https://github.com/krizaka/krizaka-ui/commit/057732be1fdf99688163920b4bfc3550357e86e1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The TypeScript peer is `>=5`, not `^5`: an app on TypeScript 6 (orochia-mobile) installs it without an override.

## 0.2.2

### Patch Changes

- [#274](https://github.com/krizaka/krizaka-ui/pull/274) [`ef85add`](https://github.com/krizaka/krizaka-ui/commit/ef85add0cacb882f358a689a6a19102bffa3a89c) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Linear-time trimming of trailing slashes (`defaultAvatarUrl`) and of array indices (`findUnused`): CodeQL polynomial-ReDoS findings. A compiled `.pyc` is no longer tracked.

## 0.2.1

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.
- Updated dependencies [[`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e)]:
  - @krizaka/intl@0.2.1

## 0.2.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

### Patch Changes

- Updated dependencies [[`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703)]:
  - @krizaka/intl@0.2.0

## 0.1.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).
- Updated dependencies [[`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5)]:
  - @krizaka/intl@0.1.1

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
