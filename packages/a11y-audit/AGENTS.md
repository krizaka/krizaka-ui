# @krizaka/a11y-audit — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/a11y-audit`**. Lives in `packages/a11y-audit`: the root [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The accessibility guard of the products' page audits (krizaka-ui#747, « a bug means a missing guard »): axe-core with the WCAG 2.1 AA set,
  run on a Playwright `Page`, and the ratchet (`a11y-baseline.json`: per-rule counts, a new violation fails, the count only goes down).
- Not here: the crawl itself (each app visits its own routes and personas), a fix, a rule exception per app.

## 2. Rules

- **The only door to `axe-core`** (MPL-2.0, tests only): apps never import it. Pinned exactly; a bump re-records nothing by itself.
- Node only, no browser bundle; the page is typed structurally (`evaluate`), so `playwright` and `playwright-core` both fit.
- Counting unit: one failing node per rule, route, theme and normalised selector (never per width). Changing it is breaking: every baseline moves.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/a11y-audit`: ESLint and `tsc`, tests (Vitest; the axe wrapper is proved in real Chromium), build, size, publint + attw.
- Published surface: export `.`, `./package.json`; files `dist`, `README.md`, `SKILL.md`, `LICENSE`.

## 4. Release

A changeset for every change to `src/`. Its own version (0.x while the products adopt it).
