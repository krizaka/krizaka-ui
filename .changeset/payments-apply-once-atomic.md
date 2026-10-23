---
"@krizaka/payments": patch
---

Fix: a webhook event whose handler failed was recorded as applied and never applied again. `applyOnce` now gives the id back (`EventStore.forget`, implemented by `pgEventStore` with a `DELETE`) and rethrows, so the processor's retry applies it. A new `applyOnceInTransaction(transaction, event, handlers)` records the id and runs the effect in one transaction, which also closes the crash window between the two (krizaka-ts#47, ADR-001 §4).
