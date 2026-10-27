# @krizaka/app-client — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/app-client`**. Lives in `packages/app-client` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Decision: [krizaka/.github ADR-004](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-004-expo-app-shell.md).

## 1. What belongs here

- **What every Krizaka Expo app does the same way**: the bearer session over a storage port (`createSessionStore`), the
  discovery client of the signed services manifest with the product's address, host suffix and build inputs
  (`createAppDiscovery`), the API client (`createApiClient`: bearer, no cookie, timeout, 401 drops the session), and in
  `./react` the auth context the screens read (`createAuth`, `useSessionStatus`; React is an optional peer), and in `./server` what the backend of those apps reads (`sessionTokenOf`: the bearer before the cookie, `signInClientOf`: `client: "native"` gets its token in the body) — pure, headers in.
- Not here: a product's endpoints, types, screens or messages; the update and maintenance **screens** (`@krizaka/ui/native`);
  the manifest itself (`@krizaka/discovery`); the version contract (`@krizaka/app-config`).

## 2. Rules

- **Ports in, no native module imported.** Storage, fetch, language and the clock arrive as arguments; `expo-secure-store`
  is passed to `secureStorage(...)`, `process.env.EXPO_PUBLIC_*` is read by the app (Metro inlines it only where written).
- **No product word in this folder.** A product passes its key, domain and addresses.
- **Parse at the edge**: a malformed build input throws at start, never later.
- One runtime dependency, `@krizaka/discovery`; React only as an optional peer of `./react`.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/app-client`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**), build,
  size, publint + attw (`esm-only`).
- **Size budget** (gzip): `.` ≤ 3 kB, `./react` ≤ 1 kB, `./server` ≤ 0.5 kB.
- Published surface: `.`, `./react`, `./server`, `./package.json`. Changing a header, the 401 rule, the timeout message or the storage key
  layout is a breaking change: apps in the stores depend on it.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the apps adopt it).
