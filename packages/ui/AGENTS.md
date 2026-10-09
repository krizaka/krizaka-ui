# @krizaka/ui — Repository Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui), published on npm as **`@krizaka/ui`**.
> Lives in `packages/ui` of the krizaka-ui monorepo: the root [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The **brand layer shared by every Krizaka product**: the animated marks (`KrizakaLogo`, `OrazakaLogo`,
  `OrochiaLogo`, `ProductLogo`) and the **Krizaka motion signature** (`motion.css`, `MotionObserver`, `RotatingWord`).
- Nothing product-specific: a product's components live in its own design system (`@krizaka/orochia-design-system`,
  `@krizaka/orazaka-design-system`), which builds on this package.

## 2. Rules

- **No framework, no CSS library**: React is the only (peer) dependency. Marks embed their own CSS with prefixed
  classes (`kzm-`, `ozm-`, `orom-`); the signature is plain CSS with `kz-` classes and `--kz-*` variables.
- **Both themes**: neutral strokes read the host's `--kz-*` tokens and fall back to the text colour.
- **Unique ids per instance** (`useId`); decorative by default, an accessible image with `title`.
- **A story per component** (`src/**/<Name>.stories.tsx`, one per variant), rendered and tested by `apps/storybook`.
- **Reduced motion**: every animation stops under `prefers-reduced-motion`; marks also take `animated={false}`.
- A change to a mark is a change to the brand: it ships as a new version that every app adopts — the apps never
  keep a copy.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/ui`: type-check, tests (Vitest, happy-dom), build (tsup), size, publint.
- **Size budgets** (`size-limit`, gzip, peers excluded): `.` ≤ 8 kB, `./native` ≤ 6 kB.
- **publint + attw** with the `esm-only` profile: the package is ESM only by design; `./motion.css` and
  `./tailwind.css` are CSS exports and are not resolved as modules.
- The published surface is fixed: exports `.`, `./native`, `./motion.css`, `./tailwind.css`, `./package.json`; files `dist`,
  `tailwind.css`, `README.md`, `LICENSE`. Changing it is a breaking change.

## 4. Release

Through Changesets (root `AGENTS.md` §4): add a `.changeset/*.md` for `@krizaka/ui`; merging the "Version Packages"
pull request publishes with provenance and tags `@krizaka/ui@x.y.z`. Semantic versioning — a visual change to a mark
is at least a minor.
