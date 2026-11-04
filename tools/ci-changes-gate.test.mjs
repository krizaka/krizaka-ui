// The `changes` gate of ci.yml skips the heavy jobs for a docs-only pull request. The usage inventory (docs/inventory/) is data the
// CI reads (`pnpm inventory:check`, `size`): a change to it is not docs-only, or the weekly refresh PR merges without being checked
// (krizaka-internal#2285).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const ignore = new RegExp(/^\s+ignore: '(.+)'/m.exec(ci)?.[1] ?? "$^");

describe("ci.yml changes gate", () => {
  it("still skips a prose-only change", () => {
    assert.ok(ignore.test("docs/adr/ADR-001.md"));
    assert.ok(ignore.test("README.md"));
    assert.ok(ignore.test(".changeset/brave-owls.md"));
  });

  it("runs the checks when the usage inventory changes", () => {
    assert.equal(ignore.test("docs/inventory/ui-usage.json"), false);
    assert.equal(ignore.test("docs/inventory/ui-usage.md"), false);
  });
});
