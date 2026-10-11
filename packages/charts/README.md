# @krizaka/charts

Krizaka's data visualisation: typed, declarative React charts on the `--kz-*` tokens and the brand palettes, with what
chart libraries leave to you built in — a data table and a written summary in every chart, keyboard navigation,
loading / empty / error states, SSR without layout shift, export, thresholds, live data — and React Native for the
simple types.

**Documentation: [krizaka.com/docs/ui](https://www.krizaka.com/docs/ui)** (generated from this package's registry).

```bash
npm install @krizaka/charts
# React Native: npx expo install react-native-svg
```

```tsx
import { LineChart } from "@krizaka/charts/line";

<LineChart
  title="Earnings, last 6 months"
  data={earnings}                       // [{ month: "2026-04", sales: 182000, tips: 21000 }, …] — cents
  x="month"
  series={[{ key: "sales", label: "Video sales" }, { key: "tips", label: "Tips" }]}
  format={{ style: "money", currency: "EUR" }}
  thresholds={[{ value: 250_000, label: "Payout threshold", tone: "success" }]}
  locale="fr-FR"
  exportable
/>;
```

| Entry | Charts | Engine |
| :-- | :-- | :-- |
| `@krizaka/charts/line` | `LineChart`, `AreaChart` | SVG, 13 kB |
| `@krizaka/charts/bar` | `BarChart` (grouped, stacked, horizontal) | SVG, 13 kB |
| `@krizaka/charts/pie` | `PieChart`, `DonutChart` | SVG, 9 kB |
| `@krizaka/charts/gauge` | `Gauge` | SVG, 8 kB |
| `@krizaka/charts/sparkline` | `Sparkline` | SVG, 10 kB |
| `@krizaka/charts/geo` | `GeoMap` | SVG (d3-geo) + the world on demand |
| `@krizaka/charts/globe` | `Globe3D` | SVG (orthographic, no WebGL) |
| `@krizaka/charts/radar` · `heatmap` · `sankey` · `funnel` · `candlestick` · `treemap` · `scatter` | `RadarChart`, `Heatmap`, `CalendarHeatmap`, `Sankey`, `Funnel`, `Candlestick`, `Treemap`, `ScatterChart` | ECharts, loaded when the chart nears the screen (~11 kB before) |
| `@krizaka/charts/chart` | `Chart` — any ECharts option, themed and framed | ECharts (`modules` to tree-shake) |
| `@krizaka/charts/provider` | `ChartsProvider` (locale, brand, words), `useSlidingWindow` | — |
| `@krizaka/charts/native` | `LineChart`, `AreaChart`, `BarChart`, `PieChart`, `DonutChart`, `Gauge`, `Sparkline` | react-native-svg |

Needs React 19 and the Krizaka tokens in the page (`@krizaka/tokens/tokens.css`, or `@krizaka/tailwind`); the
charts' own CSS is embedded. Themes follow `color-scheme` (`html.light`, `.theme-light`); brands follow a
`.brand-<id>` ancestor or `brand` (`krizaka`, `orazaka`, `orochia`).

Apache-2.0. The world map data is Natural Earth (public domain) through world-atlas (ISC).
