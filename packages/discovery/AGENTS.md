# @krizaka/discovery — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/discovery`**. Lives in `packages/discovery` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Decision: [krizaka/.github ADR-003](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-003-mobile-service-discovery.md).

## 1. What belongs here

- **How a Krizaka app learns its backend addresses**: the manifest schema, canonical JSON, the Ed25519 verifier and
  signer, the host allow-list, the version order, the client (`createDiscovery`: fetch, validate, cache, fall back,
  refresh, gates) and its React bindings. Level 0, no UI.
- Not here: the manifest's **data** (krizaka-com `lib/services.ts`), the private keys (the company vault), the apps' update
  and maintenance **screens** (their kit), the server-driven compatibility contract (that is `@krizaka/app-config`: discovery
  says *where* the backend is and holds the coarse, backend-independent kill switch; app-config says what the backend
  accepts).

## 2. Rules

- **Never trust the network**: a document is used only after the schema, the Ed25519 signature under a **baked** key, and
  the host allow-list (`https`, no credentials, no port, a name under a baked suffix; never a multi-tenant suffix such as
  `b-cdn.net`). A replay (`issuedAt` older than the document in force) is refused. The cache is re-verified on load.
- **Never lock the app out by our own fault**: every failure keeps the previous state; the fallback order is
  live → cache → baked default → legacy host; an unreadable app version leaves the gates open; default and legacy
  addresses never close a gate; `start()` and `refresh()` never reject; `getService` throws only for a product it knows
  nothing about.
- No secret on the device: `./sign` is for build tooling, the private key never enters an app or this repository.
- The canonical form is integers and strings only: a new field is a string, a boolean or an integer.
- One dependency, `@noble/curves` (audited, pure JS: Hermes has no WebCrypto Ed25519). No `atob`, no `Buffer`: base64 is
  written here.
- Changing the signed shape, the allow-list rules or the fallback order is a **breaking change** (apps in the stores
  depend on it): bump `schemaVersion` and keep verifying the old one for as long as an app version may use it.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/discovery`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**; every
  fallback path and every rejection — bad signature, unknown key, replay, tampered cache, foreign host — has a test),
  build, size, publint + attw (`esm-only`).
- **Size budget** (gzip, with `@noble/curves`): `.` ≤ 18 kB, `./react` ≤ 2 kB.
- Published surface: `.`, `./sign`, `./react`, `./package.json`.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the apps adopt it).
