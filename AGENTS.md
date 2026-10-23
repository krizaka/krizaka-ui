# krizaka-ui — Monorepo Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui): the **Krizaka front-end platform**, the
> shared packages published on npm under `@krizaka/*`. `CLAUDE.md` only imports this file. Each package has its own
> contract in `packages/<name>/AGENTS.md`; it applies on top of this one.

## 1. Layout

```text
krizaka-ui/                 # pnpm workspace + Turborepo
├─ apps/
│  ├─ site/                 # ui.krizaka.com — the public documentation, generated from the workspace packages (§3.1)
│  └─ storybook/            # internal, never deployed — the stories: a11y + dark/light screenshot tests in CI
├─ packages/
│  ├─ tokens/               # @krizaka/tokens — the semantic --kz-* tokens (CSS, TS, native), from DTCG sources
│  ├─ tailwind/             # @krizaka/tailwind — the Tailwind v4 preset: tokens as utilities, variants, easing
│  ├─ ui/                   # @krizaka/ui — the primitives, the marks, the motion signature (web, /native)
│  ├─ icons/                # @krizaka/icons — the signature icons (React, /native), drawn in code
│  ├─ charts/               # @krizaka/charts — data visualisation: SVG charts + ECharts on demand, accessible, /native
│  ├─ fonts/                # @krizaka/fonts — the Krizaka typefaces (WOFF2 + fallbacks, TrueType for Expo), SIL OFL
│  ├─ intl/                 # @krizaka/intl — money, numbers, dates, plurals on Intl (zero dependency, no UI)
│  ├─ i18n/                 # @krizaka/i18n — typed messages, format, <Rich>, React provider, the krizaka-i18n CLI
│  ├─ email/                # @krizaka/email — every Krizaka email: typed templates, brand themes, sendEmail(), webhooks
│  ├─ realtime/             # @krizaka/realtime — server realtime: bus + presence (memory · PostgreSQL · Redis), SSE (no UI)
│  ├─ query/                # @krizaka/query — server state: TanStack Query behind the facade, typed fetch, live invalidation (no UI)
│  ├─ push/                 # @krizaka/push — mobile push through the Expo Push Service (FCM / APNs), pure (no UI)
│  ├─ app-client/            # @krizaka/app-client — what every Expo app shares: bearer session, discovery factory, API client (ports in, no native module)
│  ├─ app-desktop/           # @krizaka/app-desktop — the typed page side of tauri-plugin-krizaka (folders, Keychain storage, menu bar, deep links; Tauri passed in)
│  ├─ discovery/            # @krizaka/discovery — mobile service discovery: a signed manifest of backend addresses (Ed25519, allow-list), pure (no UI)
│  ├─ pacer/                # @krizaka/pacer — cadence: debounce, throttle, a job queue (priority, retries, pause per job), a rate limiter (TanStack Pacer behind the facade; hooks in ./react)
│  └─ config/               # @krizaka/config — ESLint, tsconfig, Prettier, EditorConfig, the krizaka-ratchet counter
├─ tools/                   # not published — inventory.mjs (the duplicate audit of the products), consumer-smoke/ (the published
│                           #   packages in fresh Next.js · Expo · Node apps), and their tests
├─ docs/adr/                # the architecture decisions (ADR-001: TanStack under @krizaka facades; ADR-002: desktop is the web in a window)
├─ renovate/krizaka.json    # the Renovate preset the products extend (group krizaka, patches automerged)
├─ .changeset/              # one file per change that ships
├─ eslint.config.mjs       # the monorepo lints itself with @krizaka/config
├─ turbo.json · pnpm-workspace.yaml · package.json
└─ .github/workflows/{ci,release}.yml
```

**State (2.0.0, 2026-10-10).** Out of pre-release: `@krizaka/ui`, `@krizaka/tokens` and `@krizaka/tailwind` 2.0.0
(one `fixed` group), `@krizaka/icons`, `@krizaka/intl`, `@krizaka/i18n` 0.1.0, `@krizaka/config` 0.1.0 — all on the
`latest` dist-tag. The catalogue covers every concept of the study's inventory (§2.1), web and React Native; the
products consume it through their design systems (theme + composites). Supported versions and the deprecation
procedure: [`SUPPORT.md`](SUPPORT.md).

