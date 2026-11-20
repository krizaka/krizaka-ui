# krizaka-ui — agent contract

<!-- krizaka-agents-template v2: rendered from krizaka/.github docs/standards/agents-template.md (scripts/agents-md.mjs). The one AGENTS.md standard: six sections in this order, at most 150 lines, bullets and imperatives. The conformance check « agents-template » reads the headings, the length and CLAUDE.md. Detail goes to docs/ via References, not here. -->

## Project context

- The Krizaka front-end platform: pnpm + Turborepo monorepo of the shared `@krizaka/*` packages (tokens, tailwind, ui, icons, charts, fonts, intl, i18n, email, realtime, query, push, pacer, discovery, app-client, app-desktop, a11y-audit) and the docs site ui.krizaka.com (`apps/site`, `apps/storybook`).
- Kind: `library` · team: `platform` · registry entry: [repos.json](https://github.com/krizaka/.github/blob/main/repos.json).
- Read this file first, then the section of [docs/agents.md](docs/agents.md) for what you touch. Each package has its own `packages/<name>/AGENTS.md` on top of this one.
- `CLAUDE.md` is the one line `@AGENTS.md` (or a symlink to this file): never a second copy of it.

## Essential commands

```bash
pnpm install --frozen-lockfile          # pnpm only (version pinned by packageManager), Node >= 22
pnpm turbo run check                    # lint · typecheck · test · build · size · publint · stories (what CI runs)
pnpm test:tools                         # the tools/ tests (node:test)
pnpm --filter storybook test            # stories: axe + dark/light screenshots
pnpm --filter storybook test:update:linux   # CI screenshot baselines (Docker), after a visual change
pnpm changeset                          # describe a change that ships
npm run lint && npx ast-grep scan       # lint, ratchet and the ast-grep rules
pnpm smoke:consumers --only next,expo,node --keep   # the published packages in fresh apps
```

- Run them on what you changed before every push; CI runs the rest.
- Turborepo here is not the one you know: read `docs/README.md` of the installed `turbo` package before changing its config or commands.

## Architecture & conventions

- Follow the [krizaka-engineering skill](https://github.com/krizaka/krizaka-skills/blob/main/skills/krizaka-engineering/SKILL.md); search its [packages reference](https://github.com/krizaka/krizaka-skills/blob/main/skills/krizaka-engineering/references/packages.md) before writing anything generic.
- Place code by level: foundations (`tokens`, `tailwind`) and platform bricks (UI-free `intl`, `i18n`, `realtime`, `query`, …) are level 0; primitives without product vocabulary are `@krizaka/ui/*` (level 1). A product's composites and app features never live here.
- Placement test: could another product use it without changing a word or a type? Yes → here.
- Headless engines (TanStack…) enter only through a `@krizaka/*` facade; a product never imports `@tanstack/*`.
- Components read `var(--kz-*)`: no raw Tailwind palette colour, no `light:` variant, no hard-coded colour, no `t()`, no domain type, no network call in `@krizaka/ui`.
- Drivers (`pg`, `ioredis`) are optional peers; connections and URLs are injected by the app, never read from its environment.
- A new package is a folder in `packages/` with `package.json`, `AGENTS.md`, tests, a `size-limit` budget and a `publint` script.
- Every component has a `meta.ts` (with `parity`) and named examples in `packages/ui/registry/examples/<name>/` (≤ 40 lines): the code drives ui.krizaka.com, never write a component's docs elsewhere.
- Keep ports and adapters: domain code reads no env, no ambient clock, no database client.
- Write one job per function: cognitive complexity ≤ 15, nesting ≤ 2, a body under 60 lines.
- Name things by what they do; no `*Utils`, `*Helper`, `*Manager`; no `types.ts` at a package root.

## Guard-rails & known pitfalls (read before coding)

- The checks are the judge ([ADR-015](https://github.com/krizaka/krizaka-internal/blob/main/docs/adr/.github/ADR-015-ai-code-audit-measured-and-enforced.md), [guards](https://github.com/krizaka/.github/blob/main/docs/standards/guards.md)): never `--no-verify`, never a new `eslint-disable`, never a raised ratchet (`lint-ratchet.json`, `sg-ratchet.json`); a rule is never silenced to get green.
- Products consume published npm versions: never a `workspace:` link, a git dependency or a copy between a product and this repository.
- `@krizaka/config` comes from krizaka-ts: never a copy of it here.
- Never push to `main`; Conventional Commits; squash merge only.
- A change to what a package ships needs a changeset; a visual change to a mark is at least a minor. `tokens`, `tailwind`, `ui` share one version (`fixed` group).
- No test, not done: a unit test for logic, a story per example for a component; a fix starts with a failing test (a bug means a missing guard).
- A visual change commits its new screenshots (`test:update` and `test:update:linux`).
- No hand-written time arithmetic, no `new Date()` / `Date.now()` in domain code, no TS `enum`, no `x.status === "OPEN"`: the ast-grep rules refuse them (table in docs/agents.md).
- A numeric `export const` in feature code needs `// @fixed: <reason>` just above.
- `useEffect` is for subscriptions only: data is `useQuery`, derived state is computed in render.
- Default media (avatars, banners, logos) come from `@krizaka/org`, never hard-coded.
- Every user-facing string is in the FR and EN messages; every control has a unique label; text never overflows at 360 px.
- Use `?.` and `??` in TypeScript, not a chain of `&&` or a ternary on null; a closed set is an `as const` object, never a string compared by hand.
- Never invent a URL, a price or a figure you did not read; never commit a secret; no production data in a session.
- Keep the edit hook in `.claude/settings.json`: `npx --no-install krizaka-edit-check` on `Edit|Write`.

## Expected validation workflow

- [ ] `pnpm install --frozen-lockfile && pnpm turbo run check` is green; fix the cause of a red, never the guard.
- [ ] The changeset is added when published content changed.
- [ ] A feature or fix PR names its journey (`Journey: <name>` or `Journey: n/a — <reason>`).
- [ ] The registry (`meta.ts`, examples) and generated docs still say what the code does.
- [ ] One issue, one small PR (`Closes #<n>`); merge only with green CI; after a release, the consumer smoke is green.

## References

- [docs/agents.md](docs/agents.md): the full former contract (layout, placement, rules, docs site, release, ast-grep rules, PR checklist, anti-slop), read by section.
- [docs/RELEASING.md](docs/RELEASING.md): releasing; [SUPPORT.md](SUPPORT.md): supported versions and deprecation.
- [Org standards](https://github.com/krizaka/.github/tree/main/docs/standards) of krizaka/.github; the [engineering charter](https://github.com/krizaka/.github/blob/main/AGENTS.template.md).
- [krizaka-engineering skill](https://github.com/krizaka/krizaka-skills/blob/main/skills/krizaka-engineering/SKILL.md).
