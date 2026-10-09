# @krizaka/i18n

**The i18n engine of every Krizaka app, written once.** Typed message keys and placeholders from `en.json`, `format()`,
plural sets on `@krizaka/intl`, `<Rich>` for `<b>` and `<a>`, a React provider, and the `krizaka-i18n` CLI that checks
the catalogues and finds text written in the code. It replaces the `lib/i18n.ts` and the check script each app used to
carry.

[![npm](https://img.shields.io/npm/v/@krizaka/i18n/beta?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/i18n)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](../../LICENSE)

## The rule

> **Every user-facing string lives in `messages/<locale>.json`.** `en.json` is the reference: its shape types the keys,
> every other locale has exactly the same keys, the same `{placeholders}` and the same markup. The code holds keys,
> never words.

## Install

```bash
npm install @krizaka/i18n
```

Node ≥ 20, ESM only. React (≥ 18) only for `./rich` and `./react`; TypeScript only for `krizaka-i18n scan`.

| Entry | What | React |
| :-- | :-- | :-- |
| `@krizaka/i18n` | `createI18n`, `format`, `placeholdersOf`, `isPluralMessage`, the types | no |
| `@krizaka/i18n/rich` | `<Rich text href? renderLink?>` | no hook — Server Components too |
| `@krizaka/i18n/react` | `createI18nReact(i18n)` → `I18nProvider`, `useI18n` | client (`"use client"`) |
| `@krizaka/i18n/check` | `checkMessages`, `findUnused`, `scanHardcoded`, `main` (the CLI, programmatic) | no |
| `krizaka-i18n` (bin) | `check` · `scan` | no |

## Bind it once in the app

```ts
// lib/i18n.ts
import { createI18n } from "@krizaka/i18n";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

export type Locale = "en" | "fr";
export type Messages = typeof en;
// The type arguments make fr.json type-check against en.json: a missing key fails to compile.
export const i18n = createI18n<Messages, Locale>({ en, fr }, { defaultLocale: "en" });
export const { getDictionary, asLocale, t } = i18n;
export { format } from "@krizaka/i18n";
```

```ts
i18n.locales;                                  // ["en", "fr"]
i18n.asLocale("de");                           // "en" — the default for anything unsupported
i18n.getDictionary("fr").home.title;           // the catalogue, for Server Components and long content
t("auction.phase.SOLD");                       // the key is typed: a typo fails to compile
i18n.translator("fr")("home.lead", { count: 3, org: "krizaka" });
format("{count} repositories", { count: 23 }); // "23 repositories"; a missing value stays "{count}"
```

- **Keys** are dotted paths to a string or a plural set (`MessageKey<typeof en>`). Lists are content, read as a branch.
- **Placeholders**: a JSON import types messages as `string`, so `t` accepts any values; a catalogue written `as const`
  makes them required (`t("lead", {})` fails when `lead` is `"{count} items"`).
- **Plurals**: a plural set is an object of CLDR categories with `other`; `count` picks the form through
  `@krizaka/intl`'s `plural` (`zero` is the explicit "exactly 0" form, in any language):

  ```json
  { "bids": { "zero": "No bid yet", "one": "{count} bid", "other": "{count} bids" } }
  ```

  `t("bids", { count: 2 })` → `"2 bids"`; in French `0` and `1` take `one`.
- **Missing keys** fall back to the default locale, then to the key itself — never an empty string.

## React

```tsx
// app/components/I18nProvider.tsx
"use client";
import { createI18nReact } from "@krizaka/i18n/react";
import { i18n } from "@/lib/i18n";

export const { I18nProvider, useI18n } = createI18nReact(i18n);
// <I18nProvider locale={locale} setLocale={(l) => router.push(`/${l}`)}>…</I18nProvider>
// const { locale, messages, t, format, setLocale } = useI18n();
```

`setLocale` is the app's (a route, a cookie); outside a provider `useI18n()` reads the default locale. Server Components
skip the context and call `getDictionary(locale)`.

## `<Rich>` — `<b>` and `<a>`, nothing else

```tsx
import { Rich } from "@krizaka/i18n/rich";

<Rich text={t("home.lead")} />                        // "<b>Open</b> source" → <strong>Open</strong> source
<Rich text={t("legal.read")} href={["/terms", "/privacy"]} renderLink={({ href, children }) => <Link href={href!}>{children}</Link>} />
```

Messages are text, never HTML: an unknown or unbalanced tag is shown as written. Each `<a>` takes the next `href`; a
link without one renders its words only. `<b>` and `<a>` may hold each other.

## The CLI

```bash
krizaka-i18n check messages                 # same keys as en.json, no empty string, same {placeholders}, same markup
krizaka-i18n check messages --unused app --unused lib   # …and fail on keys no source reads
krizaka-i18n check messages --json          # machine-readable report for CI
krizaka-i18n scan app components --allow Krizaka --skip /app/api/   # hard-coded strings in .tsx (needs typescript)
```

- **`check <dir>`** — every `<locale>.json` of `<dir>` against `--reference` (default `en`): missing and unknown keys,
  empty strings, placeholders and markup that differ, a plural set where the reference has a string (or the reverse),
  markup other than `<b>`/`<a>`. A plural set may carry the categories its language needs (French `many`), as long as
  it has `other` and the same placeholders. `--unused <src>` (repeatable) is a heuristic: a key is read when its path
  appears in a source, when a branch is read dynamically (`` `phase.${p}` ``, `nav[id]`, `"plus." + k`) or taken whole
  (`const h = t.home;`, `messages("legal")`).
- **`scan <path>…`** — JSX text, `placeholder`/`title`/`aria-label`/`alt`/`label` literals, messages given to
  `set…Error`/`Message`/`Notice`/`Hint`/`Status`/`Feedback`/`Toast` setters, `label`/`hint`/`title`/`placeholder`/
  `description`/`message`/`text`/`caption` in data, and `alert`/`confirm`/`prompt`. `--allow` (comma-separated,
  repeatable) lists brand names; `--skip` (regular expression on the path, repeatable) leaves files out; tests and
  stories are always skipped, and Next.js `metadata`/`generateMetadata` objects too. `i18n-ignore` in a comment on the
  line or the line above is a deliberate exception. `--summary` counts per file.
- Exit codes: `0` clean, `1` problems, `2` usage error. `--json` prints `{ ok, reference, locales, messages, problems }`
  (`check`) or `{ ok, offenders }` (`scan`) on stdout.

```json
{ "scripts": { "lint": "eslint && krizaka-i18n check messages" } }
```

## License

[Apache-2.0](LICENSE)
