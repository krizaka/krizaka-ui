# @krizaka/sovkora-design-system — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/sovkora-design-system`**. Lives in `packages/sovkora-design-system` of the krizaka-ui
> monorepo since ADR-029 (moved from `krizaka/sovkora-ui-kit`, whose history stays in that repository's bundle): the
> root [`AGENTS.md`](../../AGENTS.md) applies first. It is the one **level 2** package of this repository (the Sovkora
> product composites, §2 of the root contract): its consumers are the Sovkora apps (`apps/web`, `apps/mobile`,
> `apps/desktop` of krizaka/sovkora), which install it from npm. Until 3.4.0 it was published as
> `@krizaka/orazaka-design-system` (sovkora-ui-kit); 4.0.0 is the first version under this name.

## 1. What belongs here

- **The theme is token values.** `src/theme.css` overrides the `--kz-*` roles of `@krizaka/tokens` (dark on `:root`,
  `html.light`, `html.theme-<name>`) on top of the brand layer `@krizaka/tokens/brands/sovkora.css`; product tokens are
  prefixed `--sovkora-*`. Every theme is tested at WCAG AA (`src/__tests__/theme.test.ts`) — a new theme or value passes it.
- **No primitive here.** Button, badge, field, skeleton… come from `@krizaka/ui` (`packages/ui`) and are re-exported.
  A missing primitive is a change there, never a local copy. In order: a token (`theme.css`), a variant
  (`tv({ extend })`) or a `className`, a composite that **composes** primitives (`CommandPalette` on `@krizaka/ui/command`,
  `ChatShowcase` on `@krizaka/ui/chat`).
- **Roles only**: no raw palette colour, no `light:` / `dark:`, no `[var(--…)]`, no template string in `className` —
  the four UI rules of `@krizaka/config`, strict on `src/**/*.tsx` and `registry/examples/**/*.tsx` (root
  `eslint.config.mjs`). `className` is merged with `cn()`: the override wins.
- **No app dependency**: components receive data **and words** through props (no i18n, no fetching) — `CommandPalette`
  requires its `commands` and `labels`; it navigates with `next/navigation` unless given `onNavigate`.
- **A persona, not an admin**: examples, showcases and recordings speak as a named person with a real need (Eric,
  finance lead) in a believable fictional workspace — never an admin account or an internal label (the registry test
  refuses "admin" in an example).
- **250 lines a file**, except a `*.registry.ts(x)` data file, which holds data only (a function in one fails the lint).
- Types of the domain come from `@krizaka/orazaka-shared` (`packages/orazaka-shared`), never redeclared.

## 2. The documentation of a component is written here

krizaka.com/docs/sovkora/ui is **generated from this package's registry** at every build of the site. A new or changed
component comes with:

- a `src/components/<name>.meta.ts` (typed by `src/meta.ts`): summary, **why it exists above Krizaka UI**, status
  (`deprecated` with `since` / `use` / `removedIn`), category, when to use / not, best practices, accessibility, the
  `@krizaka/ui` primitives it is built on (`builtOn: ["ui/command"]`), related, its imports;
- its named examples, `registry/examples/<name>/<example>.tsx` (≤ 40 lines, a realistic product scenario with a persona,
  importing `@krizaka/sovkora-design-system` as an app does);
- a JSDoc on every prop.

The foundations read `src/theme.css` and `@krizaka/tokens` (roles, both modes, named themes, contrasts, type scale) and
`foundations.meta.ts` (names, uses, the product rules — each quoted from the contract that states it). `pnpm build`
(`scripts/build-registry.mjs`, also run before `pack`) writes `registry/*.json` (git-ignored, published);
`scripts/registry.test.mjs` fails when an exported component has no meta, an example is missing, a prop has no
description, a reference does not resolve or a theme falls below AA.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/sovkora-design-system`: ESLint and `tsc`, Vitest (components on happy-dom with
  Testing Library and the jest-dom matchers; the registry and platform-version tests on Node), the registry build,
  size, publint.
- **Size budget** (gzip, React, Next and the `@krizaka/*` dependencies excluded): `.` ≤ 60 kB.
- Published surface: the TypeScript sources (`src`, without the tests) and `registry/`; the apps transpile them
  (`transpilePackages`). Exports `.`, `./theme.css`, `./registry/*`, `./registry/examples/*`, `./package.json`. No
  `attw`: the package ships sources, not compiled types.
- `@krizaka/ui`, `@krizaka/tailwind` and `@krizaka/tokens` are workspace siblings on one major
  (`scripts/platform-versions.test.mjs`).

## 4. Release

A changeset for every change to `src/`, `registry/` or `theme.css`. Not in the `fixed` group: its own version. Published
by `release.yml` like every package of this repository (trusted publisher to declare on npmjs.com: repository
`krizaka/krizaka-ui`, workflow `release.yml`).
