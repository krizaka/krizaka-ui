// The registry is complete and documented: every primitive has its JSON item and its demo, every prop it declares has
// a JSDoc description, and every demo is short and imports the primitives the way a product does.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { collectRegistry, PKG, primitiveNames } from "./registry.mjs";

const demos = join(PKG, "registry", "demos");
const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
const registry = collectRegistry();
const names = primitiveNames();

describe("registry", () => {
  it("lists every primitive, and only them (not native, marks, motion)", () => {
    expect(registry.map((item) => item.name)).toEqual(names);
    expect(names).toEqual(expect.arrayContaining(["cn", "slot", "button", "dialog", "command", "progress"]));
    for (const excluded of ["native", "marks", "motion", "test"]) expect(names).not.toContain(excluded);
    for (const name of names) expect(pkg.exports[`./${name}`], `./${name} is an entry of the package`).toBeDefined();
  });

  it.each(names)("%s has a demo, its sources and its dependencies", (name) => {
    const item = registry.find((i) => i.name === name);
    expect(item.type).toBe("primitive");
    expect(item.description, "the entry's JSDoc says what it is").not.toBe("");
    expect(existsSync(join(demos, `${name}.tsx`)), `registry/demos/${name}.tsx`).toBe(true);
    expect(item.demo?.content).toContain("export default function");
    expect(item.files.length).toBeGreaterThan(0);
    for (const file of item.files) expect(file.content.length).toBeGreaterThan(0);
    for (const dependency of item.registryDependencies) expect(names).toContain(dependency);
    for (const dependency of item.dependencies) {
      const [, pkgName, range] = dependency.match(/^(@?[^@]+)@(.+)$/);
      expect(pkg.dependencies[pkgName]).toBe(range);
    }
  });

  it("has no demo without a primitive", () => {
    const files = readdirSync(demos).filter((f) => f.endsWith(".tsx") && !f.includes(".test."));
    expect(files.map((f) => f.replace(/\.tsx$/, "")).sort()).toEqual(names);
  });

  it.each(names)("%s: every prop it declares has a description", (name) => {
    const item = registry.find((i) => i.name === name);
    const undocumented = item.props.flatMap((c) => c.props.filter((p) => !p.description.trim()).map((p) => `${c.component}.${p.name}`));
    expect(undocumented, "add a JSDoc comment on these props").toEqual([]);
  });

  it("documents the props of the components (own props only, variants included, DOM and Radix props left out)", () => {
    const button = registry.find((i) => i.name === "button").props.find((c) => c.component === "Button");
    const props = Object.fromEntries(button.props.map((p) => [p.name, p]));
    expect(Object.keys(props).sort()).toEqual(["asChild", "loading", "shape", "size", "variant"]);
    expect(props.variant).toMatchObject({ default: "secondary", required: false });
    expect(props.variant.type).toContain('"primary"');
    const dialog = registry.find((i) => i.name === "dialog").props.find((c) => c.component === "AlertDialog");
    expect(dialog.props.find((p) => p.name === "confirmLabel")).toMatchObject({ required: true, type: "string" });
  });

  it.each(names)("%s: the demo is at most 40 lines and imports what a product imports", (name) => {
    const source = readFileSync(join(demos, `${name}.tsx`), "utf8");
    expect(source.trimEnd().split("\n").length).toBeLessThanOrEqual(40);
    for (const [, specifier] of source.matchAll(/from\s+"([^"]+)"/g)) {
      expect(specifier, "a demo imports @krizaka/ui/<entry> or react, never a relative path or Storybook").toMatch(/^(@krizaka\/ui\/[a-z-]+|react)$/);
    }
  });
});
