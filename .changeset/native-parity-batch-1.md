---
"@krizaka/ui": minor
"@krizaka/charts": minor
---

Native parity, batch 1 — what the phone apps wrote by hand (krizaka-ui#275, #246). `@krizaka/ui/native`: `Stat` and `StatGrid` (a figure, its change in words, a hint, a chart; one element for a screen reader), `Alert` (info · success · warning · danger, an urgent one announced when it appears), `Separator`, `AuthLayout` (the entry screen: mark, title, form, the other way, the fine print), `SettingsSection` and `SettingsRow` (titled groups of rows, a switch as `accessory`, `destructive`), and `MessageBubble` takes rich `children` (a model's answer as `Markdown`) while `text` stays its accessible name. `@krizaka/charts/native`: `KpiStat` (the change against the previous period in words, `good="down"`, the period's sparkline) and `ChartCard` (title, insight, actions, the chart, a footer). Stat, Alert, Separator, AuthLayout and SettingsLayout are now `both` in the parity matrix, KpiStat and ChartCard too.
