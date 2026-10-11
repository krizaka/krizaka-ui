# @krizaka/charts

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
