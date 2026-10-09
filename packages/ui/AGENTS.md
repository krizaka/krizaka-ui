# @krizaka/ui — Repository Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui), published on npm as **`@krizaka/ui`**.
> Lives in `packages/ui` of the krizaka-ui monorepo: the root [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The **primitives** (level 1 of the root contract): `cn`, `slot`, `button`, `badge`, `avatar`, `field`, `theme`,
  `skeleton`, `empty-state`, `spinner`, `countdown` — one entry each, built with `tailwind-variants` on the preset's
  roles, Radix UI for non-trivial interactions. They follow the 12-point component contract (README, "Primitives").
- The **brand layer shared by every Krizaka product**: the animated marks (`KrizakaLogo`, `OrazakaLogo`,
  `OrochiaLogo`, `ProductLogo`) and the **Krizaka motion signature** (`motion.css`, `MotionObserver`, `RotatingWord`).
- Nothing product-specific: a product's components live in its own design system (`@krizaka/orochia-design-system`,
  `@krizaka/orazaka-design-system`), which builds on this package.

## 2. Rules

- **Marks and motion: no framework, no CSS library.** Marks embed their own CSS with prefixed classes (`kzm-`, `ozm-`,
  `orom-`); the signature is plain CSS with `kz-` classes and `--kz-*` variables. They run on React 18 and 19.
- **Primitives: React 19, Tailwind v4 + `@krizaka/tailwind`.** Dependencies: `radix-ui`, `tailwind-variants` (its
  merge engine is the one `cn` uses — a single copy), `clsx`. Colours are roles only (lint `krizakaUi`, strict);
  words are props (`label`, `units`…), never `t()`; state is `data-*`; `className` is merged last.
- **Server by default**: an entry gets `"use client"` only when it holds a hook or a portal (tsup client group).
- **Both themes**: neutral strokes read the host's `--kz-*` tokens and fall back to the text colour.
- **Unique ids per instance** (`useId`); decorative by default, an accessible image with `title`.
- **A story per component** (`src/**/<Name>.stories.tsx`, one per variant), rendered and tested by `apps/storybook`.
- **Reduced motion**: every animation stops under `prefers-reduced-motion`; marks also take `animated={false}`.
- A change to a mark is a change to the brand: it ships as a new version that every app adopts — the apps never
  keep a copy.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/ui`: type-check, tests (Vitest, happy-dom), build (tsup), size, publint.
- **Size budgets** (`size-limit`, gzip, peers excluded): `.` ≤ 8 kB, `./native` ≤ 6 kB; the shared runtime
  (`./cn`: clsx + tailwind-variants and its merge engine, paid once per app) ≤ 14 kB; each primitive is measured
  without that runtime (Radix included): `./button` ≤ 3 kB, `./avatar` ≤ 6 kB, `./theme` ≤ 2 kB, `./countdown` ≤ 2 kB,
  `./slot` ≤ 2 kB, `./field` ≤ 1.5 kB, the others ≤ 1 kB.
- **publint + attw** with the `esm-only` profile: the package is ESM only by design; `./motion.css` and
  `./tailwind.css` are CSS exports and are not resolved as modules.
- The published surface: exports `.`, one entry per primitive (`./cn`, `./slot`, `./button`, `./badge`, `./avatar`,
  `./field`, `./theme`, `./skeleton`, `./empty-state`, `./spinner`, `./countdown`), `./native`, `./motion.css`,
  `./tailwind.css`, `./package.json`; files `dist`, `tailwind.css`, `README.md`, `LICENSE`. Adding an entry is a
  minor; removing or renaming one is a breaking change.

## 4. Release

Through Changesets (root `AGENTS.md` §4): add a `.changeset/*.md` for `@krizaka/ui`; merging the "Version Packages"
pull request publishes with provenance and tags `@krizaka/ui@x.y.z`. Semantic versioning — a visual change to a mark
is at least a minor.
