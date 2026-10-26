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

Node ≥ 22 or any evergreen browser. ESM only. Sub-paths (`@krizaka/intl/money`, `/number`, `/date`, `/plural`) import
one family; the root imports all of them.

### Hermes / missing Intl constructors

When `Intl.PluralRules` or `Intl.RelativeTimeFormat` is absent (for example on Android Hermes), the corresponding
getter returns a cached, dependency-free fallback instead. Native constructors, when present, are always used;
their options and errors are unchanged. `Intl.NumberFormat` and `Intl.DateTimeFormat` are still required.

- **Plurals:** unrounded cardinal rules for English (`one` for absolute 1) and French (`one` below absolute 2,
  `many` for nonzero multiples of a million); non-finite counts and unsupported languages use `other`.
  Plural options (including ordinal selection and digit rounding) are not applied by the fallback.
- **Relative time:** long numeric English/French wording (`1 day ago`, `dans 2 jours`), even with `numeric: "auto"`
  or `style: "short"` / `"narrow"`. Numbers use the requested locale's `Intl.NumberFormat`. Other languages use
  English wording. All units, second through year (including quarter), work in both directions.
- A locale list selects the first English or French entry for fallback rules/wording; no runtime default is used.
- The getters' return types now include a minimal fallback: only **`select`** / **`format`** is guaranteed.
  Check for a native-only method (e.g. `"resolvedOptions" in formatter`) before using it. These fallbacks are not
  full Intl polyfills; install one in the app if complete locale, option or method support is needed.

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
| `localDay(instant, timeZone)` | `./date` | `2026-10-24T01:30Z` in `America/Toronto` → `2026-10-23` | the same day, `2026-10-23` |
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
- **`localDay`** — the calendar day (`yyyy-mm-dd`) an instant falls on in a time zone. Use it for any rule or deadline that
  is a day (a law in force on a date), never `toISOString().slice(0, 10)`, which is the UTC day.
- Dates accept a `Date`, an epoch in milliseconds or an ISO string; an invalid one throws a `RangeError`.

## Bind it once in the app

The app knows its currency and its locale; the components only pass cents. One file, one line per format:

```ts
// apps/web/lib/money.ts — the only line that knows the app's currency
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
