# @krizaka/intl

## 0.1.0-beta.0

### Minor Changes

- [#15](https://github.com/krizaka/krizaka-ui/pull/15) [`a455498`](https://github.com/krizaka/krizaka-ui/commit/a455498a7aec631c7743861d3fee775bf9a3d057) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Initial release: money, numbers, dates and plurals on `Intl`, zero dependency.
  
  `formatMoney(minorUnits, { currency, locale, display?, minorUnitDigits? })` (integers only — a float throws a
  `TypeError`; the currency's decimals come from `Intl`: JPY 0, USD 2, BHD 3), `currencyDigits`, `formatNumber`,
  `formatCompact`, `formatPercent`, `formatDate`, `formatRelative` (unit chosen automatically, `now` injectable),
  `plural` (`Intl.PluralRules`), and the cached `Intl` getters. Entries `.`, `./money`, `./number`, `./date`, `./plural`.
