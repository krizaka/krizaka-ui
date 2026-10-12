---
name: krizaka-data-table
description: Tables of records in a Krizaka web app with @krizaka/ui/data-table v2 (TanStack Table v9 behind the Krizaka facade) — sorting, text/facet/range filters, grouping, detail panels and trees, pagination, selection, column visibility, pinning, resizing, CSV export, server mode with @krizaka/query, windowing of long lists, cards on a phone. Use it before writing any table, list of records, admin grid or <table> in a Krizaka product.
---

# @krizaka/ui/data-table (v2)

## Rules

1. Import from `@krizaka/ui/data-table` — **never `@tanstack/react-table`** (ESLint `krizaka/no-direct-tanstack-import`,
   dependency-cruiser). The escape hatch is `useDataTable().table` (the TanStack instance), inside the table's `toolbar`.
2. **No `<table>` written by hand** in an app for records (ratchet `krizaka/no-local-table-or-form`).
3. `rows` and `columns` are **stable**: module scope, state, a query's `data`, or `useMemo`. Never `rows={data ?? []}` —
   use a module constant (`const NONE: Row[] = []`).
4. Words are props, passed translated: `header` of each column, `caption`, `labels` (`dataTableLabels` lists them).
5. A server list: `manual={{ sorting: true, filtering: true, pagination: true }}`, `rowCount`, `onStateChange` → the
   `DataTableQuery` in state (or the URL) → the query key (`defineKeys`) → `krizakaFetch`. `placeholderData:
   keepPreviousData` keeps the page while the next loads; `meta: { list: true }` keeps errors in the table.

## Columns

```ts
const columns: DataTableColumn<Job>[] = [
  { id: "name", header: t.jobs.name, sortable: true, card: "title", filter: "text" },
  { id: "status", header: t.jobs.status, filter: "facet", groupable: true, options: statusOptions, cell: (j) => <Badge>…</Badge> },
  { id: "cost", header: t.jobs.cost, align: "end", filter: "range", value: (j) => j.cents, aggregate: (rows) => sum(rows) },
];
```

`value` is what sorts, filters, groups and exports (default `row[id]`); `cell` is what shows.

## Recipes

```tsx
// Client table with filters, columns menu, export and pages
<DataTable caption={t.jobs.title} rows={jobs} columns={columns} getRowId={(j) => j.id} rowLabel={(j) => j.name}
  selectable onSelectedChange={setSelected} defaultPageSize={25} pageSizeOptions={[25, 50, 100]}
  toolbar={<><DataTableFilters /><DataTableColumnsMenu /><DataTableExport filename="jobs.csv" /></>}
  labels={t.dataTable} />

// Server table
const [query, setQuery] = useState<DataTableQuery>({ sort: null, filters: {}, page: 1, pageSize: 25 });
const { data, isPending, error } = useQuery({ ...jobsQuery(query), placeholderData: keepPreviousData });
<DataTable rows={data?.rows ?? NONE} rowCount={data?.total} manual={{ sorting: true, filtering: true, pagination: true }}
  defaultPageSize={25} onStateChange={setQuery} loading={isPending} error={error && <ErrorState … />} … />
```

Also: `groupBy` / `defaultGroupBy`, `renderDetail` (a panel under a row), `getSubRows` (a tree), `pinning={{ start:
["name"], end: ["actions"] }}`, `resizing`, `columnVisibility`, `virtualized={{ height: 480 }}` (thousands of rows
loaded at once), `layout="cards"` / `auto` (cards below 36rem), `density="compact"`, `loading` / `empty` / `error`.

## Accessibility (built in)

Caption, `scope="col"`, `aria-sort`, `aria-expanded` on expand buttons, focusable resize separators (← →), a named
filters group with an announced count, `aria-busy` while loading, `role="alert"` on errors, `aria-rowcount` /
`aria-rowindex` when windowed. Give `caption` and `rowLabel` real words.