A new package is a folder in `packages/` with its own `package.json`, `AGENTS.md`, tests, `size-limit` budget and
`publint` script.

**Golden rule:** products consume **published versions** from npm. Never a `workspace:` link, a git dependency or
a copy between a product and this repository — the version is the contract.

## 2. Placement — three levels, no more

| Level | Where | Goes in | Never goes in |
| :-- | :-- | :-- | :-- |
| **0 — Foundations** | `@krizaka/tokens`, `@krizaka/tailwind` | Semantic tokens, preset, variants, `cn`, `Slot`, `VisuallyHidden`, theme. | Components. |
| **0 — Platform bricks** | `@krizaka/intl`, `@krizaka/i18n`, `@krizaka/realtime`, `@krizaka/query`, `@krizaka/push`, `@krizaka/pacer`, `@krizaka/discovery`, `@krizaka/app-client`, `@krizaka/app-desktop` | Code without UI that every product needs the same way: formatting, messages, the realtime bus + presence + SSE (`realtime`), server state on the client (`query`), mobile push (`push`). Drivers (`pg`, `ioredis`) are optional peers; connections and URLs are injected by the app, never read from its environment. | A product word, a product's channel or key name, a table, a route. |
| **1 — Primitives** | `@krizaka/ui/*` | Any component **without product vocabulary**: button, card, dialog, field, tabs, badge, avatar, toast, skeleton, countdown, command palette. Words arrive as props. | `t()`, domain types, network calls, palette colours, `light:`. |
| **2 — Product composites** | `@krizaka/<product>-design-system` (own repositories) | The product theme (`--kz-*` overrides) and the components that carry its vocabulary. | A copied or forked primitive. |
| **3 — App features** | the product apps | Screens, panels, editors, business forms, orchestration. | A generic component another product could reuse. |

**Headless engines enter through a `@krizaka/*` package, never through a product**
([ADR-001](docs/adr/ADR-001-tanstack-under-krizaka-facades.md)). TanStack (Query, Table, Form, Virtual, Pacer,
Charts, Markdown, Highlight) is imported by the `@krizaka/*` packages only — `@krizaka/query`, `@krizaka/ui/data-table`,
`@krizaka/ui/form`, `@krizaka/ui/virtual`, `@krizaka/pacer`… — and a product imports the facade, never `@tanstack/*`:
the facade's version is the contract, a TanStack break is fixed here once. The same holds for any future engine. In the
apps, `@krizaka/config` enforces it: `krizakaStack()` (ESLint, counted by `krizaka-ratchet`) and
`@krizaka/config/dependency-cruiser`.

Placement test: *"Could another product use it without changing a word or a type?"* Yes → level 1. *"Does it carry a
product's identity or domain?"* → level 2. Otherwise → level 3. Only levels 0 and 1 live in this repository.
(Exception by design: the product **marks** in `@krizaka/ui` are the brand layer, see `packages/ui/AGENTS.md`.)

## 3. Rules

- **pnpm only** (version pinned by `packageManager`), Node ≥ 22. `pnpm install --frozen-lockfile` must pass.
- Every task goes through Turborepo: `pnpm turbo run check` = lint · typecheck · test · build · size · publint.
- The monorepo uses what it publishes: `eslint.config.mjs` is `@krizaka/config` (base everywhere, the four UI rules
  strict on `packages/ui`, the three stack rules on `apps/`), every package's `lint` runs `eslint . --max-warnings 0`, and its `tsconfig.json` extends
  a base of `@krizaka/config`.
