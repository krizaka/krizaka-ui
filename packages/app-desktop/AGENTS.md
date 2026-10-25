# @krizaka/app-desktop — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/app-desktop`**. Lives in `packages/app-desktop` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Decision: [krizaka/.github ADR-005](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-005-tauri-app-kit.md).

## 1. What belongs here

- **The typed page side of `tauri-plugin-krizaka`** ([krizaka-tauri-kit](https://github.com/krizaka/krizaka-tauri-kit)):
  folder grants and watches, dropped files, the Keychain as the `KeyValueStorage` of `@krizaka/app-client`, the native
  menu bar, deep links, the update channel. The page never calls an untyped command.
- Not here: the rules (they are the kit's, in Rust: the folder scope, the link and menu checks); a product's own
  commands, words or brand; the screens (`@krizaka/ui`, « desktop is the web in a window », ADR-002).

## 2. Rules

- **Ports in.** `invoke` and `listen` of `@tauri-apps/api` arrive as a `TauriBridge`; no Tauri module is imported.
- **`COMMANDS` is the contract** with the plugin's `build.rs`: a command added, renamed or removed changes both, in the
  same release of the kit; renaming one is a breaking change.
- No product word in this folder. One runtime dependency, `@krizaka/app-client` (the storage port's type, and the session
  store the Mac apps share with the mobile ones).

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/app-desktop`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**),
  build, size, publint + attw (`esm-only`).
- **Size budget** (gzip): `.` ≤ 1.5 kB.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the Mac apps adopt it).
