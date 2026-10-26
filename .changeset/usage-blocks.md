---
"@krizaka/ui": minor
---

`@krizaka/ui/usage`: the blocks of a « Credits & usage » page, extracted from Orazaka's. `CreditsMeter` (the balance on `Meter`, renewal and the way to buy), `PeriodSwitch` (7 · 30 · 90 d as links, the address holds `?period=`, with `parsePeriod`), `UsageTiles` (the figures on `StatGrid variant="strip"`, each compared with the previous period in words, fr-CA figures and French words by default) and `UsageChart` (one bar per day stacked by outcome, with its legend and a table as text version), with loading and empty states. Server-safe.