- **The code drives the documentation.** The public documentation is **ui.krizaka.com**, generated from the
  packages — the foundations from their data (`@krizaka/tokens` `typeScale`, `@krizaka/fonts` `fonts`/`rules`,
  `@krizaka/icons/glyphs` `glyphIndex`/`iconGroups`/`iconGuidelines`), the components from the
  registry `@krizaka/ui` publishes: every component has a `meta.ts` beside it (`packages/ui/src/meta.ts`: summary,
  when to use / not, best practices, accessibility, platforms web · native · both, status, related) and named
  examples in `packages/ui/registry/examples/<name>/` (≤ 40 lines, `native/` for React Native). The registry tests
  fail on a missing or incomplete one. An example flagged `template` also carries its `purpose` (convince · explain · show · act ·
  operate · converse · recover) and a `why` (the user goal its layout serves): ui.krizaka.com groups the templates by them.
  **Three platforms — web · native · desktop**: every meta declares its `parity` (the side it lacks: `gap` with its issue,
  or `n/a` with why; desktop = the Orazaka Mac app, Tauri 2 on the system WebView, ADR-002), checked by `tools/parity.mjs`
  in both registries' tests and drawn as the matrix of ui.krizaka.com/platforms.
  A component nobody uses and nothing plans is `status: deprecated` with `deprecated: { since, removedIn, reason }`. Never write a component's documentation anywhere else.
- **No test, not done.** Every feature and every fix ships with its tests in the same pull request: a unit test for
  logic (Vitest), a story for a component — `packages/ui/src/**/<Name>.stories.tsx`, one story per example (the story
  renders the example), rendered by `apps/storybook` (see its README). Every story is audited by axe and
  screenshot-compared in dark and light by `pnpm --filter storybook test`, which `check` runs; a visual change commits
  its new screenshots (`test:update` for the current platform, `test:update:linux` for the CI baselines). **A fix
  starts with a failing test** that reproduces the bug. CI runs them and must be green; a test is never skipped or
  weakened to get there.
- **The published packages are proven in a consumer.** `.github/workflows/consumer-smoke.yml` installs them from npm
  (never the workspace) into a fresh Next.js 16 App Router app (every web example of the registries prerendered by
  `next build`), an Expo SDK 57 app (every React Native example, `tsc` + `expo export`) and a Node script
  (`realtime`, `push`) — every day and after each release. A red run is fixed in the package and released.
- No raw Tailwind palette colour, no `light:` variant, no hard-coded colour: components read `var(--kz-*)`.
- The packed-package check (`scripts/consumer.mjs` of `ui` and `charts`) installs the tarballs of the package **and of its `workspace:` dependencies** together (`tools/workspace-pack.mjs`): on a release pull request the next versions of `tokens`/`intl` are on no registry yet, and the check must not need them published first (tested in `tools/workspace-pack.test.mjs`).
- Every published package passes `publint` and `@arethetypeswrong/cli` and stays under its `size-limit` budget.
- Conventional Commits; `main` is protected (pull request + required CI, squash merge only). Never push to `main`.

## 3.1 Documentation site — the code drives ui.krizaka.com

- **ui.krizaka.com is `apps/site`**: Next.js (App Router, `output: "export"`) + Fumadocs, built from the **workspace
  packages** (`workspace:*`, never npm) — the documentation of a commit is the documentation of its code. It is
  private (never published); the products still consume the packages from npm (§1, golden rule).
- **The home** (`/`) is a designed page (`app/components/landing`): hero, a live bento of registry examples under the
  identity switch, the ways in, the packages. The catalogue is `/components`.
- **Generated, never written**: one page per component of the registries of `@krizaka/ui` and `@krizaka/charts`
  (`/components/<name>`: summary, platforms, status, when to use / not, install, every named example live + code, native
  screenshots, props, accessibility, related), the foundations from the packages' data (`/foundations/typography`,
  `/foundations/icons`, `/foundations/brand-marks`), the templates by intent (`/templates`, `/templates/<intent>`) and
  the mobile parity (`/mobile`). `apps/site/scripts/gen-ui-docs.mjs` writes the import map of the live examples and
  copies the native screenshots (git-ignored); `--check` (in `lint`) fails on an incomplete registry.
