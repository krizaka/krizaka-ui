import { defineConfig, type Options } from "tsup";

/**
 * ESM + types, one entry per chart family, in three builds:
 * - web: a "use client" banner on every file (every chart measures, observes and listens). Code splitting keeps one
 *   copy of the shared frame, and makes the lazy parts their own chunks: the ECharts engines (`echarts/core` + one
 *   chart type + one renderer, imported only when a chart nears the screen) and the world's countries (GeoMap,
 *   Globe3D). `echarts`, `d3-geo`, `topojson-client` and `@krizaka/intl` stay dependencies (one copy per app);
 * - native: React Native (react-native-svg), no directive, no DOM; @krizaka/tokens/native inlined (its values);
 * - examples: the registry's named examples (`registry/examples/<name>/<example>.tsx`, `…/native/…`), importing the
 *   charts through the package's own entries (external): one copy of each chart.
 * `dist/` is emptied by the build script, not by tsup: the builds run side by side.
 */
const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
} satisfies Options;

export default defineConfig([
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      provider: "src/provider/index.ts",
      line: "src/line/index.ts",
      bar: "src/bar/index.ts",
      pie: "src/pie/index.ts",
      gauge: "src/gauge/index.ts",
      sparkline: "src/sparkline/index.ts",
      geo: "src/geo/index.ts",
      globe: "src/globe/index.ts",
      radar: "src/radar/index.ts",
      heatmap: "src/heatmap/index.ts",
      sankey: "src/sankey/index.ts",
      funnel: "src/funnel/index.ts",
      candlestick: "src/candlestick/index.ts",
      treemap: "src/treemap/index.ts",
      scatter: "src/scatter/index.ts",
      chart: "src/chart/index.ts",
    },
    splitting: true,
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    entry: { native: "src/native/index.ts" },
    external: [...shared.external, "react-native", "react-native-svg", "@krizaka/intl"],
    noExternal: ["@krizaka/tokens"],
  },
  {
    ...shared,
    entry: ["registry/examples/**/*.tsx"],
    outDir: "registry/examples",
    sourcemap: false,
    // Every example has the same signature (a component): build-registry.mjs writes their `.d.ts`.
    dts: false,
    external: [...shared.external, /^@krizaka\/charts(\/|$)/, "react-native", "react-native-svg"],
    banner: { js: '"use client";' },
  },
]);
