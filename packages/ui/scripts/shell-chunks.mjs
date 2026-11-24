// The shell entries (app-shell, rail-nav) sit on every route of a product: the modules they load from dist/ (the entry
// and every chunk it reaches) must never carry the play and pause glyphs, which only the media entries draw
// (krizaka-internal#4833). esbuild puts in one chunk every file reached by the same entries, so a re-export of a glyph
// from a shared module drags it next to the code the shell imports. Run by `pnpm --filter @krizaka/ui publint` after
// the build.
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");

/** The entry and every file of dist/ it imports, statically or not: esbuild names them `./<name>.js`, flat. */
function reached(entry, seen = new Set()) {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  const code = readFileSync(resolve(dist, entry), "utf8");
  for (const m of code.matchAll(/["']\.\/([\w-]+\.js)["']/g)) reached(m[1], seen);
  return seen;
}

// The source markers esbuild writes above each module, and the shapes themselves (a renamed file keeps its path data).
const GLYPHS = {
  play: ["// src/glyph/play.tsx", "M8 5.5v13a1"],
  pause: ["// src/glyph/pause.tsx", 'width: "4", height: "14", rx: "1"'],
  filled: ["// src/glyph/filled.tsx"],
};

const carries = (file, glyph) => GLYPHS[glyph].some((mark) => readFileSync(resolve(dist, file), "utf8").includes(mark));

for (const entry of ["app-shell.js", "rail-nav.js"]) {
  const files = [...reached(entry)];
  for (const glyph of Object.keys(GLYPHS)) {
    assert.deepEqual(files.filter((f) => carries(f, glyph)), [], `dist/${entry} loads the ${glyph} glyph`);
  }
  console.log(`✓ dist/${entry}: ${files.length} modules, no play or pause glyph`);
}

// The guard sees the glyphs where they belong: the loop that draws them still reaches both.
const loop = [...reached("pausable-loop.js")];
for (const glyph of Object.keys(GLYPHS)) {
  assert.ok(loop.some((f) => carries(f, glyph)), `dist/pausable-loop.js does not reach the ${glyph} glyph: the markers are stale`);
}
console.log("✓ dist/pausable-loop.js reaches both glyphs");

// The `Glyph` base keeps one importer group (the shell's glyphs): if the play and pause glyphs import it too, a bundler
// that splits by importer (Turbopack) makes it a module of its own, paid by every route (krizaka-internal#4833).
const BASE = "// src/glyph/base.tsx";
const withBase = loop.filter((f) => readFileSync(resolve(dist, f), "utf8").includes(BASE));
assert.deepEqual(withBase, [], "dist/pausable-loop.js reaches the Glyph base: the play and pause glyphs must draw their own svg");
assert.ok(
  [...reached("app-shell.js")].some((f) => readFileSync(resolve(dist, f), "utf8").includes(BASE)),
  "dist/app-shell.js does not reach the Glyph base: the marker is stale",
);
console.log("✓ dist/pausable-loop.js does not reach the Glyph base");

// The module that holds both glyphs stays small (one shared svg, no base): the raw file is ~0.9 KB today; a bigger one
// means a second copy of the svg or a new import crept in, paid by every route that loads a video (krizaka-internal#4833).
const GLYPH_MODULE_MAX_BYTES = 1000; // @fixed: today's chunk is 0.9 KB; it only goes down
const glyphModule = loop.find((f) => carries(f, "play") && carries(f, "pause"));
assert.ok(glyphModule, "no module of dist/pausable-loop.js holds both glyphs");
const bytes = statSync(resolve(dist, glyphModule)).size;
assert.ok(bytes <= GLYPH_MODULE_MAX_BYTES, `dist/${glyphModule} is ${bytes} B: the play and pause glyphs grew past ${GLYPH_MODULE_MAX_BYTES} B`);
console.log(`✓ dist/${glyphModule}: ${bytes} B for both glyphs`);
