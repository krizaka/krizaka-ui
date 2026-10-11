// The registry is complete and documented — by the code: every chart has its meta (summary, when to use and not,
// best practices, accessibility, platforms, status, related), its named examples (short, importing as a product
// does, with realistic data), and every prop of its web and native components has a JSDoc description. A chart
// without its documentation fails here, before it can reach krizaka.com/docs/ui.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { collectRegistry, componentNames, entryFileOf, exampleFileOf, metaFileOf, NATIVE_ENTRY, nativeScreenshotsOf, PKG, readMeta } from "./registry.mjs";

const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
const registry = await collectRegistry();
const all = componentNames();
const metas = Object.fromEntries(await Promise.all(all.map(async (name) => [name, await readMeta(name)])));
const stories = (dir) => readdirSync(join(PKG, dir)).filter((f) => f.endsWith(".stories.tsx")).map((f) => readFileSync(join(PKG, dir, f), "utf8")).join("\n");
const sentence = (value) => typeof value === "string" && value.trim().length >= 8;

describe("registry", () => {
  it("documents every chart of the package", () => {
    expect(all).toEqual(
      expect.arrayContaining(["line-chart", "area-chart", "bar-chart", "pie-chart", "gauge", "sparkline", "geo-map", "globe", "radar-chart", "heatmap", "calendar-heatmap", "sankey", "funnel", "candlestick", "treemap", "scatter-chart", "chart", "charts-provider"]),
    );
    expect(registry.map((item) => item.name)).toEqual(all);
  });

  it.each(all)("%s: every prop it declares has a description", (name) => {
    const item = registry.find((i) => i.name === name);
    const sides = [...(item.web?.props ?? []), ...(item.native?.props ?? [])];
    const undocumented = sides.flatMap((c) => c.props.filter((p) => !p.description.trim()).map((p) => `${c.component}.${p.name}`));
    expect(undocumented, "add a JSDoc comment on these props").toEqual([]);
  });

  it("documents the props of the charts, frame props included", () => {
    const line = registry.find((i) => i.name === "line-chart").web.props.find((c) => c.component === "LineChart");
    const names = line.props.map((p) => p.name);
    expect(names).toEqual(expect.arrayContaining(["data", "title", "x", "series", "format", "thresholds", "loading", "exportable", "locale", "brand"]));
    expect(line.props.find((p) => p.name === "title")).toMatchObject({ required: true });
  });
});

describe("documentation carried by the code (src/meta)", () => {
  it.each(all)("%s has a complete meta", (name) => {
    const meta = metas[name];
    expect(meta, `${relative(PKG, metaFileOf(name))} exports \`meta\``).toBeTruthy();
    expect(sentence(meta.summary), "summary").toBe(true);
    expect(["stable", "beta"]).toContain(meta.status);
    expect(meta.category).toBe("charts");
    expect(meta.platforms).toBe(meta.web && meta.native ? "both" : meta.native ? "native" : "web");
    for (const list of [meta.whenToUse, meta.whenNotToUse, meta.bestPractices, meta.accessibility.notes, meta.related]) expect(list.length).toBeGreaterThan(0);
    for (const text of [...meta.whenToUse, ...meta.bestPractices, ...meta.accessibility.notes]) expect(sentence(text), text).toBe(true);
    for (const { when, use } of meta.whenNotToUse) {
      expect(sentence(when), when).toBe(true);
      if (use) expect(all).toContain(use);
    }
    for (const related of meta.related) expect(all.filter((n) => n !== name)).toContain(related);
    if (meta.native && meta.web) expect(meta.native.differences.length, "what differs from the web").toBeGreaterThan(0);
  });

  it.each(all.filter((name) => metas[name].web))("%s: its entry exists and exports what the page imports", async (name) => {
    const { entry, imports } = metas[name].web;
    expect(pkg.exports[`./${entry}`], `./${entry} is an entry of the package`).toBeDefined();
    const source = readFileSync(entryFileOf(entry), "utf8");
    for (const imported of imports) expect(source, `@krizaka/charts/${entry} exports ${imported}`).toMatch(new RegExp(`\\b${imported}\\b`));
  });

  it.each(all.filter((name) => metas[name].native))("%s: @krizaka/charts/native exports what the page imports", (name) => {
    const source = readFileSync(NATIVE_ENTRY, "utf8");
    for (const imported of metas[name].native.imports) expect(source).toMatch(new RegExp(`\\b${imported}\\b`));
  });
});

describe("examples (registry/examples)", () => {
  const sides = all.flatMap((name) => ["web", "native"].flatMap((platform) => (metas[name]?.[platform]?.examples ?? []).map((example) => [name, platform, example.name, example])));

  it.each(sides)("%s/%s/%s: a file of at most 40 lines, imported as a product imports", (name, platform, file, example) => {
    expect(file).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(sentence(example.description)).toBe(true);
    const path = exampleFileOf(name, platform, file);
    expect(existsSync(path), relative(PKG, path)).toBe(true);
    const source = readFileSync(path, "utf8");
    expect(source.trimEnd().split("\n").length, "at most 40 lines").toBeLessThanOrEqual(40);
    expect(source).toContain("export default function");
    const allowed = platform === "web" ? /^(@krizaka\/charts(\/[a-z-]+)?|react|echarts\/(core|charts|components))$/ : /^(@krizaka\/charts\/native|react|react-native)$/;
    for (const [, specifier] of source.matchAll(/from\s+"([^"]+)"/g)) expect(specifier).toMatch(allowed);
    for (const [, specifier] of source.matchAll(/import\("([^"]+)"\)/g)) expect(specifier).toMatch(allowed);
    expect(source, "no hard-coded colour: the tokens").not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
  });

  it.each(sides.filter(([, platform]) => platform === "native"))("%s/%s/%s: a story, and its screenshots in both themes", (name, _platform, file) => {
    expect(stories("src/native/stories")).toContain(`registry/examples/${name}/native/${file}"`);
    expect(nativeScreenshotsOf(name, file), `apps/storybook/__screenshots__/linux/charts-native-${name.replace(/-/g, "")}--${file}--{dark,light}.png`).not.toBeNull();
  });

  it.each(sides.filter(([, platform]) => platform === "web"))("%s/%s/%s: rendered by a story", (name, _platform, file) => {
    expect(stories("src/stories")).toContain(`registry/examples/${name}/${file}"`);
  });
});
