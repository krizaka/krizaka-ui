import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("..", import.meta.url);
const json = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));

// A page's lead is the description under its title (DocsPageView renders it once). A body that says it again — « overviewLead »,
// the same opening words in another message — shows the paragraph twice, with a gap (ui.krizaka.com Templates, #716).
test("a docs body never renders a lead of its own: the page description is the lead", () => {
  const dir = new URL("app/components/docs/", root);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    assert.doesNotMatch(readFileSync(new URL(file, dir), "utf8"), /\{\s*\w+\.overviewLead\s*\}/, `${file} renders a lead`);
  }
});

test("no two page messages open with the same words (a lead said twice)", () => {
  for (const lang of ["en", "fr"]) {
    const strings = [];
    const walk = (node, path) => {
      if (typeof node === "string") strings.push([path, node]);
      else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    };
    walk(json(`messages/${lang}.json`).docs, "docs");
    const seen = new Map();
    for (const [path, text] of strings) {
      const words = text.toLowerCase().split(/\s+/);
      if (words.length < 8) continue;
      const key = words.slice(0, 7).join(" ");
      const other = seen.get(key);
      if (other) assert.fail(`${lang}: ${other} and ${path} open with « ${key} »`);
      seen.set(key, path);
    }
  }
});

test("the site reads the workspace tokens and fonts, never a pinned build", () => {
  const pkg = json("package.json");
  for (const name of ["@krizaka/tokens", "@krizaka/tailwind", "@krizaka/fonts", "@krizaka/ui"]) assert.equal(pkg.dependencies[name], "workspace:*", name);
  const css = readFileSync(new URL("app/globals.css", root), "utf8");
  assert.match(css, /@import "@krizaka\/tailwind"/);
  assert.match(css, /@import "@krizaka\/tokens\/brands\/scoped\.css"/);
  const fonts = readFileSync(new URL("app/fonts.ts", root), "utf8");
  assert.match(fonts, /@krizaka\/fonts\/files\/web\//);
  assert.doesNotMatch(fonts, /next\/font\/google/);
});
