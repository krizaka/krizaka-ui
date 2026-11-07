// @vitest-environment node
// The registry is complete — by the code: every component the kit exports has its `<name>.meta.ts` (summary, why it
// exists above Krizaka UI, when to use and not, accessibility, the primitives it is built on) and its named examples,
// every prop has a JSDoc description, every reference resolves, and every theme reads at WCAG AA. A component without
// its documentation fails here, before it can reach krizaka.com/docs/sovkora/ui. Run by `npm test` (node --test).
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

import { describe, it } from "vitest";

import {
  collectFoundations,
  collectRegistry,
  componentNames,
  EXAMPLES,
  PACKAGE,
  PKG,
  readMeta,
  reexportsFromUi,
} from "./registry.mjs";

const require = createRequire(import.meta.url);
const uiIndex = JSON.parse(
  readFileSync(join(require.resolve("@krizaka/ui/package.json"), "..", "registry", "index.json"), "utf8"),
);
const uiNames = new Set(uiIndex.items.map((i) => i.name));
const registry = await collectRegistry();
const names = componentNames();
const metas = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await readMeta(n)])));
const foundations = await collectFoundations();

const sentence = (value) => typeof value === "string" && value.trim().length >= 8;
const resolves = (ref) => (ref.startsWith("ui/") ? uiNames.has(ref.slice(3)) : names.includes(ref));

/** The value exports of src/index.ts (`export { A, B } from …`, types left out). */
const exported = [
  ...readFileSync(join(PKG, "src", "index.ts"), "utf8").matchAll(/^export\s*\{([^}]+)\}\s*from/gm),
].flatMap(([, list]) =>
  list
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("type "))
    .map((s) => s.split(/\s+as\s+/).pop()),
);
/** Design tokens re-exported from @krizaka/sovkora-shared: the foundations, not components. */
const TOKENS = new Set(["radius", "shadows", "status", "themes", "tokens", "typeScale"]);
/** Class functions of a documented primitive (`badgeVariants` belongs to `Badge`). */
const HELPERS = new Set(["badgeVariants", "skeletonVariants"]);

describe("registry", () => {
  it("documents every component the kit exports (re-exports of @krizaka/ui, tokens and class helpers aside)", () => {
    const reexported = new Set(reexportsFromUi().map((r) => r.name));
    const documented = new Set(Object.values(metas).flatMap((m) => m.web.imports));
    const missing = exported.filter(
      (n) => !reexported.has(n) && !TOKENS.has(n) && !HELPERS.has(n) && !documented.has(n),
    );
    assert.deepEqual(missing, [], "add a <name>.meta.ts for these exports");
    for (const name of documented) assert.ok(exported.includes(name), `${name} is exported`);
  });

  for (const name of names) {
    it(`${name}: its meta.ts is complete and its references resolve`, () => {
      const meta = metas[name];
      assert.ok(meta.title?.trim(), "title");
      for (const field of ["summary", "why"]) assert.ok(sentence(meta[field]), field);
      assert.ok(["stable", "beta", "deprecated"].includes(meta.status));
      assert.equal(meta.platforms, "web");
      for (const list of ["whenToUse", "whenNotToUse", "bestPractices"]) assert.ok(meta[list].length > 0, list);
      assert.ok(meta.accessibility.notes.length > 0);
      if (meta.status === "deprecated") {
        assert.ok(
          meta.deprecated?.since && meta.deprecated?.removedIn,
          "a deprecated component says since when and until when",
        );
        assert.ok(resolves(meta.deprecated.use), meta.deprecated.use);
      } else {
        assert.equal(meta.deprecated, undefined);
        assert.ok(meta.web.examples.length > 0, "at least one named example");
      }
      const refs = [...meta.builtOn, ...meta.related, ...meta.whenNotToUse.flatMap((w) => (w.use ? [w.use] : []))];
      for (const ref of refs) assert.ok(resolves(ref), ref);
      for (const ref of meta.builtOn) assert.ok(ref.startsWith("ui/"), `${ref}: builtOn names @krizaka/ui primitives`);
    });

    it(`${name}: its examples are short, import the kit as an app does, and every prop has a description`, () => {
      const item = registry.find((i) => i.name === name);
      for (const example of item.web.examples) {
        assert.match(example.code, /export default function/, example.path);
        assert.ok(example.code.split("\n").length <= 41, `${example.path}: at most 40 lines`);
        assert.ok(example.code.includes(`from "${PACKAGE}`), example.path);
        assert.doesNotMatch(example.code, /from "\.\.?\//);
        assert.doesNotMatch(example.code, /\badmin\b/i, `${example.path}: a persona, never an admin`);
      }
      const undocumented = item.web.props.flatMap((c) =>
        c.props.filter((p) => !p.description.trim()).map((p) => `${c.component}.${p.name}`),
      );
      assert.deepEqual(undocumented, [], "add a JSDoc comment on these props");
    });
  }

  it("has no example that no component lists", () => {
    const listed = new Set(registry.flatMap((i) => i.web.examples.map((e) => e.path)));
    const files = readdirSync(EXAMPLES, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `examples/${f.split("\\").join("/")}`);
    assert.deepEqual(
      files.filter((f) => !listed.has(f)),
      [],
    );
    for (const path of listed) assert.ok(existsSync(join(EXAMPLES, "..", path)), path);
  });
});

describe("foundations", () => {
  it("describes every product token theme.css declares", () => {
    assert.ok(foundations.productTokens.length > 0);
    for (const token of foundations.productTokens) assert.ok(sentence(token.description), token.name);
  });

  it("reads at WCAG AA in dark, light and every named theme", () => {
    const themes = [...Object.entries(foundations.modes), ...foundations.namedThemes.map((t) => [t.id, t])];
    assert.equal(foundations.namedThemes.length, 5);
    for (const [id, theme] of themes) {
      assert.ok(theme.contrasts.length > 10, id);
      assert.deepEqual(
        theme.contrasts.filter((c) => c.ratio < c.min),
        [],
        id,
      );
    }
  });

  it("quotes every product rule from a contract", () => {
    for (const rule of foundations.rules) assert.match(rule.source.url, /(AGENTS|ui_standards)\.md$/);
  });
});
