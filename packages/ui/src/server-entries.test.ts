import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import config from "../tsup.config";

// A function exported from an entry WITHOUT a "use client" banner can be called in a Server Component; a function
// reached through a client entry cannot ("Attempted to call defaultAvatarUrl() from the server" — a 500 on a product site).
// So: every server entry (no banner) must not reach, through its relative imports, a file that says "use client",
// and the pure helpers that products call on the server have a server entry of their own.
const root = join(__dirname, "..");
const groups = (Array.isArray(config) ? config : [config]) as Array<{ entry?: Record<string, string>; banner?: unknown }>;
const serverEntries = groups.filter((g) => !g.banner && g.entry).flatMap((g) => Object.entries(g.entry!));

const resolveRel = (from: string, spec: string): string | null => {
  const base = resolve(dirname(from), spec);
  for (const c of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) if (existsSync(c) && /\.tsx?$/.test(c)) return c;
  return null;
};
const reach = (file: string, seen = new Set<string>()): Set<string> => {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/(?:from|import)\s*["'](\.[^"']*)["']/g)) {
    const r = resolveRel(file, m[1]!);
    if (r) reach(r, seen);
  }
  return seen;
};

describe("server entries", () => {
  it("never reach a 'use client' module", () => {
    for (const [name, path] of serverEntries) {
      for (const f of reach(join(root, path))) expect(readFileSync(f, "utf8").slice(0, 200), `${name} → ${f}`).not.toMatch(/^\s*["']use client["']/);
    }
  });

  it("expose the default avatar helpers on a server-safe entry, @krizaka/ui/avatar/defaults", async () => {
    expect(serverEntries.map(([n]) => n)).toContain("avatar/defaults");
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(pkg.exports["./avatar/defaults"]).toBeTruthy();
    const mod = await import("./avatar/defaults");
    expect(mod.defaultAvatarUrl({ brand: "yomizaka", seed: "Eric" })).toMatch(/^https:\/\//);
    expect(typeof mod.defaultAvatarSvg).toBe("function");
  });
});
