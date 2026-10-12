---
"@krizaka/ui": major
---

**`@krizaka/ui/data-table` v2 — on TanStack Table v9, the API redone (no v1 compatibility).** Products never import
`@tanstack/*`: the escape hatch is `useDataTable().table`. New: `filters` (text, facet, range — `DataTableFilters`
builds a `FilterBar` from the columns' `filter`, with facet counts and an announced result count), `groupBy` +
`aggregate`, `renderDetail` (a panel under a row) and `getSubRows` (trees), `columnVisibility` (`DataTableColumnsMenu`),
`pinning`, `resizing` (drag or ← → on a focusable separator), pagination under the table (`page`, `pageSize`,
`pageSizeOptions`), server mode (`manual: { sorting, filtering, pagination }` + `rowCount` + `onStateChange` with a
`DataTableQuery`), CSV export (`DataTableExport`, `dataTableCsv`), every state controlled or `default*`, `toolbar`.
Same markup and accessibility, cards on a phone kept. **Breaking:** `manualSort` → `manual={{ sorting: true }}`;
`virtualize={{ rowHeight, height, overscan }}` → `virtualized={{ height, estimateRowHeight, overscan }}` (rows are
measured); a column's `width` is a number of px (was a CSS string); `DataTableColumn.value` returns `CellValue`; the
hand-written sort and selection are gone.

**New `@krizaka/ui/virtual`** (TanStack Virtual v3): `VirtualList` (its own scrolling region or `scroll="window"`,
measured items, `onEndReached`, `ref.scrollToIndex` that respects reduced motion), `VirtualGrid` (as many columns as
the width allows), `useVirtualizer` / `useWindowVirtualizer` through the facade.

**New `@krizaka/ui/native/list`**: `List` on FlashList v2 (separators, skeleton rows, empty and error states, pull to
refresh tinted with the theme, a spinner for the next page) and `useInfiniteList` (`useInfiniteQuery` of
`@krizaka/query`, `meta: { list: true }`, the next page asked once at a time). `@shopify/flash-list` and
`@krizaka/query` are optional peers. Ships the `skills/` SKILL.md of the three entries.
