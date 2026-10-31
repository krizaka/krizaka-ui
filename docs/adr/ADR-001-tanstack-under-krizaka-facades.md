# ADR-001 — TanStack under Krizaka facades: share the brain, own the skin

- **Status:** accepted — 2026-10-12 (decision of 2026-10-11 23:30: complete migration, light validation)
- **Scope:** every Krizaka JavaScript repository — the `@krizaka/*` packages of this monorepo and the product apps
  (Orazaka, the former products, krizaka.com)
- **Enforced by:** `@krizaka/config` — `krizakaStack()` (ESLint), `@krizaka/config/dependency-cruiser`, `krizaka-ratchet`

## Context

Our apps hand-write what headless engines already do better. Measured on 2026-10-11: a former product web carries ~3,000 lines
of home-made server-state handling (chat, notifications, stories, two event streams, its own reconnecting realtime
client, an upload queue with retries, a rate-limit store), 25 hand-written forms, 376 `useState` and 99 `useEffect`;
Orazaka web-client adopted TanStack Query at 3 `useQuery` over 3,456 lines of hooks, with 27 tables and 11 forms of its
own. Across the products: **36 hand-written forms, 42 tables, 23 `FlatList`s** without serious virtualisation.
`@krizaka/ui` itself re-implements a `DataTable` (449 lines: sorting and selection only), a `Pagination`, a regex code
highlighter and an upload queue; `@krizaka/charts` 0.x sits on ECharts (157 kB gzipped).

Nobody uses the Krizaka products yet. We migrate everything at once, without backward compatibility, and accept the risk.

## Decision

**Share the brain, own the skin.** Everything that is *server state, form, table, virtualisation, cadence* runs on the
**headless** TanStack engines, **behind `@krizaka/*` facades** — one version, one author per invariant, like everything
else. Everything that *is seen* — primitives, marks, motion, themes — stays ours, published on npm, never copied. A
product shares **logic** between its web and its mobile app (contracts, queries, forms, state, messages), not the DOM.

### Placement rule

Every headless engine enters through a `@krizaka/*` package, never through a product. A product imports
`@krizaka/query`, `@krizaka/ui/data-table`, `@krizaka/ui/form`, `@krizaka/ui/virtual`, `@krizaka/pacer` — never
`@tanstack/*`. `@krizaka/query` re-exports `@tanstack/react-query`; the facade's version is the contract, and a TanStack
break is fixed in one place.

### TanStack on 2026-10-11, and our verdict

