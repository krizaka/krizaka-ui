import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Data table",
  summary: "A table of records — sort, selection, loading, empty and error states, a sticky header in frosted glass, rows that light up under the pointer — that turns into cards on a phone and renders only the rows in view when there are thousands.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  whenToUse: [
    "To compare records on the same columns: jobs, videos of a studio, users of an admin, invoices.",
    "When people sort, select several rows for a bulk action, or scan a status column.",
    "With `virtualize` for a long list loaded at once (logs, 5,000 events) that must stay smooth.",
  ],
  whenNotToUse: [
    { when: "For a few figures side by side: stats.", use: "stat" },
    { when: "For a gallery of media where the picture matters more than the columns: a grid of cards.", use: "card" },
  ],
  bestPractices: [
    "Give every column a `header` (it labels the value in a card) and the row's name a `card: \"title\"` column.",
    "Sort on the server (`manualSort` + `onSortChange`) when the table shows a page of a larger list.",
    "Put a `Pagination` in `footer` and a `FilterBar` above; keep the filters and the page in the address.",
    "Say what failed in `error` with a way to retry; say what to do next in `empty` (an `EmptyState` with an action).",
    "Align amounts and counts to the end (`align: \"end\"`) in tabular numbers.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Reaches the sort buttons of the headers, the checkboxes and the links of the cells." },
      { keys: "Space", action: "Toggles the focused checkbox, or sorts by the focused header." },
    ],
    notes: [
      "A `table` with a `caption` (hidden unless `showCaption`) and `scope=\"col\"` headers; the roles are written out, so the cards keep the table's semantics.",
      "The sorted column carries `aria-sort`; a sortable header is a button that says its state with `aria-pressed`.",
      "While loading the table is `aria-busy` and its caption says so; an error is announced (`role=\"alert\"`).",
      "Windowed rows carry `aria-rowindex` and the table `aria-rowcount`: a screen reader knows where it is in the whole list; the scrolling body is a focusable region.",
    ],
  },
  related: ["pagination", "filter-bar", "checkbox", "empty-state", "skeleton"],
  web: {
    imports: ["DataTable"],
    examples: [
      { name: "jobs", title: "Jobs", description: "Sortable columns, a status badge, row selection for a bulk action." },
      { name: "cards", title: "Cards on a phone", description: "`layout=\"cards\"`: each row a card, the title on top — what `auto` does in a narrow container." },
      { name: "loading", title: "Loading", description: "Skeleton rows while the first page loads, the table busy." },
      { name: "empty", title: "Empty", description: "No record yet: an empty state with the next step." },
      { name: "error", title: "Error", description: "The request failed: an alert with a retry, in place of the rows." },
      { name: "virtualized", title: "5,000 rows", description: "`virtualize`: only the rows in view are rendered, the header stays." },
      { name: "sticky-header", title: "Sticky header", description: "`maxHeight`: the body scrolls, the header stays on top in frosted glass; rows light up under the pointer." },
    ],
  },
} satisfies ComponentMeta;
