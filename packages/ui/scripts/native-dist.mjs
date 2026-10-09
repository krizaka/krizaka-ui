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
