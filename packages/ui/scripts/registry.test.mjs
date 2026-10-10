// The registry is complete and documented — by the code: every component has its `meta.ts` (summary, when to use and
// not, best practices, accessibility, platforms, status, related components) and its named examples, every prop it
// declares has a JSDoc description, and every example is short and imports the components the way a product does.
// A primitive without its documentation fails here, before it can reach krizaka.com/docs/ui.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { collectRegistry, componentNames, exampleFileOf, EXAMPLES, metaFileOf, nativeOnlyNames, nativeScreenshotsOf, PKG, primitiveNames, readMeta } from "./registry.mjs";

const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
const registry = await collectRegistry();
const names = primitiveNames();
const all = componentNames();
const metas = Object.fromEntries(await Promise.all(all.map(async (name) => [name, await readMeta(name)])));
const nativeIndex = readFileSync(join(PKG, "src", "native", "index.ts"), "utf8");
const nativeExports = new Set([...nativeIndex.matchAll(/\b([A-Za-z]\w*)\b/g)].map((m) => m[1]));
const PLATFORMS = ["web", "native", "both"];
const STATUSES = ["stable", "beta"];
const CATEGORIES = ["actions", "forms", "navigation", "overlays", "feedback", "data-display", "layout", "foundations"];

/** Native examples without a story (so without a screenshot): the provider wraps every story already. */
const NO_STORY = new Set(["theme/provider"]);

const sentence = (value) => typeof value === "string" && value.trim().length >= 8;

