import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// `@krizaka/ui/pausable-loop` carries only the two glyphs it draws: following its static relative imports must never
// reach the shared glyph set (`src/glyphs.tsx`, one chunk of every glyph of the package).
const SRC = resolve(import.meta.dirname, "..");
const EXTENSIONS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function resolveModule(from: string, spec: string): string | undefined {
  return EXTENSIONS.map((ext) => resolve(dirname(from), spec) + ext).find((p) => existsSync(p) && /\.tsx?$/.test(p));
}

function reach(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  const source = readFileSync(file, "utf8").replaceAll(/^\s*import type .*$/gm, "");
  for (const m of source.matchAll(/(?:import|export)[^"';]*?from\s*["'](\.[^"']*)["']/g)) {
    const next = resolveModule(file, m[1]!);
    if (next) reach(next, seen);
  }
  return seen;
}

describe("pausable-loop bundle shape", () => {
  it("never reaches the shared glyph set", () => {
    const files = [...reach(resolve(SRC, "media-gallery/loop-index.ts"))];
    expect(files.filter((f) => f === resolve(SRC, "glyphs.tsx"))).toEqual([]);
  });
});
