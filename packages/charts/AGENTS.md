# @krizaka/charts — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/charts`**. Lives in `packages/charts` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first. Wave W3 of the epic krizaka/krizaka-ui#49.

## 1. What belongs here

- **Data visualisation without product vocabulary** (level 1): typed, declarative React charts — `LineChart`,
  `AreaChart`, `BarChart`, `PieChart` / `DonutChart`, `Gauge`, `Sparkline`, `GeoMap`, `Globe3D`, `RadarChart`,
  `Heatmap`, `CalendarHeatmap`, `Sankey`, `Funnel`, `Candlestick`, `Treemap`, `ScatterChart` — the low-level `Chart`
  (any ECharts option on the same frame), `ChartsProvider` and `useSlidingWindow`; and `./native` (LineChart,
  AreaChart, BarChart, PieChart, DonutChart, Gauge, Sparkline on react-native-svg, the web's props).
- Words are props (`title`, `labels`, column headers); figures and dates go through `@krizaka/intl` with an explicit
  `locale`. Never a product word, a `t()`, a network call.

## 2. Two engines, one API

| Engine | Charts | Why |
| :-- | :-- | :-- |
| **SVG of our own** (`src/core` geometry, `src/cartesian`, d3-geo for the maps) | line, area, bar, pie/donut, gauge, sparkline, geo map, globe — and every native chart | 8–13 kB gzip a chart instead of ~170–190 kB; drawn with CSS variables (a theme switch repaints with no JS); the same geometry on the web and React Native. |
| **Apache ECharts 6** (`echarts/core`, tree-shaken, Apache-2.0) | radar, heatmap, calendar, sankey, funnel, candlestick, treemap, scatter, `Chart` | Layouts not worth re-implementing (sankey, treemap, calendar, zoom). Loaded with a dynamic import **when the chart nears the screen**: `echarts/core` + one chart type + one renderer (SVG by default, `renderer="canvas"` for large volumes). |

- **No echarts-gl.** The globe is an orthographic projection in SVG (d3-geo): echarts-gl weighs ~300 kB gzip on top
  of ECharts, needs WebGL, and its deep extensionless imports do not resolve under ECharts 6's `exports`.
- An engine module registers its parts in an exported `install()`, never as a side effect of its import (the package
  is `sideEffects: false`: a bundler drops a module imported for its side effects only).
- The world (`src/geo/world-110m.json`, Natural Earth 1:110m via world-atlas, keyed by ISO alpha-2) is a lazy chunk;
  regenerate it with `pnpm --filter @krizaka/charts world`.

## 3. Rules

- **Every chart goes through the frame** (`src/web/frame.tsx`; `src/echarts/host.tsx` for ECharts;
  `src/native/frame.tsx`): a title (the accessible name), a summary written from the data (`src/core/describe.ts`),
  the data table (always in the page, visually hidden until "Show data"), one tab stop with the arrow keys walking the
  points and a polite live region, the loading / empty / error states at the chart's height, the export (PNG, SVG,
  CSV). A chart that skips the frame is not done.
- **SSR without layout shift**: the server renders the frame, the summary and the table, and a placeholder of the exact
  height; the browser draws once it knows the width (`useWidth`). A `Sparkline` with a `width` draws on the server.
- **Colours: tokens and the palette only.** Components read `var(--kz-*)` and `var(--kzc-<slot>)`; the palette
  (`src/core/palette.ts`) is eight hues stepped per theme, ordered per brand (slot 1 = the brand's hue), written as
  `light-dark()` in the embedded stylesheet (`src/web/styles.tsx`, React 19 hoisting) so it follows `color-scheme`.
  ECharts gets resolved colours (`src/echarts/theme.ts`) and re-reads them on a theme change. Changing a palette
  value or order requires `src/core/core.test.ts` (CVD checks) to stay green.
- **Motion**: one entrance, when the chart comes on screen, inside `@media (prefers-reduced-motion: no-preference)`;
  none for `live` data; loops (the globe) run only on screen, page visible, no reduced motion.
- **Native**: `StyleSheet` and the token roles, react-native-svg only; `dist/native.js` has no `"use client"` and no DOM
  (`scripts/dist-check.mjs`).

## 4. The code drives the documentation

Each documented component has `src/meta/<name>.ts` (typed by `src/meta/types.ts`, the shape of @krizaka/ui's) and
named examples in `registry/examples/<name>/` (≤ 40 lines, realistic data, `native/` for React Native), each rendered
by a story (`src/stories/<Name>.stories.tsx`, `src/native/stories/<Name>.stories.tsx`). `scripts/build-registry.mjs`
writes `registry/<name>.json` + `registry/index.json` (`package: "@krizaka/charts"`); `scripts/registry.test.mjs`
fails on a missing meta, example, story, native screenshot or prop description. krizaka.com/docs/ui renders it.

## 5. Quality gates

- `pnpm turbo run check --filter=@krizaka/charts`: ESLint + `tsc`, Vitest (happy-dom: SSR, axe, keyboard, formats,
  palettes, registry) and Jest (React Native), build, size, publint + attw (`esm-only`) + `scripts/consumer.mjs` +
  `scripts/dist-check.mjs` (the SVG charts never reach ECharts).
- **Size budgets** (`size-limit`, gzip, peers excluded): each SVG entry ≤ 13.5 kB; each ECharts entry ≤ 15 kB before
  its engine and ≤ 212 kB with it; geo and globe ≤ 58 kB with the world; `./chart` ≤ 392 kB (all of ECharts unless
  `modules` says less).
- Stories are audited by axe and screenshot-compared in dark and light (`apps/storybook`).

## 6. Release

A changeset for every change to what ships. `@krizaka/charts` versions on its own (not in the `fixed` group).