describe("registry", () => {
  it("lists every primitive and every native-only component, and only them (not marks, motion)", () => {
    expect(registry.map((item) => item.name)).toEqual(all);
    expect(names).toEqual(expect.arrayContaining(["cn", "slot", "button", "dialog", "command", "progress"]));
    expect(nativeOnlyNames()).toEqual(expect.arrayContaining(["segmented", "txt"]));
    for (const excluded of ["native", "marks", "motion", "test"]) expect(all).not.toContain(excluded);
    for (const name of names) expect(pkg.exports[`./${name}`], `./${name} is an entry of the package`).toBeDefined();
  });

  it.each(names)("%s has its sources and its dependencies", (name) => {
    const item = registry.find((i) => i.name === name);
    expect(item.type).toBe("primitive");
    expect(item.demo?.content).toContain("export default function");
    expect(item.files.length).toBeGreaterThan(0);
    for (const file of item.files) expect(file.content.length).toBeGreaterThan(0);
    for (const dependency of item.registryDependencies) expect(names).toContain(dependency);
    for (const dependency of item.dependencies) {
      const [, pkgName, range] = dependency.match(/^(@?[^@]+)@(.+)$/);
      expect(pkg.dependencies[pkgName]).toBe(range);
    }
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

  it.each(all.filter((name) => metas[name]?.native))("%s: every prop its native components declare has a description", (name) => {
    const item = registry.find((i) => i.name === name);
    const undocumented = item.native.props.flatMap((c) => c.props.filter((p) => !p.description.trim()).map((p) => `${c.component}.${p.name}`));
    expect(undocumented, "add a JSDoc comment on these props (src/native)").toEqual([]);
  });

  it("documents the props of the native components too (own props only, Pressable's left out)", () => {
    const button = registry.find((i) => i.name === "button").native.props.find((c) => c.component === "Button");
    const props = Object.fromEntries(button.props.map((p) => [p.name, p]));
    expect(props.label).toMatchObject({ required: true, type: "string" });
    expect(props.onPress, "inherited from Pressable").toBeUndefined();
  });
});

describe("documentation carried by the code (meta.ts)", () => {
  it.each(all)("%s has a complete meta.ts", (name) => {
    const meta = metas[name];
    expect(meta, `${relative(PKG, metaFileOf(name))} exports \`meta\``).toBeTruthy();
    expect(meta.title.trim().length, "title").toBeGreaterThan(1);
    expect(sentence(meta.summary), "summary").toBe(true);
    expect(STATUSES).toContain(meta.status);
    expect(CATEGORIES).toContain(meta.category);
    expect(PLATFORMS).toContain(meta.platforms);
    expect(meta.whenToUse.length, "whenToUse").toBeGreaterThan(0);
    expect(meta.whenNotToUse.length, "whenNotToUse").toBeGreaterThan(0);
    expect(meta.bestPractices.length, "bestPractices").toBeGreaterThan(0);
    expect(meta.accessibility.notes.length, "accessibility.notes").toBeGreaterThan(0);
    for (const text of [...meta.whenToUse, ...meta.bestPractices, ...meta.accessibility.notes]) expect(sentence(text), text).toBe(true);
    for (const { when, use } of meta.whenNotToUse) {
      expect(sentence(when), when).toBe(true);
      if (use) expect(all, `whenNotToUse.use "${use}"`).toContain(use);
    }
    for (const { keys, action } of meta.accessibility.keyboard) expect(keys.length > 0 && sentence(action)).toBe(true);
    expect(meta.related.length, "related").toBeGreaterThan(0);
    for (const related of meta.related) {
      expect(all, `related "${related}"`).toContain(related);
      expect(related).not.toBe(name);
    }
  });

  it.each(all)("%s: platforms match its web and native sides", (name) => {
    const meta = metas[name];
    const expected = meta.web && meta.native ? "both" : meta.native ? "native" : "web";
    expect(meta.platforms).toBe(expected);
    expect(Boolean(meta.web), "a web side ⇔ an entry of the package").toBe(names.includes(name));
    if (meta.native) {
      expect(existsSync(join(PKG, "src", "native", `${name}.tsx`)), `src/native/${name}.tsx`).toBe(true);
      for (const imported of meta.native.imports) expect(nativeExports, `${imported} is exported by @krizaka/ui/native`).toContain(imported);
      if (meta.web) expect(meta.native.differences.length, "what differs from the web API").toBeGreaterThan(0);
    }
  });

  it.each(names)("%s: the web imports are exported by its entry", async (name) => {
    const entry = await import(`../src/${name === "cn" ? "cn.ts" : `${name}/index.ts`}`);
    for (const imported of metas[name].web.imports) expect(entry, `@krizaka/ui/${name} exports ${imported}`).toHaveProperty(imported);
  });
});

describe("examples (registry/examples)", () => {
  const sides = all.flatMap((name) =>
    ["web", "native"].flatMap((platform) => (metas[name]?.[platform]?.examples ?? []).map((example) => [name, platform, example.name, example])),
  );

  it.each(all)("%s has at least one example per platform it exists on", (name) => {
    const meta = metas[name];
    if (meta.web) expect(meta.web.examples.length).toBeGreaterThan(0);
    if (meta.native) expect(meta.native.examples.length).toBeGreaterThan(0);
  });

  it.each(sides)("%s/%s/%s: a file, at most 40 lines, imported as a product imports", (name, platform, file, example) => {
    expect(file).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(example.title.trim().length, "title").toBeGreaterThan(1);
    expect(sentence(example.description), "description").toBe(true);
    const path = exampleFileOf(name, platform, file);
    expect(existsSync(path), relative(PKG, path)).toBe(true);
    const source = readFileSync(path, "utf8");
    expect(source.trimEnd().split("\n").length, "at most 40 lines").toBeLessThanOrEqual(40);
    expect(source).toContain("export default function");
    const allowed = platform === "web" ? /^(@krizaka\/ui(\/[a-z-]+)?|react)$/ : /^(@krizaka\/ui\/native|react|react-native|react-native-svg)$/;
    for (const [, specifier] of source.matchAll(/from\s+"([^"]+)"/g)) {
      expect(specifier, "an example imports what a product imports, never a relative path or Storybook").toMatch(allowed);
    }
  });

  it.each(sides.filter(([, platform]) => platform === "native"))("%s/%s/%s: a story, and its screenshots in both themes", (name, _platform, file) => {
    // A React Native example has no live preview on the web: the docs show its story's screenshots (dark and light).
    if (NO_STORY.has(`${name}/${file}`)) return;
    expect(nativeScreenshotsOf(name, file), `apps/storybook/__screenshots__/linux/native-${name.replace(/-/g, "")}--${file}--{dark,light}.png`).not.toBeNull();
  });

  it("has no example file that its meta.ts does not list", () => {
    const listed = new Set(sides.map(([name, platform, file]) => relative(EXAMPLES, exampleFileOf(name, platform, file))));
    const files = readdirSync(EXAMPLES, { recursive: true }).filter((f) => f.endsWith(".tsx"));
    expect(files.filter((f) => !listed.has(f))).toEqual([]);
  });

  it("puts the examples in the registry, with their code", () => {
    const button = registry.find((i) => i.name === "button");
    expect(button.web.import).toBe('import { Button, IconButton } from "@krizaka/ui/button";');
    expect(button.native.import).toBe('import { Button, IconButton } from "@krizaka/ui/native";');
    expect(button.web.examples[0]).toMatchObject({ name: "primary", module: "@krizaka/ui/registry/examples/button/primary" });
    expect(button.native.examples[0].path).toBe("examples/button/native/primary.tsx");
    expect(button.native.examples[0].code).toContain('from "@krizaka/ui/native"');
  });
});
