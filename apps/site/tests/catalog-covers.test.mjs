// The catalogue never previews an example that calls a third party (krizaka-internal#2285): Captcha's form loads Cloudflare
// Turnstile, which kept /components from settling once the abuse family wore it as its cover.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { FAMILY_COVERS, previewExample, THIRD_PARTY_EXAMPLES } from "../lib/catalog-covers.ts";

const root = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));
const index = read("node_modules/@krizaka/ui/registry/index.json");
const items = new Map(index.items.map((entry) => [entry.name, read(`node_modules/@krizaka/ui/registry/${entry.name}.json`)]));
const keyOf = (example) => example.module.replace("@krizaka/ui/registry/examples/", "");

test("every third-party example is still in the registry", () => {
  for (const key of THIRD_PARTY_EXAMPLES) {
    const [name] = key.split("/");
    assert.ok(items.get(name)?.web?.examples.some((e) => keyOf(e) === key), `${key} is not in the registry`);
  }
});

test("no family wears a third-party example as its cover", () => {
  for (const [family, { component, example }] of Object.entries(FAMILY_COVERS)) {
    const item = items.get(component);
    if (!item) continue; // a cover of @krizaka/charts: none calls a third party
    const chosen = example ? item.web.examples.find((e) => e.name === example) : previewExample(item.web.examples, keyOf);
    assert.ok(chosen, `${family}: ${component}/${example ?? "first"} is not in the registry`);
    assert.ok(!THIRD_PARTY_EXAMPLES.has(keyOf(chosen)), `${family}: ${keyOf(chosen)} calls a third party`);
  }
});

test("the abuse family has a cover, and Captcha's card shows its disclosure, not the widget", () => {
  assert.equal(FAMILY_COVERS.abuse?.component, "captcha");
  assert.equal(keyOf(previewExample(items.get("captcha").web.examples, keyOf)), "captcha/disclosure");
});
