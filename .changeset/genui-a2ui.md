---
"@krizaka/ui": minor
"@krizaka/charts": minor
---

Data-driven UI (ADR-082, krizaka/orazaka#207): `@krizaka/ui/genui` draws the interface a model describes in A2UI v0.9 — `GenUiStream` (a model's answer, its prose and its `a2ui` fence, growing as it streams), `GenUiSurface`, the strict validator (`validateMessage`: catalog `krizaka:genui/v1` only, unknown components and properties refused, tree-only, prototype-safe JSON pointers, size and depth caps), the store (`readStream`, `applyMessage`) and the base catalog (`Column`, `Row`, `Text`, `Card`, `Callout`, `Table`). `@krizaka/charts/genui` adds `chartsGenUiCatalog` (`KpiStat`, `ChartCard` with line · bar · area · pie).
