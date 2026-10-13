# @krizaka/charts

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
