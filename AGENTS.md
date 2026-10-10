# krizaka-ui — Monorepo Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui): the **Krizaka front-end platform**, the
> shared packages published on npm under `@krizaka/*`. `CLAUDE.md` only imports this file. Each package has its own
> contract in `packages/<name>/AGENTS.md`; it applies on top of this one.

## 1. Layout

```text
krizaka-ui/                 # pnpm workspace + Turborepo
├─ apps/
│  └─ storybook/            # internal, never deployed — the stories: a11y + dark/light screenshot tests in CI
├─ packages/
│  ├─ tokens/               # @krizaka/tokens — the semantic --kz-* tokens (CSS, TS, native), from DTCG sources
│  ├─ tailwind/             # @krizaka/tailwind — the Tailwind v4 preset: tokens as utilities, variants, easing
│  ├─ ui/                   # @krizaka/ui — the primitives, the marks, the motion signature (web, /native)
│  ├─ icons/                # @krizaka/icons — the signature icons (React, /native), drawn in code
│  ├─ intl/                 # @krizaka/intl — money, numbers, dates, plurals on Intl (zero dependency, no UI)
│  ├─ i18n/                 # @krizaka/i18n — typed messages, format, <Rich>, React provider, the krizaka-i18n CLI
│  └─ config/               # @krizaka/config — ESLint, tsconfig, Prettier, EditorConfig, the krizaka-ratchet counter
├─ tools/                   # not published — inventory.mjs (the duplicate audit of the products) and its tests
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
| **1 — Primitives** | `@krizaka/ui/*` | Any component **without product vocabulary**: button, card, dialog, field, tabs, badge, avatar, toast, skeleton, countdown, command palette. Words arrive as props. | `t()`, domain types, network calls, palette colours, `light:`. |
| **2 — Product composites** | `@krizaka/<product>-design-system` (own repositories) | The product theme (`--kz-*` overrides) and the components that carry its vocabulary. | A copied or forked primitive. |
| **3 — App features** | the product apps | Screens, panels, editors, business forms, orchestration. | A generic component another product could reuse. |

Placement test: *"Could another product use it without changing a word or a type?"* Yes → level 1. *"Does it carry a
product's identity or domain?"* → level 2. Otherwise → level 3. Only levels 0 and 1 live in this repository.
(Exception by design: the product **marks** in `@krizaka/ui` are the brand layer, see `packages/ui/AGENTS.md`.)

## 3. Rules

- **pnpm only** (version pinned by `packageManager`), Node ≥ 22. `pnpm install --frozen-lockfile` must pass.
- Every task goes through Turborepo: `pnpm turbo run check` = lint · typecheck · test · build · size · publint.
- The monorepo uses what it publishes: `eslint.config.mjs` is `@krizaka/config` (base everywhere, the four UI rules
  strict on `packages/ui`), every package's `lint` runs `eslint . --max-warnings 0`, and its `tsconfig.json` extends
  a base of `@krizaka/config`.
- **The code drives the documentation.** The public documentation is **krizaka.com/docs/ui**, generated from the
  registry `@krizaka/ui` publishes: every component has a `meta.ts` beside it (`packages/ui/src/meta.ts`: summary,
  when to use / not, best practices, accessibility, platforms web · native · both, status, related) and named
  examples in `packages/ui/registry/examples/<name>/` (≤ 40 lines, `native/` for React Native). The registry tests
  fail on a missing or incomplete one. Never write a component's documentation anywhere else.
- No code without a test, no component without a story: `packages/ui/src/**/<Name>.stories.tsx`, one story per
  example (the story renders the example), rendered by `apps/storybook` (see its README). Every story is audited by axe and screenshot-compared in
  dark and light by `pnpm --filter storybook test`, which `check` runs; a visual change commits its new screenshots
  (`test:update` for the current platform, `test:update:linux` for the CI baselines).
- No raw Tailwind palette colour, no `light:` variant, no hard-coded colour: components read `var(--kz-*)`.
- Every published package passes `publint` and `@arethetypeswrong/cli` and stays under its `size-limit` budget.
- Conventional Commits; `main` is protected (pull request + required CI, squash merge only). Never push to `main`.

## 4. Release (Changesets)

1. A pull request that changes what a package ships adds a changeset: `pnpm changeset` (pick the packages, the
   bump, write the note). Semantic versioning — a visual change to a mark is at least a minor.
2. On `main`, `release.yml` opens (or updates) the **"chore: version packages"** pull request: bumped versions and
   `CHANGELOG.md`.
3. Merging it publishes to npm through **trusted publishing (OIDC) with provenance** — no npm token in secrets —
   and tags each package `@krizaka/<name>@x.y.z`. No `v*` tags any more.

Each package must be declared once on npmjs.com as trusted publisher: repository `krizaka/krizaka-ui`, workflow
`release.yml`. `tokens`, `tailwind` and `ui` form one `fixed` group in `.changeset/config.json` (one shared
version); `config`, `intl`, `i18n` and `icons` version on their own. Pre-releases (`pnpm changeset pre enter <tag>`)
are for a coming major only; `main` is out of pre-release since 2.0.0.

## 5. Maintenance commands

```bash
pnpm install --frozen-lockfile && pnpm turbo run check       # everything CI runs (lint · types · tests · build · size · publint · stories)
pnpm test:tools                                              # the tools/ tests (node:test)
pnpm inventory                                               # duplicates left in the products (clones under ~/krizaka-com); --json, --strict
pnpm inventory --repo krizaka-com=../krizaka-com-wt          # …with one repository read from another folder
node packages/config/bin/krizaka-ratchet.mjs --json --root <app>   # the UI debt counters of an app (lint-ratchet.json)
pnpm --filter @krizaka/icons glyphs                          # regenerate the icons from scripts/glyphs.mjs
pnpm --filter @krizaka/tokens build                          # recompile the tokens (DTCG → CSS, TS, native, brands)
pnpm --filter storybook test:update:linux                    # the CI screenshot baselines (Docker), after a visual change
pnpm changeset                                               # describe a change that ships
GITHUB_TOKEN=$(gh auth token) pnpm changeset version         # what CI's "version packages" PR does, locally (inspect, then reset)
npm view @krizaka/ui dist-tags                               # what `npm install @krizaka/ui` resolves to
```

Publishing is CI's (`release.yml`, trusted publishing). While trusted publishing is not configured on npmjs.com, the
fallback is local, from an up-to-date `main` after the "version packages" pull request is merged:
`pnpm install --frozen-lockfile && pnpm turbo run build && pnpm changeset publish && git push origin --tags`.

## 6. Definition of done

1. `pnpm install --frozen-lockfile && pnpm turbo run check` is green.
2. A changeset accompanies every change to published content.
3. CI is green on the pull request.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
