# @krizaka/charts

Krizaka's data visualisation: typed, declarative React charts on the `--kz-*` tokens and the brand palettes, with what
chart libraries leave to you built in — a data table and a written summary in every chart, keyboard navigation,
loading / empty / error states, SSR without layout shift, export, thresholds, live data — and React Native for the
simple types.

**Documentation: [ui.krizaka.com](https://ui.krizaka.com)** (generated from this package's registry).

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

**Start from the need.** The ready-made charts answer the screens of the Krizaka apps with their formats, words and
defaults chosen; the core charts are what they are built on; the advanced ones have no product use today.

| Need (screen) | Ready-made chart | Entry | Native |
| :-- | :-- | :-- | :-- |
| Earnings per month (a creator's earnings page, a console's treasury) | `EarningsChart` | `@krizaka/charts/earnings` | yes |
| Jobs per day by status, success rate (Orazaka insights, supervision, mobile Jobs) | `JobThroughput` | `@krizaka/charts/throughput` | yes |
| Latency / time to result per capability, against an objective | `LatencyChart` | `@krizaka/charts/latency` | yes |
| Credits or storage left, run-out date (Orazaka billing, a storage plan) | `CreditUsage` | `@krizaka/charts/credits` | yes |
| A challenge's pot towards its goal (web and app) | `GoalProgress` | `@krizaka/charts/goal` | yes |
| A live auction's price (an auction room, web and app) | `PriceTicker` | `@krizaka/charts/ticker` | yes |

| Entry | Charts | Engine |
| :-- | :-- | :-- |
| `@krizaka/charts/line` | `LineChart`, `AreaChart` | SVG, 13 kB |
| `@krizaka/charts/bar` | `BarChart` (grouped, stacked, horizontal) | SVG, 13 kB |
| `@krizaka/charts/pie` | `PieChart`, `DonutChart` | SVG, 9 kB |
| `@krizaka/charts/gauge` | `Gauge` | SVG, 8 kB |
| `@krizaka/charts/sparkline` | `Sparkline` | SVG, 10 kB |
| `@krizaka/charts/geo` | `GeoMap` — advanced | SVG (d3-geo) + the world on demand |
| `@krizaka/charts/globe` | `Globe3D` — advanced | SVG (orthographic, no WebGL) |
| advanced: `@krizaka/charts/radar` · `heatmap` · `sankey` · `funnel` · `candlestick` · `treemap` · `scatter` | `RadarChart`, `Heatmap`, `CalendarHeatmap`, `Sankey`, `Funnel`, `Candlestick`, `Treemap`, `ScatterChart` | ECharts, loaded when the chart nears the screen (~11 kB before) |
| `@krizaka/charts/chart` | `Chart` — advanced: any ECharts option, themed and framed | ECharts (`modules` to tree-shake) |
| `@krizaka/charts/provider` | `ChartsProvider` (locale, brand, words), `useSlidingWindow` | — |
| `@krizaka/charts/native` | the six ready-made charts, `LineChart`, `AreaChart`, `BarChart`, `PieChart`, `DonutChart`, `Gauge`, `Sparkline` | react-native-svg |

Needs React 19 and the Krizaka tokens in the page (`@krizaka/tokens/tokens.css`, or `@krizaka/tailwind`); the
charts' own CSS is embedded. Themes follow `color-scheme` (`html.light`, `.theme-light`); brands follow a
`.brand-<id>` ancestor or `brand` (`krizaka`, `orazaka`).

Apache-2.0. The world map data is Natural Earth (public domain) through world-atlas (ISC).
