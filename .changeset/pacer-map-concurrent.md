---
"@krizaka/pacer": minor
---

`mapConcurrent(items, task, { concurrency, signal })`: one task per item, at most `concurrency` at once (default 3), every outcome kept in the items' order (a failure never stops the others). For « upload these photos, then save once » — the forms stop hand-writing a sequential loop.
