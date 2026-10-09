---
"@krizaka/intl": minor
---

Initial release: money, numbers, dates and plurals on `Intl`, zero dependency.

`formatMoney(minorUnits, { currency, locale, display?, minorUnitDigits? })` (integers only — a float throws a
`TypeError`; the currency's decimals come from `Intl`: JPY 0, USD 2, BHD 3), `currencyDigits`, `formatNumber`,
`formatCompact`, `formatPercent`, `formatDate`, `formatRelative` (unit chosen automatically, `now` injectable),
`plural` (`Intl.PluralRules`), and the cached `Intl` getters. Entries `.`, `./money`, `./number`, `./date`, `./plural`.
