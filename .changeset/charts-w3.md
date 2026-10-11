---
"@krizaka/charts": minor
---

New package: `@krizaka/charts`, the Krizaka data visualisation (epic #49, wave W3). Typed, declarative React charts —
LineChart, AreaChart, BarChart (grouped, stacked, horizontal), PieChart / DonutChart, Gauge, Sparkline, GeoMap,
Globe3D, RadarChart, Heatmap, CalendarHeatmap, Sankey, Funnel, Candlestick, Treemap, ScatterChart and the low-level
`Chart` (any ECharts option) — on the `--kz-*` tokens and per-brand colour-blind-checked palettes. Every chart carries
a data table, a written summary, keyboard navigation, loading / empty / error states, SSR without layout shift,
reduced motion, export (PNG, SVG, CSV), thresholds and markers; figures through `@krizaka/intl`. The simple types draw
in plain SVG (8–13 kB); the rich ones load ECharts only when they near the screen; the globe needs no WebGL.
`@krizaka/charts/native` brings the simple types to React Native with the same props.
