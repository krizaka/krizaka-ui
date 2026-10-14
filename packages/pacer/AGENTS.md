# @krizaka/pacer — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/pacer`**. Lives in `packages/pacer` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Cadence shared by every product** (stack decision S5): `debounce` / `throttle` (functions and the hooks
  `useDebouncedValue`, `useDebouncedCallback`, `useThrottledCallback`), `createQueue` (concurrency, priority, retries with
  backoff, pause / resume / retry / cancel per job), `RateLimiter` (a window, and a hold the server can put on it —
  `RateLimiter.fromProblemDetails`).
- Not here: what a queue carries (an upload, a draft sync — the app or `@krizaka/ui/file-upload`), where a limit is
  enforced (the server), a product's endpoints or messages.

## 2. Rules

- **The only door to `@tanstack/pacer`** (beta). The API is ours; TanStack's is an internal detail, pinned exactly, and
  a break is fixed here once. Pacer's `AsyncQueuer` is not used: it cannot pause one job, which an upload needs — the
  scheduler is ours, the retries (`AsyncRetryer`), debounce, throttle and window counting are Pacer's.
- **Framework-free by default.** `.` carries no React and no directive (a Node script can run a queue); `./react` is the
  hooks, a client module (tsup banner). Works on React Native: nothing here touches the DOM.
- **No product word, nothing read from the environment, no words** (no label, no message).
- A wait of 0 calls through at once — the contract `@krizaka/ui`'s primitives rely on.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/pacer`: ESLint and `tsc`, tests (Vitest on happy-dom; functions, lines and
  statements 100 %, branches ≥ 95 %), build, size, publint + attw (`esm-only`).
- **Size budget** (gzip, TanStack and React excluded): `.` ≤ 4 kB, `./react` ≤ 2 kB.
- Published surface: exports `.`, `./react`, `./package.json`; files `dist`, `README.md`, `SKILL.md`, `LICENSE`.
  Renaming an export, a job status or a default (concurrency 2, retries 0, backoff exponential 1 s capped at 30 s) is
  a breaking change.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the products adopt it).
`SKILL.md` is written by hand until the generated skills (stack decision S12) arrive.
