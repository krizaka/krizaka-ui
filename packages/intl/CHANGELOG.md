# @krizaka/intl

## 0.4.0

### Minor Changes

- [#573](https://github.com/krizaka/krizaka-ui/pull/573) [`a3b1c41`](https://github.com/krizaka/krizaka-ui/commit/a3b1c41941f246c0f2438f993886427f34358406) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Prevent crashes when Intl.PluralRules or Intl.RelativeTimeFormat is absent (Android Hermes) with cached dependency-free en/fr fallbacks. Native Intl behavior is unchanged. Fallback plurals use unrounded cardinal rules; relative times use long numeric wording. Getter return types now include minimal select/format fallbacks, so native-only methods require a capability check.

## 0.3.0

### Minor Changes

- [#610](https://github.com/krizaka/krizaka-ui/pull/610) [`a4ba630`](https://github.com/krizaka/krizaka-ui/commit/a4ba6302e98a5bbef7d86b90e491fee6d0584d76) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Add `localDay(instant, timeZone)`: the calendar day (`yyyy-mm-dd`) an instant falls on in a time zone, so a rule dated by a local day is not judged by the UTC day.

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

- [#15](https://github.com/krizaka/krizaka-ui/pull/15) [`a455498`](https://github.com/krizaka/krizaka-ui/commit/a455498a7aec631c7743861d3fee775bf9a3d057) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Initial release: money, numbers, dates and plurals on `Intl`, zero dependency.
  
  `formatMoney(minorUnits, { currency, locale, display?, minorUnitDigits? })` (integers only — a float throws a
  `TypeError`; the currency's decimals come from `Intl`: JPY 0, USD 2, BHD 3), `currencyDigits`, `formatNumber`,
  `formatCompact`, `formatPercent`, `formatDate`, `formatRelative` (unit chosen automatically, `now` injectable),
  `plural` (`Intl.PluralRules`), and the cached `Intl` getters. Entries `.`, `./money`, `./number`, `./date`, `./plural`.

### Patch Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - First stable release: 0.1.0 (out of the `beta` pre-release, no API change).

## 0.1.0-beta.0

### Minor Changes

- [#15](https://github.com/krizaka/krizaka-ui/pull/15) [`a455498`](https://github.com/krizaka/krizaka-ui/commit/a455498a7aec631c7743861d3fee775bf9a3d057) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Initial release: money, numbers, dates and plurals on `Intl`, zero dependency.
  
  `formatMoney(minorUnits, { currency, locale, display?, minorUnitDigits? })` (integers only — a float throws a
  `TypeError`; the currency's decimals come from `Intl`: JPY 0, USD 2, BHD 3), `currencyDigits`, `formatNumber`,
  `formatCompact`, `formatPercent`, `formatDate`, `formatRelative` (unit chosen automatically, `now` injectable),
  `plural` (`Intl.PluralRules`), and the cached `Intl` getters. Entries `.`, `./money`, `./number`, `./date`, `./plural`.
