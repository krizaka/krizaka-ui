// What the build promises, checked on dist/ (run by `publint` after the build):
// - the SVG charts never reach ECharts (nor echarts-gl, which the package does not use at all): following every static
//   and dynamic import of their entry, no `echarts` or `zrender` specifier;
// - the ECharts charts reach it only through a dynamic import (the engine loads when the chart nears the screen);
// - dist/native.js is for React Native: no "use client", no DOM, only React, react-native, react-native-svg and
//   @krizaka/intl (the tokens are inlined).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const strip = (source) => source.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
const imports = (source) => ({
  static: [...strip(source).matchAll(/(?:^|\n|;)\s*(?:import|export)[^"';]*?from\s*["']([^"']+)["']|(?:^|\n|;)\s*import\s*["']([^"']+)["']/g)].map((m) => m[1] ?? m[2]),
  dynamic: [...strip(source).matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]),
});

/** Every bare specifier reachable from a file, through static imports only or through dynamic ones too. */
function reach(file, { dynamic }, seen = new Set(), out = new Set()) {
  if (seen.has(file)) return out;
  seen.add(file);
  const found = imports(readFileSync(file, "utf8"));
  for (const spec of [...found.static, ...(dynamic ? found.dynamic : [])]) {
    if (spec.startsWith(".")) {
      const next = resolve(dirname(file), spec);
      if (existsSync(next) && next.endsWith(".js")) reach(next, { dynamic }, seen, out);
    } else out.add(spec);
  }
  return out;
}

const touchesEcharts = (specs) => [...specs].filter((s) => /^(echarts|zrender|echarts-gl)(\/|$)/.test(s));

for (const entry of ["line", "bar", "pie", "gauge", "sparkline", "geo", "globe", "provider", "native"]) {
  assert.deepEqual(touchesEcharts(reach(resolve(dist, `${entry}.js`), { dynamic: true })), [], `@krizaka/charts/${entry} reaches ECharts`);
}
for (const entry of ["radar", "heatmap", "sankey", "funnel", "candlestick", "treemap", "scatter", "chart"]) {
  const file = resolve(dist, `${entry}.js`);
  assert.deepEqual(touchesEcharts(reach(file, { dynamic: false })), [], `@krizaka/charts/${entry} imports ECharts eagerly`);
  assert.ok(touchesEcharts(reach(file, { dynamic: true })).length > 0, `@krizaka/charts/${entry} never loads ECharts`);
}
assert.ok(!reach(resolve(dist, "line.js"), { dynamic: true }).has("d3-geo"), "@krizaka/charts/line reaches d3-geo");
console.log("✓ the SVG charts never reach ECharts; the ECharts charts load it lazily; no echarts-gl anywhere");

const js = readFileSync(resolve(dist, "native.js"), "utf8");
const ALLOWED = new Set(["react", "react/jsx-runtime", "react-native", "react-native-svg", "@krizaka/intl"]);
assert.ok(!/["']use client["']/.test(js), 'dist/native.js carries a "use client" directive');
for (const spec of imports(js).static) assert.ok(ALLOWED.has(spec), `dist/native.js imports ${spec}`);
assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(strip(js)), "dist/native.js touches the DOM");
console.log(`✓ dist/native.js: no "use client", no DOM; imports ${[...new Set(imports(js).static)].join(", ")}`);
