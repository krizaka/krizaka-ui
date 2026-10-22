# @krizaka/payments — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/payments`**. Lives in `packages/payments` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Decision: [`docs/adr/ADR-005-payments-package.md`](../../docs/adr/ADR-005-payments-package.md).

## 1. What belongs here

- **The payments port** (`PaymentsPort`, vendor-free `PaymentEvent`s), **the Stripe adapter** (a small client over `fetch`, no SDK),
  **webhook verification** (HMAC over the raw body, replay window), **idempotent application** (`applyOnce` + `EventStore`),
  **price reading** by lookup key and its locale formatter, and **catalogue setup** (products, prices, portal, webhook from data).
- Not here: plans, entitlements, accounts, tables other than the one-line `payment_events` store, UI, amounts, price keys
  (all the product's data), messages.

## 2. Rules

- **Zero runtime dependency**; nothing read from the environment (keys are arguments); the caller passes `fetch`.
- **No amount, no product word** in the code: prices are the processor's data, found by lookup key; the catalogue is a value the caller passes.
- Live mode is refused by the setup unless the caller says it is the owner.

## 3. Quality gates

`pnpm turbo run check --filter=@krizaka/payments`: ESLint and `tsc`, Vitest with **100 % coverage**, build, size (≤ 4 kB gzip), publint + attw.
A changeset for every change to `src/`; its own version (0.x while the products adopt it).
