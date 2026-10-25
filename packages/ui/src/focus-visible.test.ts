import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// #659: a ring is the keyboard's. A component draws its focus on `:focus-visible` (a pointer click never shows it);
// `:focus` alone only reveals something (the skip link). The base reset for code-focused headings lives in
// @krizaka/tailwind (its preset test).
const src = import.meta.dirname;

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "node_modules" || name === "native" ? [] : sources(path);
    return /\.(tsx|css)$/.test(name) && !/\.(stories|test)\./.test(name) ? [path] : [];
  });
}

/** The skip link appears when focused (that is its job, and it is keyboard-only by nature). */
const REVEALS_ON_FOCUS = new Set(["skip-link/skip-link.tsx"]);

describe("focus: the ring is :focus-visible only (#659)", () => {
  const files = sources(src).filter((f) => !REVEALS_ON_FOCUS.has(relative(src, f)));

  it("has no `focus:` utility that draws a ring, an outline or a shadow", () => {
    const offenders: string[] = [];
    for (const file of files.filter((f) => f.endsWith(".tsx"))) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(/(?<![-\w])focus:(ring|outline-(?!hidden|none)|shadow|border|bg-accent|focus-ring)[-\w/[\]]*/g)) {
        offenders.push(`${relative(src, file)}: ${m[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has no `:focus` rule (without -visible or -within) that draws a ring, an outline or a shadow", () => {
    const offenders: string[] = [];
    for (const file of files.filter((f) => f.endsWith(".css"))) {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      for (const m of css.matchAll(/([^{}]*:focus(?![-\w(])[^{}]*)\{([^}]*)\}/g)) {
        if (/outline\s*:\s*(?!none|0)|box-shadow|border-color/.test(m[2]!)) offenders.push(`${relative(src, file)}: ${m[1]!.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("draws every NavBar ring on :focus-visible, the brand included", () => {
    const text = readFileSync(join(src, "nav-bar", "nav-bar.tsx"), "utf8");
    const brand = /brand:\s*"[^]*?",\s*\n\s*items:/.exec(text)?.[0] ?? "";
    expect(brand).toContain("focus-visible:ring-2");
    expect(brand).not.toMatch(/(?<![-\w])focus:/);
  });
});
