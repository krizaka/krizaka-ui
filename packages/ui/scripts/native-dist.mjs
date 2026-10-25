// dist/native.js is for React Native: no "use client" directive, no react-dom, no DOM. It may import only React,
// react-native, react-native-svg and @krizaka/pacer/react (the tokens are inlined), and its declarations only React and react-native.
// Run by `pnpm --filter @krizaka/ui publint` after the build.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const js = readFileSync(resolve(dist, "native.js"), "utf8");
const dts = readFileSync(resolve(dist, "native.d.ts"), "utf8");

const specifiers = (source) => [...source.matchAll(/(?:^|\n)\s*(?:import|export)[^"';]*?from\s*["']([^"']+)["']/g)].map((m) => m[1]);
// @krizaka/pacer/react: the cadence (debounce) shared with the web, a dependency of this package like @krizaka/intl.
const ALLOWED = new Set(["react", "react/jsx-runtime", "react-native", "react-native-svg", "@krizaka/pacer/react"]);

assert.ok(!/["']use client["']/.test(js), "dist/native.js carries a \"use client\" directive");
for (const spec of specifiers(js)) assert.ok(ALLOWED.has(spec), `dist/native.js imports ${spec}`);
for (const spec of specifiers(dts)) assert.ok(ALLOWED.has(spec), `dist/native.d.ts imports ${spec}`);
assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(js.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")), "dist/native.js touches the DOM");
assert.ok(specifiers(js).includes("react-native"), "dist/native.js does not import react-native");
console.log(`✓ dist/native.js: no "use client", no DOM; imports ${[...new Set(specifiers(js))].join(", ")}`);

// The native entries that need a module of their own: the platform through @krizaka/ui/native (one theme context), their
// own modules (optional peers), nothing else — and no DOM either.
/** A shared chunk emitted next to the entries (`../chunk-ABC123.js`, relative to dist/native/). */
const isChunk = (spec) => /^\.\.\/chunk-[\w-]+\.js$/.test(spec);
for (const [entry, ...modules] of [
  ["video-player", "expo-video"],
  ["vertical-video", "@krizaka/ui/native/video-player", "@krizaka/intl"],
  ["media-capture", "expo-camera"],
  ["media-picker", "expo-image-picker"],
  // The list: FlashList v2 and the app's @krizaka/query (one QueryClient context) — never @tanstack/* directly.
  ["list", "@shopify/flash-list", "@krizaka/query"],
  // The form: TanStack Form behind the facade (a dependency of the package, as on the web) and @krizaka/intl (money).
  ["form", "@tanstack/react-form", "@krizaka/intl"],
  // Markdown: TanStack Markdown's parser and Highlight's grammars (dependencies of the package, as on the web) on the platform.
  ["markdown", "@tanstack/markdown/parser", "@tanstack/markdown/extensions/streaming", "@tanstack/highlight/"],
]) {
  const code = readFileSync(resolve(dist, "native", `${entry}.js`), "utf8");
  const allowed = new Set([...ALLOWED, "@krizaka/ui/native", ...modules]);
  assert.ok(!/["']use client["']/.test(code), `dist/native/${entry}.js carries a "use client" directive`);
  // A module ending in "/" is a family of subpaths (the grammars of @tanstack/highlight, one import each).
  const permitted = (spec) => allowed.has(spec) || isChunk(spec) || modules.some((m) => m.endsWith("/") && spec.startsWith(m));
  for (const spec of specifiers(code)) assert.ok(permitted(spec), `dist/native/${entry}.js imports ${spec}`);
  // A shared chunk of the build (the development warning of a deprecated entry, src/deprecated.ts) obeys the same rules.
  for (const spec of specifiers(code).filter(isChunk)) {
    const chunk = readFileSync(resolve(dist, "native", spec), "utf8");
    assert.ok(!/["']use client["']/.test(chunk), `dist/${spec.slice(3)} carries a "use client" directive`);
    for (const inner of specifiers(chunk)) assert.ok(permitted(inner), `dist/${spec.slice(3)} imports ${inner}`);
    assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(chunk.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")), `dist/${spec.slice(3)} touches the DOM`);
  }
  assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")), `dist/native/${entry}.js touches the DOM`);
  console.log(`✓ dist/native/${entry}.js: imports ${[...new Set(specifiers(code))].join(", ")}`);
}
