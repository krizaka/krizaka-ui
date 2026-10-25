---
"@krizaka/ui": minor
---

Templates for Akinaza's, Yomizaka's and Orazaka's screens ([#653](https://github.com/krizaka/krizaka-ui/issues/653), ADR-006 §6), no new entry and no fiscal or receipt logic. Audit in [#622](https://github.com/krizaka/krizaka-ui/issues/622).

- **Operate · `dashboard-layout`:** `date` on the right of the heading (under the title on a phone), a `description` that may hold links to the figures, `quickActions` (2 to 4 tiles, a `nav`, `quickActionsLabel`, `linkAs`) and a `side` column (beside the widgets from `lg`, last on a phone). Example `today`.
- **Operate · `catalogue-page`:** `plan` with the new `PlanStrip` (2 or 3 figures and a `Meter`), `dividers` (the binder), `selection` (the `SelectionBar` of #627, after the results). Example `clients`.
- **Show · `detail-layout`:** `notes` column with `DetailNotes` (numbered notes, an add field) before the side panel, `DetailSection` (a binder section: a titled region with its tab), over the `cover` banner of #650. Example `client`.
- **Act · form:** `FormSteps` (an ordered list of numbered, named steps), `FormTotals` (the sticky totals card of the `aside`), and `StickyAction mode="task"` — on every width, with the `summary` (the total) before the action. Example `new-invoice`.
