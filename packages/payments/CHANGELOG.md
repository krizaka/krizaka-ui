# @krizaka/payments

## 0.2.2

### Patch Changes

- [#666](https://github.com/krizaka/krizaka-ui/pull/666) [`8a5d7b9`](https://github.com/krizaka/krizaka-ui/commit/8a5d7b9f5f440e0d20a22d68ec9e3ef07a437c10) Thanks [@dependabot](https://github.com/apps/dependabot)! - Errors keep their cause: the « did not answer in time » TypeError of `@krizaka/app-client` carries the abort it comes from, and the AggregateError of `@krizaka/payments` (handler and give-back both failed) carries the give-back's failure as `cause`.

## 0.2.1

### Patch Changes

- [#570](https://github.com/krizaka/krizaka-ui/pull/570) [`edeadfe`](https://github.com/krizaka/krizaka-ui/commit/edeadfecf77940626416392fd9de06eab97f786b) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Fix: a webhook event whose handler failed was recorded as applied and never applied again. `applyOnce` now gives the id back (`EventStore.forget`, implemented by `pgEventStore` with a `DELETE`) and rethrows, so the processor's retry applies it. A new `applyOnceInTransaction(transaction, event, handlers)` records the id and runs the effect in one transaction, which also closes the crash window between the two (krizaka-ts#47, ADR-001 §4).

## 0.2.0

### Minor Changes

- [#481](https://github.com/krizaka/krizaka-ui/pull/481) [`5fde57c`](https://github.com/krizaka/krizaka-ui/commit/5fde57c808d44e58e9dc38f72e2df2344b5c7e74) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - First release: the payments port, the Stripe adapter (Checkout, portal, price by lookup key, verified webhook), idempotent event application, a locale-aware price formatter and a catalogue setup from data.
