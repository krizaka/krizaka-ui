---
"@krizaka/email": patch
"@krizaka/pacer": patch
"@krizaka/app-config": patch
---

Internal cleanup: no `void` operator in the in-memory delivery log, suppression list, idempotency store and the subscribe callbacks (Sonar S3735). No behaviour change.
