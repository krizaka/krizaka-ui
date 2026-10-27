import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const SRC = join(import.meta.dirname, "..");
const DIST = join(import.meta.dirname, "..", "..", "dist");

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

describe("the composer never reaches a public page (ADR-007 §5, §7)", () => {
  it("no source of the public shop entries imports the composer", () => {
    const offenders = walk(join(SRC, "shop"))
      .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f))
      .filter((f) => /(from|import\()\s*"[^"]*shop-composer/.test(readFileSync(f, "utf8")))
      .map((f) => relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("no built public entry of the shop holds the composer's code or imports its entry", () => {
    if (!existsSync(DIST)) return; // the source check above is the guard before a build; `pnpm build` then checks the output
    const entries = [join(DIST, "shop.js"), ...(existsSync(join(DIST, "shop")) ? readdirSync(join(DIST, "shop")).filter((f) => f.endsWith(".js")).map((f) => join(DIST, "shop", f)) : [])];
    for (const file of entries) {
      const code = readFileSync(file, "utf8");
      expect(code, relative(DIST, file)).not.toMatch(/@krizaka\/ui\/shop-composer|\.\/shop-composer|ShopComposer|applyCommand|HISTORY_LIMIT/);
    }
  });

  it("the page's side of the preview bridge is in `@krizaka/ui/shop`, and imports no React", () => {
    const source = readFileSync(join(SRC, "shop", "preview.ts"), "utf8");
    expect(source).not.toMatch(/from "react"|from "\.\.\/(button|dialog|radio-group)/);
  });
});
