# @krizaka/intl

**Money, numbers, dates and plurals, formatted the same way in every Krizaka product.** Zero dependency, built on
`Intl`, one cached formatter per locale and options. It replaces the `new Intl.NumberFormat("en-US", …)` hard-coded in
each app.

[![npm](https://img.shields.io/npm/v/@krizaka/intl/beta?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/intl)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](../../LICENSE)

## The rule

> **The cents are the ledger's money, never a float.** An amount travels as an integer of minor units (cents for USD,
> yen for JPY) from the database to the screen; only `formatMoney` turns it into text. `formatMoney(12.5, …)` throws a
> `TypeError`.

The locale is always passed: nothing reads the runtime's default, so a server render and a browser render say the same.

## Install

```bash
npm install @krizaka/intl
```

Node ≥ 20 or any evergreen browser. ESM only. Sub-paths (`@krizaka/intl/money`, `/number`, `/date`, `/plural`) import
one family; the root imports all of them (≈ 1.1 kB gzip).

## Functions

| Function | From | Example (en-US) | Example (fr-CA) |
| :-- | :-- | :-- | :-- |
| `formatMoney(minorUnits, { currency, locale, display?, minorUnitDigits? })` | `./money` | `formatMoney(123450, { currency: "USD", locale })` → `$1,234.50` | `1 234,50 $ US` |
| `currencyDigits(currency)` | `./money` | `JPY` → `0`, `USD` → `2`, `BHD` → `3` | — |
| `formatNumber(value, { locale, …Intl options })` | `./number` | `1234567.891` → `1,234,567.891` | `1 234 567,891` |
| `formatCompact(value, { locale, maximumFractionDigits? = 1 })` | `./number` | `12345` → `12.3K`, `1234567` → `1.2M` | `12,3 k`, `1,2 M` |
| `formatPercent(ratio, { locale, …Intl options })` | `./number` | `0.125` → `13%` | `13 %` |
| `formatDate(date, { locale, style? = "medium", timeStyle?, timeZone? })` | `./date` | `Oct 9, 2026` (`short` `10/9/26`, `long` `October 9, 2026`) | `9 oct. 2026` |
| `formatRelative(date, { locale, now?, numeric? = "auto", style? })` | `./date` | `45 seconds ago`, `3 hours ago`, `yesterday`, `next month` | `il y a 45 secondes`, `hier`, `le mois prochain` |
| `plural(count, locale, { zero?, one?, two?, few?, many?, other })` | `./plural` | `plural(1, locale, { one: "bid", other: "bids" })` → `bid` | `0` and `1` are `one` |
| `getNumberFormat` · `getDateTimeFormat` · `getRelativeTimeFormat` · `getPluralRules` | `.` | The cached `Intl` objects, for a format this package does not wrap. | |

Details:

- **`formatMoney`** — `display`: `"symbol"` (default, `$` / `US$` by locale), `"code"` (`USD 1,234.50`) or
  `"narrowSymbol"` (always `$`). The decimals are the currency's own, read from `Intl`. `minorUnitDigits` overrides
  the ledger's scale (e.g. `3` for mills of a dollar); the amount is still shown with the currency's digits, rounded
  half away from zero. A non-integer, `NaN`, `Infinity` or an integer past 2^53 throws a `TypeError`.
- **`formatRelative`** — picks the unit (second → minute → hour → day → week → month → year) so the rounded number
  stays below the next unit: −45 s → `45 seconds ago`, −3 min, −2 h, −3 d, +31 d → `next month`. `now` defaults to
  `Date.now()`: inject it in tests and wherever a server render must be stable.
- **`plural`** — `Intl.PluralRules` categories; a missing one falls back to `other`; `zero` is used for exactly `0`
  in any language (`"no bids"`). It returns the form, of any type (a string, a message key, a component).
- Dates accept a `Date`, an epoch in milliseconds or an ISO string; an invalid one throws a `RangeError`.

## Bind it once in the app

The app knows its currency and its locale; the components only pass cents. One file, one line per format:

```ts
// orochia/apps/web/lib/money.ts — the only line that knows Orochia's currency
import { formatMoney } from "@krizaka/intl";
import { currentLocale } from "@/lib/i18n";

export const money = (cents: number) => formatMoney(cents, { currency: "USD", locale: currentLocale() });
```

```tsx
<Card.Stat label={t(price.labelKey)}>{money(price.cents)}</Card.Stat>
```

Before, `usd(cents)` divided by 100 and formatted in `en-US` whatever the reader's language; after, the French reader
sees `1 234,50 $ US` and the ledger never meets a float.

## License

[Apache-2.0](LICENSE)
