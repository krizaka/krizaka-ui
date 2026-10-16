---
"@krizaka/charts": minor
---

A next-generation visual language for charts (#253).

- **`ChartCard`** (`@krizaka/charts/card`): one frame for every chart — title, a one-line **insight**, the chart, a footer — on the kit's Card; the chart inside takes its heading from the card. **`KpiStat`**: a key figure on the kit's `Stat`, its change against the previous period computed and written in words (`good="down"` for latency, spend), a sparkline of the period.
- **Actions menu (⋯)** on every chart, replacing the "Show data" and export buttons: *View as table* (the kit `DataTable` in a `Sheet`, loaded when it opens), *Download CSV / PNG / SVG*, *Copy data*. The accessible table stays in the page. `actionsMenu={false}` keeps the former inline buttons. `@krizaka/ui` (>= 3.18.2) is now a peer dependency.
- **Legend chips that filter**: line, area and bar legends, and the donut/pie legend (with each part's value and share), are toggle buttons (`aria-pressed`); the last visible one cannot be switched off.
- **Sparse and empty data**: `autoRange` (with `minPoints`) zooms a time axis on the period that has data and says how sparse it is; a calmer empty state.
- A designed Orazaka palette (orange with a cool counterpoint, colour-vision checks green), a softer `danger` tone for failed series, tabular numerals, staggered bar entrance. `title` is optional inside a `ChartCard`; new `insight` prop.
