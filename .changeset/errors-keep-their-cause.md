---
"@krizaka/app-client": patch
"@krizaka/payments": patch
---

Errors keep their cause: the « did not answer in time » TypeError of `@krizaka/app-client` carries the abort it comes from, and the AggregateError of `@krizaka/payments` (handler and give-back both failed) carries the give-back's failure as `cause`.
