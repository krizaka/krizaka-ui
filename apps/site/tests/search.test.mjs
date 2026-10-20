// What ⌘K finds (lib/search-extra.ts, lib/search-index.ts): a component page is found by the words a developer types —
// its synonyms (« modal » → Dialog), its props, its examples, what it is for — and the tokens page by every --kz-* name.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { ALIASES, componentSearchContents, tokenSearchContents } from "../lib/search-extra.ts";

const registry = (name) => JSON.parse(readFileSync(new URL(`../node_modules/@krizaka/ui/registry/${name}.json`, import.meta.url), "utf8"));
const index = JSON.parse(readFileSync(new URL("../node_modules/@krizaka/ui/registry/index.json", import.meta.url), "utf8"));

test("every synonym points at a component of the registry, and the common ones are there", () => {
  const names = new Set(index.items.map((item) => item.name));
  for (const name of Object.keys(ALIASES)) assert.ok(names.has(name), `ALIASES.${name} is not a component`);
  assert.ok(ALIASES.dialog.includes("modal"));
  assert.ok(ALIASES.switch.includes("toggle"));
  assert.ok(ALIASES.toast.includes("snackbar"));
  assert.ok(ALIASES.combobox.includes("autocomplete"));
});

test("a component page is searchable by its synonyms, what it is for, its props and its examples", () => {
  const text = componentSearchContents(registry("dialog")).map((c) => c.content).join("\n");
  assert.match(text, /modal/);
  assert.match(text, /A window over the page/);
  assert.match(text, /For a short task/);
  assert.match(text, /\bplacement\b/);
  assert.match(text, /Bottom sheet/);
  assert.match(text, /AlertDialog/);
});

test("the tokens page is searchable by every --kz-* name", async () => {
  const { tokens } = await import("@krizaka/tokens");
  const text = tokenSearchContents(tokens).map((c) => c.content).join("\n");
  for (const value of Object.values(tokens).slice(0, 50)) {
    const name = String(value).match(/--kz-[\w-]+/)?.[0];
    if (name) assert.ok(text.includes(name), name);
  }
  assert.match(text, /--kz-accent-text/);
});
