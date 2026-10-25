// The router's context is one module for the whole package: tsup.config.ts turns every `../router` import outside
// src/router into the package's own `@krizaka/ui/router` entry (external), so a block of any build group reads the
// adapter an app gives `RouteStateProvider`. A deeper import (`../router/route-state`) would slip past that and bundle a
// second context: this guard refuses it.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const src = join(import.meta.dirname, "..");
const files = (readdirSync(src, { recursive: true }) as string[]).filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.|\.stories\./.test(f));

describe("one router context", () => {
  it("imports the router only through `../router` outside src/router", () => {
    const deep = files
      .filter((f) => !f.startsWith(`router`))
      .filter((f) => /from "(\.\.\/)+router\/[^"]+"/.test(readFileSync(join(src, f), "utf8")))
      .map((f) => relative(src, join(src, f)));
    expect(deep).toEqual([]);
  });

  it("is what tsup externalises", () => {
    const config = readFileSync(join(src, "..", "tsup.config.ts"), "utf8");
    expect(config).toContain('{ path: "@krizaka/ui/router", external: true }');
    expect(config).toContain("esbuildPlugins: [oneRouter]");
  });
});
