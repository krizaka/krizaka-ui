// dist/native.js is for React Native: no "use client" directive, no react-dom, no DOM. It may import only React,
// react-native and react-native-svg (the tokens are inlined), and its declarations only React and react-native.
// Run by `pnpm --filter @krizaka/ui publint` after the build.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const js = readFileSync(resolve(dist, "native.js"), "utf8");
const dts = readFileSync(resolve(dist, "native.d.ts"), "utf8");

const specifiers = (source) => [...source.matchAll(/(?:^|\n)\s*(?:import|export)[^"';]*?from\s*["']([^"']+)["']/g)].map((m) => m[1]);
const ALLOWED = new Set(["react", "react/jsx-runtime", "react-native", "react-native-svg"]);

assert.ok(!/["']use client["']/.test(js), "dist/native.js carries a \"use client\" directive");
for (const spec of specifiers(js)) assert.ok(ALLOWED.has(spec), `dist/native.js imports ${spec}`);
for (const spec of specifiers(dts)) assert.ok(ALLOWED.has(spec), `dist/native.d.ts imports ${spec}`);
assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(js.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")), "dist/native.js touches the DOM");
assert.ok(specifiers(js).includes("react-native"), "dist/native.js does not import react-native");
console.log(`✓ dist/native.js: no "use client", no DOM; imports ${[...new Set(specifiers(js))].join(", ")}`);

// The native entries that need a module of their own: the platform through @krizaka/ui/native (one theme context), their
// own modules (optional peers), nothing else — and no DOM either.
for (const [entry, ...modules] of [
  ["video-player", "expo-video"],
  ["media-capture", "expo-camera"],
  // The list: FlashList v2 and the app's @krizaka/query (one QueryClient context) — never @tanstack/* directly.
  ["list", "@shopify/flash-list", "@krizaka/query"],
]) {
  const code = readFileSync(resolve(dist, "native", `${entry}.js`), "utf8");
  const allowed = new Set([...ALLOWED, "@krizaka/ui/native", ...modules]);
  assert.ok(!/["']use client["']/.test(code), `dist/native/${entry}.js carries a "use client" directive`);
  for (const spec of specifiers(code)) assert.ok(allowed.has(spec), `dist/native/${entry}.js imports ${spec}`);
  assert.ok(!/\b(document|window|HTMLElement|localStorage|matchMedia)\b/.test(code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")), `dist/native/${entry}.js touches the DOM`);
  console.log(`✓ dist/native/${entry}.js: imports ${[...new Set(specifiers(code))].join(", ")}`);
}
