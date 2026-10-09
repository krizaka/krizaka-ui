# @krizaka/i18n — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/i18n`**. Lives in `packages/i18n` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **The i18n engine of every Krizaka app**, written once: typed message keys from `en.json`, `format` (`{placeholder}`
  replacement), plural sets chosen by `@krizaka/intl`, `<Rich>` (`<b>`, `<a>`), the React provider/hook, and the
  `krizaka-i18n` CLI (`check` the catalogues, `scan` the sources for hard-coded strings).
- The apps keep their **catalogues** (`messages/<locale>.json`), their locale **routing** (cookie, URL prefix) and their
  brand names (`scan --allow`). None of these lives here: no product word, no locale list, no route.
- Not here: number, money and date formatting (that is `@krizaka/intl`), loading catalogues over the network.

## 2. Rules

- One implementation of `format` and `Rich` in the organisation: an app re-exports them, it never re-implements them.
- `.` and `./check` have no React; `./rich` has no hook (Server Component safe); only `./react` is a client module
  (`"use client"` banner). React and TypeScript are optional peer dependencies; `@krizaka/intl` is the one dependency.
- A message is text, never HTML: `<Rich>` builds elements, it never sets inner HTML. Markup is `<b>` and `<a>` only
  (the CLI refuses the rest); a link's URL is a prop, never in the message.
- A missing key never renders empty: fallback to the default locale, then the key itself.
- `src/` is TypeScript built by `tsup` to `dist/` (ESM + types, one file per entry; the bin carries its shebang).

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/i18n`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**), build,
  size, publint + attw (`esm-only`).
- Type-level behaviour (keys by path, placeholders of literal messages) is tested with `expectTypeOf` and
  `@ts-expect-error`.
- The CLI's output and exit codes (0 clean, 1 problems, 2 usage) are a contract: the apps' CI reads them.
- **Size budget** (gzip): `.` ≤ 1.5 kB, `./rich` ≤ 1 kB, `./react` ≤ 2 kB.

## 4. Release

A changeset for every change to `src/`. `@krizaka/i18n` is **not** in the `fixed` group: it has its own version
(0.x while the apps adopt it).
