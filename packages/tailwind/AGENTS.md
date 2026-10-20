# @krizaka/tailwind — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/tailwind`**. Lives in `packages/tailwind` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The **Tailwind CSS v4 preset** (level 0 — foundations): one file, `index.css`, that imports the tokens and the motion
  signature, maps every `--kz-*` role to a theme variable (`@theme inline`), declares the `light` / `dark` custom
  variants and the base layer.
- No component, no product word, no value: a utility always reads `var(--kz-*)`. A new role is added to
  `@krizaka/tokens` first, then mapped here.

## 2. Rules

- `@theme inline` only: a class resolves its variable at use time, so a theme never needs a rebuild.
- `light:` / `dark:` are for illustrations; a theme is a set of tokens (see the README).
- No build: `index.css` is published as is (`sideEffects: true`, files `index.css`, `README.md`, `LICENSE`).
- `tailwindcss` ^4.1, `@krizaka/tokens` and `@krizaka/ui` (for `motion.css`) are **peer** dependencies.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/tailwind`: lint and type-check of the tests, smoke test (the README entry
  compiled by `@tailwindcss/postcss` on `test/fixtures/fixture.html`: each utility exists, reads `var(--kz-…)`, and
  `light:` is scoped to `html.light … :not(.theme-dark, .theme-dark *)`; every mapped token exists in
  `@krizaka/tokens`), size, publint.
- **Size budget** (gzip): `index.css` ≤ 3.65 kB (3.36.0: the Cahier — the paper colours, every radius on a token, `ruled`, `ruled-lines`, ADR-004, +0.4 kB; 2.4.0: the type scale, `text-display-2xl` … `text-mono-sm`; 2.5.0: the
  material of BRAND.md §6 — `bg-sheen`, `bg-fill-shade`, `bg-halo`, `glass`, `focus-ring(-inset)`, `node(-lit)`, the
  signature shadows and inset edges, `ease-spring`, with their comments. The source is compiled by Tailwind at the app's
  build: an app ships only the utilities it uses).
- Published surface: exports `.` (`index.css`) and `./package.json`. Renaming or removing a utility is a breaking change.

## 4. Release

A changeset for every change to `index.css`. `@krizaka/tailwind` is in the `fixed` group with `@krizaka/tokens` and
`@krizaka/ui`: they share one version.
