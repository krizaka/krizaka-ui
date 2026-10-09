# krizaka-ui — Monorepo Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui): the **Krizaka front-end platform**, the
> shared packages published on npm under `@krizaka/*`. `CLAUDE.md` only imports this file. Each package has its own
> contract in `packages/<name>/AGENTS.md`; it applies on top of this one.

## 1. Layout

```text
krizaka-ui/                 # pnpm workspace + Turborepo
├─ apps/                    # not published (Storybook catalogue, to come)
├─ packages/
│  ├─ tokens/               # @krizaka/tokens — the semantic --kz-* tokens (CSS, TS, native), from DTCG sources
│  └─ ui/                   # @krizaka/ui — the marks, the motion signature (web, /native)
├─ .changeset/              # one file per change that ships
├─ turbo.json · pnpm-workspace.yaml · package.json
└─ .github/workflows/{ci,release}.yml
```

Planned next to `tokens` and `ui`: `tailwind` (`@krizaka/tailwind`), `intl`, `i18n`, `config`.
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
- No code without a test, no component without a story (once `apps/storybook` exists).
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
`release.yml`. `tokens` and `ui` form one `fixed` group in `.changeset/config.json` (one shared version);
`tailwind` joins it when it exists.

## 5. Definition of done

1. `pnpm install --frozen-lockfile && pnpm turbo run check` is green.
2. A changeset accompanies every change to published content.
3. CI is green on the pull request.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
