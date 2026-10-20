import assert from "node:assert/strict";
import { test } from "node:test";

import { branchFor, CONSUMERS, syncScriptOf } from "./brand-propagate.mjs";

test("finds each repository's own sync script, the first that exists", () => {
  assert.equal(syncScriptOf((p) => p === "scripts/sync-brand-icons.mjs"), "scripts/sync-brand-icons.mjs");
  assert.equal(syncScriptOf((p) => p === "site/scripts/sync-brand-icons.mjs"), "site/scripts/sync-brand-icons.mjs");
  assert.equal(syncScriptOf(() => false), null);
});

test("one branch per day, so a second run updates the same pull request", () => {
  assert.equal(branchFor(new Date("2026-10-20T23:59:00Z")), "chore/brand-icons-2026-10-20");
});

test("lists the sites that carry a brand-icons guard", () => {
  for (const repo of ["krizaka-com", "orochia", "yororis", "krizaka-blog"]) assert.ok(CONSUMERS.includes(repo));
});