- **Written in `apps/site/content/docs`** (MDX, English): Get started (`/`, `/installation`, `/theming`), the prose of
  `/foundations/{tokens,motion}` and the packages without UI (`/packages/<name>`). Titles, descriptions and the chrome are
  messages (`apps/site/messages/{en,fr}.json`, checked by `krizaka-i18n check`). English at `/`, French under `/fr`.
- **Addresses** live in `apps/site/lib/urls.ts` (tested). The old `www.krizaka.com/docs/ui/*` answer 308 to them from
  krizaka.com (same map, in krizaka-com `lib/ui-redirects.ts`). The sidebar's groups and the inventory ("why is this
  component here") are `lib/ui-ia.ts` and `lib/ui-inventory.ts`, guarded by `tests/docs-ia.test.mjs`; `lib/ui-usage.json`
  is refreshed by hand (`pnpm --filter @krizaka/site ui:usage`).
- **Built on every pull request** (CI job « Documentation site »: `turbo run build lint typecheck test
  --filter=@krizaka/site`) and **deployed on every push to `main`** — so on every release — by DigitalOcean App Platform
  (app `krizaka-ui-site`, project `krizaka`, a static site: `apps/site/deploy/app.yaml`). No server: what needs one
  (redirects, a proxy) does not belong here.
- **Never an empty map**: the maps read their tiles from the CDN cross-origin; until it answers with CORS headers, a map
  example shows its photograph (`lib/map-snapshots.json`, `MapGate`) and turns live once the tiles can be read. Retake the
  photographs when a map example changes.
- **Its look is tested**: `scripts/crawl-check.mjs` (CI, on the export) opens the top pages at desktop and phone width, dark
  and light, and fails on a sideways scroll, content or code cut at an edge, an example wider than its frame, an empty
  canvas, a console error. The bar and the footer are NAV-SYS's (`NavBar.Family`, `NavBar.Badge`, `NavBar.Repo`, `SiteFooter`).
- Run it: `pnpm turbo run build --filter=@krizaka/site...` once (the packages), then `pnpm --filter @krizaka/site dev`.

## 4. Release (Changesets)

1. A pull request that changes what a package ships adds a changeset: `pnpm changeset` (pick the packages, the
   bump, write the note). Semantic versioning — a visual change to a mark is at least a minor.
2. On `main`, `release.yml` opens (or updates) the **"chore: version packages"** pull request: bumped versions and
   `CHANGELOG.md`.
3. Merging it publishes to npm through **trusted publishing (OIDC) with provenance** — no npm token in secrets —
   and tags each package `@krizaka/<name>@x.y.z`. No `v*` tags any more.

Each package must be declared once on npmjs.com as trusted publisher: repository `krizaka/krizaka-ui`, workflow
`release.yml`. `tokens`, `tailwind` and `ui` form one `fixed` group in `.changeset/config.json` (one shared
version); `config`, `intl`, `i18n`, `icons`, `charts`, `fonts`, `realtime`, `query`, `push`, `pacer`, `discovery`, `app-client` and `app-desktop` version on their own. Pre-releases (`pnpm changeset pre enter <tag>`)
are for a coming major only; `main` is out of pre-release since 2.0.0.

## 5. Maintenance commands

```bash
pnpm install --frozen-lockfile && pnpm turbo run check       # everything CI runs (lint · types · tests · build · size · publint · stories)
pnpm test:tools                                              # the tools/ tests (node:test)
pnpm smoke:consumers --only next,expo,node --keep            # the published packages in fresh apps (npm, ~2 min)
pnpm inventory                                               # duplicates left in the products (clones under ~/krizaka-com); --json, --strict
pnpm inventory --repo krizaka-com=../krizaka-com-wt          # …with one repository read from another folder
node packages/config/bin/krizaka-ratchet.mjs --json --root <app>   # the UI debt counters of an app (lint-ratchet.json)
pnpm --filter @krizaka/icons glyphs                          # regenerate the icons from scripts/glyphs.mjs
pnpm --filter @krizaka/tokens build                          # recompile the tokens (DTCG → CSS, TS, native, brands)
pnpm --filter @krizaka/fonts subset                          # re-cut the font files from src/families.json (uv + fontTools, by hand)
pnpm --filter storybook test:update:linux                    # the CI screenshot baselines (Docker), after a visual change
pnpm changeset                                               # describe a change that ships
GITHUB_TOKEN=$(gh auth token) pnpm changeset version         # what CI's "version packages" PR does, locally (inspect, then reset)
npm view @krizaka/ui dist-tags                               # what `npm install @krizaka/ui` resolves to
```

