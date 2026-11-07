# @krizaka/orazaka-shared — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/orazaka-shared`**. Lives in `packages/orazaka-shared` of the krizaka-ui monorepo since
> ADR-029 (moved from `krizaka/sovkora-ui-kit`, whose history stays in that repository's bundle): the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Its consumers are the Sovkora apps (`apps/web`, `apps/mobile`,
> `apps/desktop` of krizaka/sovkora) and `@krizaka/sovkora-design-system`. The npm name keeps the code name until
> krizaka-internal#2872.

## 1. What belongs here

- **The contracts the Sovkora apps share**, framework-agnostic: the Zod schemas and their types (jobs, runs, automations,
  billing, packs, studios, the intent envelope, the workflow context), the document pre-flight (`createInspector`,
  `documentRules`…) and the design tokens for React Native and the CLI (`tokens`, `themes`, `status`…).
- Not here: a component (`@krizaka/sovkora-design-system`), a network call, a value read from the environment.

## 2. Rules

- **CommonJS on purpose.** React Native and the CLI read it with `require`: `tsc` compiles `src/` to `dist/`
  (`tsconfig.build.json`), with the declarations. Changing the module format is a breaking change.
- **The tokens are a copy, held to their source.** `themes` copies the platform surfaces of `@krizaka/tokens/native` and
  the Orazaka brand (`brands.sovkora` since tokens 4.0): `test/tokens.parity.test.mjs` fails the day they disagree.
- A schema follows the server: a field the server may omit is optional (an older server still parses).

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/orazaka-shared`: ESLint and `tsc`, Vitest (from the sources), build, size,
  publint + attw (`node16`).
- **Size budget** (gzip, Zod excluded): `.` ≤ 25 kB.
- Published surface: `main` `dist/index.js`, `types` `dist/index.d.ts`; files `dist`, `README.md`, `LICENSE`. Renaming
  an export or a schema field is a breaking change.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version. Published by `release.yml` like every
package of this repository (trusted publisher to declare on npmjs.com: repository `krizaka/krizaka-ui`, workflow
`release.yml`).
