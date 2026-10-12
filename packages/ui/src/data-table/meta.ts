import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Data table",
  summary:
    "A table of records on TanStack Table v9 — sort, filters and facets, groups, details, pages, selection, column visibility, pinning and resizing — in the browser or on the server, cards on a phone, windowing for long lists.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  whenToUse: [
    "To compare records on the same columns: jobs, videos of a studio, users of an admin, invoices, payouts.",
    "When people sort, filter, group, select several rows for a bulk action, or export what they see.",
    "In server mode (`manual` + `onStateChange`) when the list lives in a database: the API sorts, filters and pages.",
    "With `virtualized` for a long list loaded at once (logs, 50,000 events) that must stay smooth.",
  ],
  whenNotToUse: [
    { when: "For a few figures side by side: stats.", use: "stat" },
    { when: "For a gallery of media where the picture matters more than the columns.", use: "virtual" },
    { when: "For a list on a phone app: FlashList, through the native list.", use: "list" },
  ],
  bestPractices: [
    "Keep `rows` and `columns` stable (module scope, state, a query's data, `useMemo`): a new array at each render recomputes every model.",
    "Give every column a `header` (it labels the value in a card and names its filter) and the row's name a `card: \"title\"` column.",
    "Put `DataTableFilters` in `toolbar`; mark the columns it filters with `filter: \"text\" | \"facet\" | \"range\"`, and give a server table's facets their `options`.",
    "Server mode: keep the `DataTableQuery` from `onStateChange` in state (or the address), put it in the query key, and pass `rowCount` — `placeholderData: keepPreviousData` keeps the page while the next one loads.",
    "Say what failed in `error` with a way to retry; say what to do next in `empty` (an `EmptyState` with an action).",
    "Align amounts and counts to the end (`align: \"end\"`) in tabular numbers; pin the name column of a wide table.",
    "Need something the props do not cover? `useDataTable()` gives the TanStack instance — never import `@tanstack/*` in a product.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Reaches the toolbar, the sort buttons of the headers, the resize handles, the checkboxes, the expand buttons and the links of the cells." },
      { keys: "Space", action: "Toggles the focused checkbox, sorts by the focused header, or opens the focused row or group." },
      { keys: "Arrow keys", action: "On a focused resize handle, narrow or widen the column (Shift for larger steps)." },
    ],
    notes: [
      "A `table` with a `caption` (hidden unless `showCaption`) and `scope=\"col\"` headers; the roles are written out, so the cards keep the table's semantics.",
      "The sorted column carries `aria-sort`; a sortable header is a button that says its state with `aria-pressed`.",
      "An expand button (a row's details, a group, a tree) says its state with `aria-expanded` and names the row; a group's button says its value and its count.",
      "A resize handle is a focusable `separator` named after its column, with its width as `aria-valuenow`.",
      "The filters' bar is a named group; the count of results is announced politely when it changes; each filter in force is a chip with a remove button.",
      "While loading the table is `aria-busy` and its caption says so; an error is announced (`role=\"alert\"`).",
      "Windowed rows carry `aria-rowindex` and the table `aria-rowcount`: a screen reader knows where it is in the whole list; the scrolling body is a focusable region.",
    ],
  },
  related: ["filter-bar", "pagination", "virtual", "checkbox", "empty-state"],
  web: {
    imports: ["DataTable", "DataTableFilters", "DataTableColumnsMenu", "DataTableExport", "useDataTable"],
    examples: [
      { name: "jobs", title: "Jobs", description: "Sortable columns, a status badge, row selection for a bulk action." },
      { name: "filters", title: "Filters, columns, export", description: "A search, facets with their counts, a range; the filters as chips; hide columns; export the rows shown as CSV." },
      { name: "server", title: "Server mode", description: "Sort, filters and page go to the API through `krizakaFetch` and `defineKeys` of @krizaka/query; the previous page stays while the next one loads." },
      { name: "paginated", title: "Pages", description: "Client pagination under the table, with the rows per page to choose." },
      { name: "grouped", title: "Groups", description: "`groupBy`: a row per group with its count and its total (`aggregate`), opened to see its rows." },
      { name: "details", title: "Details", description: "`renderDetail`: a button per row opens a panel under it." },
      { name: "pinned", title: "Pinned and resizable", description: "A wide table: the name pinned at the start, columns resized by drag or by the arrow keys." },
      { name: "cards", title: "Cards on a phone", description: "`layout=\"cards\"`: each row a card, the title on top — what `auto` does in a narrow container." },
      { name: "loading", title: "Loading", description: "Skeleton rows while the first page loads, the table busy." },
      { name: "empty", title: "Empty", description: "No record yet: an empty state with the next step." },
      { name: "error", title: "Error", description: "The request failed: an alert with a retry, in place of the rows." },
      { name: "virtualized", title: "50,000 rows", description: "`virtualized`: only the rows in view are rendered and measured, the header stays." },
    ],
  },
} satisfies ComponentMeta;
