---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

Tags, statuses and views (ADR-006 §7, [#627](https://github.com/krizaka/krizaka-ui/issues/627)) — the surfaces of `@krizaka/organize@0.4.0` (krizaka-ts#89), built on `chip`, `tag-selector`, `filter-bar` and `data-table` — no new entry.

- **Tokens:** the closed palette of tag markers — six names, `blue · green · amber · red · violet · gray`, as `--kz-tag-<name>` (the dot, ≥ 3:1) and `--kz-tag-<name>-text` (≥ 4.5:1) on every surface of both themes and of the product register. A test proves they are never a status tone or a product's accent (ΔE ≥ 10) and never twins of each other. The native theme gains the same roles (`tagBlue`, `tagBlueText`…).
- **`@krizaka/ui/chip`:** `TagChip` (a name with its marker, a dot or Yomizaka's bookmark ribbon; alone, in `Chip.Group` or removable), `TagMarker`, `MarkerPicker` (recolour from the six, named and ticked), and `StatusChip`: a state of a `StatusSet` — read-only when the set is derived, the role has no move or nobody listens; otherwise a menu of `movesFrom(set, state, role)` in the set's order, a second press for a move that asks to be confirmed, a reason picked from a list (never typed). Labels in the person's language. React Native: the same, the status chip taking its moves resolved (its menu is an action sheet).
- **`@krizaka/ui/tag-selector`:** an option may carry a `marker`; `creatable` adds a field — type to narrow, Enter takes the tag of that name or creates it in the colour chosen (`onCreate(name, marker)`), Backspace takes the last back.
- **`@krizaka/ui/filter-bar`:** `SavedViews` (and `FilterBar views`): the `system`, `workspace` and `mine` views as chips with counts, a « modified » mark, « Save view », rename and delete; links when the views have an address; **one menu on a phone** (« View: To decide »).
- **`@krizaka/ui/data-table`:** `SelectionBar` and `DataTable bulkActions` — the count, the actions the product gives, « Clear selection » and what the last change did, announced politely; sticky, docked above the tab bar on a phone (`--kz-dock-offset`); it says so past the most the service takes (`bulkMax`, 200).
- `@krizaka/organize` (≥ 0.4, its browser-safe `/contract` only) is now a dependency of `@krizaka/ui`.