| Library | Status | Verdict |
| :-- | :-- | :-- |
| Query | v5 stable | **Adopt** → `@krizaka/query` (presets, SSE bridge, typed fetch, RN persister) |
| Table | v9 | **Adopt** → `@krizaka/ui/data-table` v2 (API redone, no v1 compatibility) |
| Form | v1 stable | **Adopt** → `@krizaka/ui/form` (web + native) |
| Virtual | v3 stable | **Adopt** → `@krizaka/ui/virtual` (web); native = FlashList v2 |
| Charts | 1.0 stable (RN experimental) | **Migrate** `@krizaka/charts` to it (web); ECharts removed |
| Markdown | 1.0 | **Adopt** → `@krizaka/ui/markdown` |
| Highlight | 1.0 | **Adopt** → replaces the regex of `code-block` |
| Pacer | beta | **Facade** `@krizaka/pacer` (our API) |
| DB | beta | **Watch** — first candidates: a former product messages and notifications |
| AI | RC | **Experiment**, client side only (`useChat` over Orazaka's SSE); the server stays Orazaka |
| Store | alpha | **No** — Zustand |
| Hotkeys | alpha | **Later** (command palette) |
| Start / Router | RC / v1 | **No** — Next.js App Router and Expo Router stay |
| Intent | alpha | **Yes** — every `@krizaka/*` ships its SKILL.md |
| Devtools | — | **Yes**, in development, wired by `@krizaka/query` |

### Decisions S1–S14

| # | Subject | Decision |
| :-- | :-- | :-- |
| S1 | Server state | TanStack Query v5 through `@krizaka/query` (re-export, presets, SSE bridge, typed Problem Details fetch, persister). **A Server Component renders the first screen, Query takes over** (prefetch + `HydrationBoundary`); never a `fetch` in a client `useEffect`. |
| S2 | Tables | `@krizaka/ui/data-table` v2 on TanStack Table v9, **API redone without v1 compatibility**: filters, facets, grouping, visibility, pinning, server mode, virtualisation; `table` exposed as an escape hatch. |
| S3 | Forms | `@krizaka/ui/form` on TanStack Form v1: `createKrizakaForm()` typed by zod, fields = our primitives, i18n errors, submit by Server Action or Query mutation; `./native/form` parity. |
| S4 | Lists | Web: `@krizaka/ui/virtual` (TanStack Virtual); native: `@krizaka/ui/native/list` on FlashList v2. |
| S5 | Cadence | `@krizaka/pacer` (facade over TanStack Pacer beta): `useDebouncedValue`, `useThrottledCallback`, `createQueue`, `RateLimiter`. |
| S6 | Client state | Zustand, slices per domain in `packages/core/state`; never server state (Query), never URL state (router). |
| S7 | Charts | **Migration**, no spike: `@krizaka/charts` moves to TanStack Charts (web), same public API if it holds, else the better one; ECharts removed; native stays our SVG, then Skia. |
| S8 | Markdown & code | `@krizaka/ui/markdown` (TanStack Markdown), `code-block` on TanStack Highlight. Fumadocs stays on the site. |
| S9 | Motion | Unchanged: CSS/WAAPI in `@krizaka/ui`; `framer-motion` leaves krizaka.com and Orazaka web-client; Aceternity is a reference, not a dependency; no R3F by default. Native: Reanimated + Skia for drawn surfaces. |
| S10 | Product monorepo | pnpm + Turborepo, `apps/web` · `apps/mobile` · `packages/core` · `packages/*`, **no exception**: the former products (mobile inside), a former product (absorbs admin, mobile and design system by `git subtree`). Orazaka: JVM governance unchanged, its UI apps adopt in place. No Tamagui, Solito, NativeWind or react-native-web. |
| S11 | Boundary | `@tanstack/*` is imported **only** by `@krizaka/*` packages (dependency-cruiser in every app). |
| S12 | Agent tooling | TanStack Intent: a SKILL.md in every `@krizaka/*` (generated from `meta.ts` and the registry examples, checked in CI, `intent stale` at release); `intent install` in every product; TanStack Devtools in development. |
| S13 | Validation | **Light**: green CI (lint, typecheck, unit, existing e2e) + a dark/light glance. No lines-removed proof, no size-limit or Lighthouse per pull request, no intermediate report. The three ratchets are at **0 at the end of each app's adoption**. One final report. |
| S14 | Hygiene | `mermaid` leaves the runtime (diagrams rendered at build or at the products' docs sync, never in the browser); Expo aligned on 57. |

### Guardrails (what the migration must not break)

1. **First screen = Server Component.** Where a page renders data on the server today, it keeps doing so; Query hydrates
   and takes over for the interaction. A fetch on mount for the first screen is a regression — ESLint flags it.
2. **SSE semantics unchanged**: `invalidateQueries` by default (the server stays the truth), `setQueryData` only for
   events that carry the full data; Last-Event-ID and replay stay in `@krizaka/realtime`.
3. **Accessibility**: headless means our markup; the a11y tests of `@krizaka/ui` (one story per component) apply to
   data-table v2 and form.
4. **i18n**: no label inside an engine; everything goes through `messages/*.json`.
5. **Tests**: each product's existing e2e suite is the contract.
6. **Ratchets**: `no-fetch-in-client-effect`, `no-local-table-or-form`, `no-direct-tanstack-import` in `krizaka-ratchet`.
7. **Rhythm**: a brick, then an adoption — never both in one pull request; one app at a time.

## Enforcement

- **ESLint** — `krizakaStack()` from `@krizaka/config/eslint/stack`, warnings:
  - `krizaka/no-fetch-in-client-effect`: a `fetch` or `krizakaFetch` inside a `useEffect` / `useLayoutEffect` of a
    `"use client"` file (S1);
  - `krizaka/no-direct-tanstack-import`: any import of `@tanstack/*` (S11) — in this monorepo, apps only;
  - `krizaka/no-local-table-or-form`: a `<table>` or a `<form>` of more than one field in an app (S2, S3).
- **krizaka-ratchet** counts the same patterns (`fetchInClientEffect`, `directTanstackImport`, `localTableOrForm`) and
  the imports of the dependencies an app lists under `retire` (`retiredImport`, e.g. `framer-motion`): a count never
  goes up, and reaches 0 when the app's adoption is done.
- **dependency-cruiser** — `extends: "@krizaka/config/dependency-cruiser"`: `@tanstack/*` forbidden from an app,
  allowed from the `@krizaka/*` packages.

## Consequences

- Every app migrates in one pass: data, forms, tables, lists, cadence. No compatibility facade, no feature flag, no
  "v1 kept" API — the old code is deleted in the same pass.
- A TanStack upgrade is a `@krizaka/*` release; the products follow through Renovate.
- What we do not adopt (Start, Router, Store, Tamagui, Solito, NativeWind, Motion, R3F) needs a new ADR to come back.
