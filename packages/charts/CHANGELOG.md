# @krizaka/charts

## 0.4.0

### Minor Changes

- [#269](https://github.com/krizaka/krizaka-ui/pull/269) [`de51549`](https://github.com/krizaka/krizaka-ui/commit/de51549a3539596ced38aea3def2667a8d728c16) Thanks [@oussamaABID](https://github.com/oussamaABID)! - A next-generation visual language for charts ([#253](https://github.com/krizaka/krizaka-ui/issues/253)).
  
  - **`ChartCard`** (`@krizaka/charts/card`): one frame for every chart — title, a one-line **insight**, the chart, a footer — on the kit's Card; the chart inside takes its heading from the card. **`KpiStat`**: a key figure on the kit's `Stat`, its change against the previous period computed and written in words (`good="down"` for latency, spend), a sparkline of the period.
  - **Actions menu (⋯)** on every chart, replacing the "Show data" and export buttons: *View as table* (the kit `DataTable` in a `Sheet`, loaded when it opens), *Download CSV / PNG / SVG*, *Copy data*. The accessible table stays in the page. `actionsMenu={false}` keeps the former inline buttons. `@krizaka/ui` (>= 3.18.2) is now a peer dependency.
  - **Legend chips that filter**: line, area and bar legends, and the donut/pie legend (with each part's value and share), are toggle buttons (`aria-pressed`); the last visible one cannot be switched off.
  - **Sparse and empty data**: `autoRange` (with `minPoints`) zooms a time axis on the period that has data and says how sparse it is; a calmer empty state.
  - A designed Orazaka palette (orange with a cool counterpoint, colour-vision checks green), a softer `danger` tone for failed series, tabular numerals, staggered bar entrance. `title` is optional inside a `ChartCard`; new `insight` prop.

### Patch Changes

- [#271](https://github.com/krizaka/krizaka-ui/pull/271) [`ba7b7ec`](https://github.com/krizaka/krizaka-ui/commit/ba7b7ec412fbf212ce404e51d3f8fc192eb35358) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui` is a peer on the workspace protocol (`^3`), so the packed-package check installs it with the package on a release pull request.
- Updated dependencies [[`97ea37e`](https://github.com/krizaka/krizaka-ui/commit/97ea37ea4c01e9a2265343124fed39f4c53cb1d2), [`fc5e2e0`](https://github.com/krizaka/krizaka-ui/commit/fc5e2e0c539558873f15a3e2440bf4b43764d075)]:
  - @krizaka/ui@3.19.0

## 0.3.1

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.
- Updated dependencies [[`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e)]:
  - @krizaka/intl@0.2.1

## 0.3.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

### Patch Changes

- Updated dependencies [[`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703)]:
  - @krizaka/intl@0.2.0

## 0.2.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).
- Updated dependencies [[`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5)]:
  - @krizaka/intl@0.1.1

## 0.2.0

### Minor Changes

- [#78](https://github.com/krizaka/krizaka-ui/pull/78) [`1704427`](https://github.com/krizaka/krizaka-ui/commit/1704427332e19c2b3b95a5225bda582f72e3fa83) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Ready-made charts, named for the screens of the Krizaka apps, web and React Native: `EarningsChart` (`./earnings`:
  earnings per period in money minor units, the total, the last period's change, the payout threshold), `JobThroughput`
  (`./throughput`: jobs per period stacked by status, the total and the success rate), `LatencyChart` (`./latency`: p50
  and p95 per item in the unit that fits, against an objective; `formatDuration`), `CreditUsage` (`./credits`: what is
  left of an allowance, a meter in tones, the use per day, the run-out date), `GoalProgress` (`./goal`: a pot towards its
  goal, its supporters and the time left) and `PriceTicker` (`./ticker`: a live auction's price, the change since the
  opening, the bids as steps, the reserve). Each one leads with its key figure in words; `@krizaka/charts/native` has
  them all. Every chart's documentation now carries a `tier` — `ready-made`, `core` or `advanced` (radar, heatmap,
  calendar, sankey, funnel, candlestick, treemap, scatter, `Chart`, the map and the globe: no product screen uses them
  today). Fix: a `live` line chart no longer hides its line and dots while the entrance is suppressed.

## 0.1.0

### Minor Changes

- [#67](https://github.com/krizaka/krizaka-ui/pull/67) [`f675ca8`](https://github.com/krizaka/krizaka-ui/commit/f675ca8adcc4be1f8318028e93aaaec12f4843d9) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package: `@krizaka/charts`, the Krizaka data visualisation (epic [#49](https://github.com/krizaka/krizaka-ui/issues/49), wave W3). Typed, declarative React charts —
  LineChart, AreaChart, BarChart (grouped, stacked, horizontal), PieChart / DonutChart, Gauge, Sparkline, GeoMap,
  Globe3D, RadarChart, Heatmap, CalendarHeatmap, Sankey, Funnel, Candlestick, Treemap, ScatterChart and the low-level
  `Chart` (any ECharts option) — on the `--kz-*` tokens and per-brand colour-blind-checked palettes. Every chart carries
  a data table, a written summary, keyboard navigation, loading / empty / error states, SSR without layout shift,
  reduced motion, export (PNG, SVG, CSV), thresholds and markers; figures through `@krizaka/intl`. The simple types draw
  in plain SVG (8–13 kB); the rich ones load ECharts only when they near the screen; the globe needs no WebGL.
  `@krizaka/charts/native` brings the simple types to React Native with the same props.
