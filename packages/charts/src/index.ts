/**
 * @krizaka/charts — the Krizaka data visualisation. Every chart has its own entry (`@krizaka/charts/line`…) so an app
 * pays for what it draws; this index re-exports them all. The SVG charts (line, area, bar, pie, donut, gauge,
 * sparkline, geo map, globe) load no chart engine; the ECharts ones (radar, heatmap, calendar, sankey, funnel,
 * candlestick, treemap, scatter, chart) load `echarts/core` and their one chart type when they near the screen.
 */
export * from "./bar";
export * from "./candlestick";
export * from "./chart";
export * from "./funnel";
export * from "./gauge";
export * from "./geo";
export * from "./globe";
export * from "./heatmap";
export * from "./line";
export * from "./pie";
export * from "./provider";
export * from "./radar";
export * from "./sankey";
export * from "./scatter";
export * from "./sparkline";
export * from "./treemap";
