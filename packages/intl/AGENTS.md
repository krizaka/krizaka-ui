# @krizaka/intl — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/intl`**. Lives in `packages/intl` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Formatting** shared by every product: money, numbers, dates, relative times, plural forms — level 0, no UI, no
  React. One function per need, the same output in every app for the same locale.
- No product word, no currency or locale by default: the app binds them once (`lib/money.ts`), this package never
  guesses them.
- Not here: message catalogues and `t()` (that is `@krizaka/i18n`, planned), parsing, time-zone databases.

## 2. Rules

- **Zero runtime dependency**: `Intl` only (Node ≥ 20, every evergreen browser).
- **Money is integer minor units**, never a float: `formatMoney` refuses a non-integer or an unsafe integer
  (`TypeError`) and hands `Intl` an exact decimal string. The currency's digits come from `Intl` (JPY 0, USD 2, BHD 3).
- **The locale is always explicit** (an argument, never the runtime default): server and client render the same text.
- Every `Intl` object goes through `src/cache.ts` (one instance per kind, locale and options). Never `new Intl.*` in a
  formatter.
- `src/` is TypeScript built by `tsup` to `dist/` (ESM + types, one file per sub-path, the cache shared as a chunk).

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/intl`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced** —
  functions, lines, branches), build, size, publint + attw (`esm-only`).
- Tests cover en-US and fr-CA for every function; ICU's no-break spaces are written out (` `) or normalised,
  never typed as plain spaces.
- **Size budget** (gzip): `.` ≤ 2 kB.
- Published surface: exports `.`, `./money`, `./number`, `./date`, `./plural`, `./package.json`; files `dist`,
  `README.md`, `LICENSE`. Removing or renaming a function or an option, or changing an output for the same input
  (other than an ICU update), is a breaking change.

## 4. Release

A changeset for every change to `src/`. `@krizaka/intl` is **not** in the `fixed` group: it has its own version
(0.x while the products adopt it).
