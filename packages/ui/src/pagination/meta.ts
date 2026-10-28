import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Pagination",
  summary: "Moves through a long list page by page: numbers with ellipses that fold into “Page 3 of 12” on a phone, or previous / next on a cursor.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Under a table or a grid of results the person reads page by page: an admin list, search results, invoices.",
    "With `getHref` when the page belongs in the address — a search engine and a shared link reach page 4.",
    "In cursor mode (`hasPrevious` / `hasNext`) when the API only knows the next page (a cursor, a `nextToken`).",
  ],
  whenNotToUse: [
    { when: "For a feed people scroll without a goal: load more at the end of the list instead (an infinite list)." },
    { when: "To switch between views of the same page: tabs.", use: "tabs" },
  ],
  bestPractices: [
    "Say where the list stands with `status` (“61–80 of 392 videos”): it is read next to the controls.",
    "Prefer links (`getHref`) for public lists; buttons (`onPageChange`) for a list inside an app screen.",
    "Keep `siblings` at 1 on a list people browse; the container folds the numbers by itself under 28rem.",
    "Disable the controls (`disabled`) while the next page loads, and move the focus to the top of the list after.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Reaches the previous control, each page, then the next control." }],
    notes: [
      "A `nav` named by `labels.nav`; the current page carries `aria-current=\"page\"`.",
      "Each number is named “Page 4” (`labels.page`); the ellipses are hidden from assistive technology.",
      "A disabled link is `aria-disabled` with no `href`: it is skipped by the Tab key and read as unavailable.",
    ],
  },
  related: ["data-table", "filter-bar", "search-field"],
  web: {
    imports: ["Pagination", "pageRange"],
    examples: [
      { name: "results", title: "Search results", description: "Page numbers with ellipses and a status: the explore page of a video platform." },
      { name: "table-footer", title: "Table footer", description: "Under an admin table: the rows per page, the range shown, and the pages." },
      { name: "cursor", title: "Cursor", description: "An API that only knows the next and previous pages: two buttons and the range." },
      { name: "links", title: "Links in the address", description: "`getHref`: every page is a link — crawlable, shareable, the state in the URL." },
    ],
  },
  native: {
    imports: ["Pagination"],
    differences: [
      "Folded only: previous / next and “Page 3 of 12”, the form a thumb reaches; no numbers, no links, no page size.",
      "`labels` is required (`previous`, `next`, `compact`).",
    ],
    examples: [
      { name: "pages", title: "Pages", description: "Previous / next around “Page 3 of 12”." },
      { name: "cursor", title: "Cursor", description: "Previous / next on a cursor, with the range in between." },
    ],
  },
} satisfies ComponentMeta;
