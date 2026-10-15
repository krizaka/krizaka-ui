---
"@krizaka/ui": minor
---

DataTable: responsive by itself (#222). Columns get a `type` (`title` · `badge` · `status` · `number` · `date` · `link` · `text`: sensible widths, alignment, truncation or line clamps, the full value on hover), a `priority` (2 to 7: the column leaves the row when the table's own width falls under its tier and goes to the row's detail, opened by a chevron; under 36 rem the rows are cards), `minWidth` / `maxWidth`, `nowrap`, `clamp`, `subtitle`, `href`, `unit`. New props: `stickyHeader` (or a px offset), `striped`, `scroll` (the sideways scroll is now an opt-in, with edge fades, once columns are typed), `stickyFirstColumn`; one row height per density. Opening a row no longer remounts it (the focus stays on its button). Tables without `type` / `priority` render as before. `CataloguePage` takes `railFrom="wide"` to keep its filters as a bar above the results under 1280 px. Three new examples: models catalogue, invoice list, admin runs.
