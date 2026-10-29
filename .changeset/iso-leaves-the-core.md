---
"@krizaka/ui": minor
---

`@krizaka/ui/iso` (the isometric kit: `IsoHub`, `IsoScene`, `IsoPrism`, `IsoStack`, `IsoDome`, `IsoTile`, `IsoLink`, `IsoNode`, `IsoLabel`) leaves the core and moves to Krizaka Lab (`experiments/ui/iso`, parked, decide later), together with its `.kz-iso-*` styles in `motion.css`. No Krizaka app imports it (the usage inventory), and there is no external consumer yet, so there is no deprecation period and no major (ADR-008, founder 2026-10-29). First slice of the move by domain (Foundations).

New: `pnpm devx:check` (CI) measures the import cost of a typical page and the cold type-check time against `packages/ui/devx-budget.json`.
