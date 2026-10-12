# @krizaka/push — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/push`**. Lives in `packages/push` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Mobile push delivery shared by every product**: the Expo Push Service client (FCM on Android, APNs on iOS),
  token validation, batching, dead-token reporting. Level 0, no UI.
- Not here: where tokens are stored, which event deserves a push, user preferences, message texts (the app's), the
  client-side registration (`expo-notifications`, in the mobile apps).

## 2. Rules

- **Zero runtime dependency**, no SDK: the caller passes `fetch`. Nothing read from the environment (the access token
  is an argument).
- **Never throws**: every failure is an entry of `PushOutcome.errors`; dead tokens are reported, never silently kept.
- No product word in this folder.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/push`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced**), build,
  size, publint + attw (`esm-only`).
- **Size budget** (gzip): `.` ≤ 1 kB.
- Published surface: exports `.`, `./package.json`; files `dist`, `README.md`, `LICENSE`. Removing or renaming an
  export or a field, or changing a default (`sound`, `channelId`, batch size), is a breaking change.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the products adopt it).
