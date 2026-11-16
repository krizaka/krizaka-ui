// The guard of the catalogue (krizaka-internal#3947): every code entry point of package.json has at least one entry,
// every entry has an example, and the recorded gaps (catalog-gaps.json) only shrink. Plus the builder on small inputs.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CATALOG_SCHEMA, catalogGaps, catalogOf, codeEntries, documentedExports, importsOf, kindOf, packageCatalog } from "./catalog.mjs";
import { collectRegistry, PKG } from "./registry.mjs";

const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
const recorded = JSON.parse(readFileSync(join(PKG, "scripts", "catalog-gaps.json"), "utf8"));

describe("the catalogue of @krizaka/ui (catalog.json)", async () => {
  const catalog = await packageCatalog(collectRegistry, pkg, join(PKG, "src"), existsSync, (file) => readFileSync(file, "utf8"));
  const gaps = catalogGaps(catalog, pkg);

  it("is a krizaka-catalog/v1 document of this version", () => {
    expect(catalog).toMatchObject({ schema: CATALOG_SCHEMA, library: "@krizaka/ui", version: pkg.version, language: "typescript" });
    for (const entry of catalog.entries) expect(Object.keys(entry)).toEqual(expect.arrayContaining(["name", "kind", "module", "import", "summary", "status", "examples"]));
  });

  it("has an entry for every code entry point of package.json, but the recorded gaps", () => {
    expect(gaps.uncovered).toEqual(recorded.uncovered);
  });

  it("has an example for every entry, but the recorded gaps", () => {
    expect(gaps.withoutExample).toEqual(recorded.withoutExample);
  });

  it("answers the usual needs with the right import", () => {
    const find = (module, name) => catalog.entries.find((entry) => entry.module === module && entry.name === name);
    expect(find("@krizaka/ui/date-picker", "DatePicker")?.import).toBe('import { DatePicker } from "@krizaka/ui/date-picker";');
    expect(find("@krizaka/ui/button/text-link", "textLinkClass")?.kind).toBe("constant");
    expect(find("@krizaka/ui/button", "Button")?.props?.length).toBeGreaterThan(0);
  });

  it("is published: in files and exports", () => {
    expect(pkg.files).toContain("catalog.json");
    expect(pkg.exports["./catalog.json"]).toBe("./catalog.json");
    expect(pkg.scripts.build).toContain("scripts/build-catalog.mjs");
  });
});

describe("the builder", () => {
  it("reads the imports of a sample, types included, never the registry's own", () => {
    const code = 'import { Button, type ButtonProps } from "@krizaka/ui/button";\nimport type { Tone } from "@krizaka/ui/badge";\nimport X from "react";\nimport { Y } from "@krizaka/ui/registry/examples/a";';
    expect(importsOf(code)).toEqual([
      ["@krizaka/ui/button", "Button", false],
      ["@krizaka/ui/button", "ButtonProps", true],
      ["@krizaka/ui/badge", "Tone", true],
    ]);
  });

  it("names the kind from the spelling", () => {
    expect([kindOf("Button", false), kindOf("useToast", false), kindOf("cn", false), kindOf("MAX_ROWS", false), kindOf("Tone", true)]).toEqual(["component", "hook", "function", "constant", "type"]);
  });

  it("documents an export from its JSDoc, and leaves one without @example without example", () => {
    const source = '/**\n * The look of a link.\n * @example\n * <a className={linkClass}>x</a>\n */\nexport const linkClass = "a";\n/** A type. */\nexport type Look = string;\n';
    const [link, look] = documentedExports("@krizaka/ui/x/link", source, []);
    expect(link).toMatchObject({ name: "linkClass", kind: "constant", summary: "The look of a link.", examples: [{ code: "<a className={linkClass}>x</a>" }] });
    expect(look).toMatchObject({ name: "Look", kind: "type", import: 'import type { Look } from "@krizaka/ui/x/link";', examples: [] });
  });

  it("lists the code entry points only", () => {
    expect(codeEntries({ exports: { ".": "x", "./button": "x", "./motion.css": "x", "./registry/*": "x", "./catalog.json": "x", "./package.json": "x" } })).toEqual(["@krizaka/ui/button"]);
  });

  it("builds one entry per imported name, with the example that uses it", () => {
    const item = {
      name: "chip",
      title: "Chip",
      summary: "A `chip`.",
      status: "stable",
      category: "actions",
      domain: "foundations",
      whenToUse: ["Filter."],
      bestPractices: [],
      whenNotToUse: [{ when: "Navigate", use: "link-card" }],
      related: [],
      web: { entry: "@krizaka/ui/chip", import: 'import { Chip, chipClass } from "@krizaka/ui/chip";', props: [{ component: "Chip", props: [{ name: "tone", type: "string", default: null, required: false }] }], examples: [{ name: "basic", title: "Basic", description: "One.", code: 'import { Chip } from "@krizaka/ui/chip";\n' }] },
    };
    const { entries } = catalogOf([item], { name: "@krizaka/ui", version: "1.0.0" });
    expect(entries.map((e) => [e.name, e.summary, e.examples.length, e.props?.length ?? 0])).toEqual([
      ["Chip", "A chip.", 1, 1],
      ["chipClass", "chipClass, part of Chip: A chip.", 1, 0],
    ]);
    expect(entries[0].rules).toEqual({ do: ["Filter."], dont: [{ when: "Navigate", use: "link-card" }] });
  });
});