Publishing is CI's (`release.yml`, trusted publishing). While trusted publishing is not configured on npmjs.com, the
fallback is local, from an up-to-date `main` after the "version packages" pull request is merged:
`pnpm install --frozen-lockfile && pnpm turbo run build && pnpm changeset publish && git push origin --tags`.

## Static rules & codemods (ast-grep)

The org code rules (addendum 2026-10-15) are lint rules, not review comments. [`@ast-grep/cli`](https://ast-grep.github.io)
is a **pinned devDependency** (no global install, CI reproduces local): `sgconfig.yml` + `rules/*.yml` (one rule per file,
with a message and, where safe, a `fix:`; written for Tsx and `.ts` is parsed as Tsx too, so each rule covers `.ts` and `.tsx`), `rule-tests/` (valid/invalid cases of each rule).

| Rule | What it refuses |
| :--- | :--- |
| `no-hand-ms-*`, `no-get-time-difference`, `no-get-time-arithmetic` | hand-written time arithmetic (`n * 60 * 1000`, `a.getTime() - b.getTime()`): date-fns, or a duration read from the settings |
| `no-env-in-domain` | an `env` import in domain code (`packages/*/src`, `src/`): the value arrives as a parameter |
| `no-db-in-service-or-rules` | a db client / schema import in `*.service.ts`, `*-service.ts`, `*.rules.ts`, `*-rules.ts` |
| `no-ts-enum` | the TypeScript `enum` keyword (`as const` object + derived type, or a Postgres enum) |
| `no-enum-string-compare` | `x.status === "OPEN"` (field named status/kind/role/reason/state/direction compared to a string literal) |
| `no-ambient-clock` | `new Date()` / `Date.now()` in domain code: the clock is injected |
| `no-types-at-package-root` | `types.ts` at a package root (`<feature>/<feature>.types.ts`) |
| `no-unjustified-numeric-export` | a numeric (or `…ToMilliseconds(n)`) `export const` in feature code without `// @fixed: <reason>` just above |

- **Run**: `npm run lint` runs everything (it includes `ast-grep test` and the ratchet). `npx ast-grep scan` lists the
  violations with their message; `npm run lint:sg:test` runs the rule tests.
- **Ratchet**: `scripts/sg-ratchet.mjs` counts the violations per rule and refuses any increase against
  `sg-ratchet.json` (same idea as `krizaka-ratchet` / `lint-ratchet.json`: the debt only goes down). Fixed some? Lock the gain with
  `npm run sg:ratchet:update` (it never raises a count and records a new rule at its current count). A new rule is
  added with its test in `rule-tests/` and its baseline in the same pull request. The script is identical in every
  Krizaka TypeScript repository (keep the copies identical; its unit test is `scripts/sg-ratchet.test.mjs`).
- **Codemods**: `npm run sg:fix` applies the `fix:` of the rules (`ast-grep scan --update-all`) and adds the date-fns import;
  behaviour is identical — run `npm run lint && npm test` after, and land the result in a small pull request.
- A rule is never silenced to get a PR green; fix the code, or (a business parameter that is a technical fact) justify it with `// @fixed:`.

## 6. Definition of done

1. `pnpm install --frozen-lockfile && pnpm turbo run check` is green.
2. A changeset accompanies every change to published content.
3. CI is green on the pull request, and the change ships with its tests (§3: no test, not done).
4. After a release, the consumer smoke is green on the published versions.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
