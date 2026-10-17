# @krizaka/app-config — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/app-config`**. Lives in `packages/app-config` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **The app-version contract shared by every Krizaka backend and client**: versions, the payload, the rules (`none |
  soft | force`, 426, N-1 with `Deprecation`/`Sunset`), the Next.js server helpers, the framework-free client and its
  React hook. Level 0, no UI (the screens are `@krizaka/ui`: `UpdatePrompt`, `ForceUpdateScreen`, `MaintenanceScreen`).
- It is the **twin of the Java building block** `krizaka-app-config` (krizaka-platform-kit). `test/cases.json` and
  `contract/app-config.schema.json` are copies of the Java module's `contract/` files; a change to the contract is made
  in both repositories, in the same sprint, and both suites keep passing the same cases.
- Not here: where a product stores the parameters (its own database, the tables are `schemaSql`), its admin screens,
  the store URLs, the texts (database parameters, edited by the admin).

## 2. Rules

- **Zero runtime dependency**; `react` is an optional peer of `./react` only. Nothing read from the environment.
- **Fail open**: the client and the cached store never turn an outage of the parameters into an outage of the app.
- **Every value is a database parameter**; the only constants are interface settings (`// @fixed:`) and technical facts.
- No product word in this folder.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/app-config`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**),
  build, size, publint + attw (`esm-only`).
- **Size budgets** (gzip): `.` ≤ 2.5 kB, `./server` ≤ 3.2 kB, `./client` ≤ 2 kB, `./react` ≤ 1 kB.
- Published surface: exports `.`, `./server`, `./client`, `./react`, `./contract/app-config.schema.json`,
  `./package.json`. Removing or renaming an export, a header or a payload field is a breaking change.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the products adopt it).
