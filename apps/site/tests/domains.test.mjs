// ui.krizaka.com is navigated by the twelve functional domains (ADR-008 §3, §7): every entry has one, the lists and the
// budgets agree with the ADR, the inventory knows the entries it counts, and no page imports Fumadocs UI except behind
// app/components/docs/fumadocs/.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { domainOf,DOMAINS } from "../lib/domains.ts";
import { domainBudget, factsOf, inDomain, kb, levelRank } from "../lib/ui-domains.ts";

const root = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(path.join(root, p), "utf8"));
const registry = (pkg) => {
  const index = read(`node_modules/@krizaka/${pkg}/registry/index.json`);
  return index.items.map((entry) => read(`node_modules/@krizaka/${pkg}/registry/${entry.name}.json`));
};
const items = [...registry("ui"), ...registry("charts")];
const messages = { en: read("messages/en.json"), fr: read("messages/fr.json") };

test("there are twelve domains, and every entry belongs to one", () => {
  assert.equal(DOMAINS.length, 12);
  assert.equal(new Set(DOMAINS).size, 12);
  for (const item of items) assert.ok(DOMAINS.includes(domainOf(item)), `${item.name}: domain ${item.domain}`);
  // @krizaka/charts has no meta domain yet: it is data display.
  for (const item of registry("charts")) assert.equal(domainOf(item), "data-display", item.name);
});

test("every domain is said in both languages: title, what belongs, owner rule", () => {
  for (const lang of ["en", "fr"]) {
    assert.deepEqual(Object.keys(messages[lang].docs.ia.domains), [...DOMAINS], `${lang}: order and keys`);
    for (const id of DOMAINS) {
      const { title, when, owner } = messages[lang].docs.ia.domains[id];
      assert.ok(title?.trim() && when?.trim().length > 20 && owner?.trim().length > 10, `${lang}.${id}`);
    }
  }
});

test("a domain lists stable and beta first, experimental after, deprecated last", () => {
  for (const domain of DOMAINS) {
    const ranks = inDomain(items, domain).map((item) => levelRank(item.status));
    assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), domain);
  }
  assert.ok(levelRank("stable") < levelRank("experimental") && levelRank("experimental") < levelRank("deprecated"));
});

test("every domain has a frozen size budget, and the inventory counts the entries it knows", () => {
  for (const domain of DOMAINS) assert.ok(domainBudget(domain) > 0, `${domain}: budget`);
  const button = factsOf("button");
  assert.ok(button && button.live > 0 && button.sizeGzip > 0, "button is counted");
  assert.equal(factsOf("no-such-entry"), null);
  assert.equal(kb(1234), "1.2 kB");
});

test("no page imports fumadocs-ui except behind app/components/docs/fumadocs/", () => {
  const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const full = path.join(dir, name);
      return statSync(full).isDirectory() ? (name === "node_modules" || name === ".next" ? [] : files(full)) : /\.(tsx?|mjs)$/.test(name) ? [full] : [];
    });
  const door = path.join(root, "app/components/docs/fumadocs") + path.sep;
  for (const file of [...files(path.join(root, "app")), ...files(path.join(root, "lib"))]) {
    if (file.startsWith(door)) continue;
    assert.ok(!/from\s+["']fumadocs-ui/.test(readFileSync(file, "utf8")), `${path.relative(root, file)} imports fumadocs-ui: go through app/components/docs/fumadocs/`);
  }
});
