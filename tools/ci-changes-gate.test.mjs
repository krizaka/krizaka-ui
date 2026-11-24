// The `changes` gate of ci.yml skips the heavy jobs for a docs-only pull request. The usage inventory (docs/inventory/) is data the
// CI reads (`pnpm inventory:check`, `size`): a change to it is not docs-only, or the weekly refresh PR merges without being checked
// (krizaka-internal#2285).
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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

// krizaka-internal#4840: a merge-queue entry whose tree a green pull-request run already tested skips check; the queue still owes
// « SonarCloud Code Analysis », which the sonar job posts with that run's coverage (the light scan has none: the full gate would fail).
const gateScript = /\n {2}gate:\n[\s\S]*?\n {8}run: \|\n((?: {10}.*\n)+)/.exec(ci)?.[1].replace(/^ {10}/gm, "") ?? "";
const gate = (env) => spawnSync("bash", ["-c", gateScript], { env: { PATH: process.env.PATH, ...env }, encoding: "utf8" }).status;
const job = (name) => new RegExp(String.raw`\n {2}${name}:\n([\s\S]*?)\n {2}\S`).exec(ci)?.[1] ?? "";

describe("ci.yml on a merge-queue entry proven by a pull-request run", () => {
  const proven = { CODE: "false", PROVEN: "4242", CHECK: "skipped", SONAR_LIGHT: "skipped" };

  it("the CI gate is green only when the sonar job analysed it", () => {
    assert.equal(gate({ ...proven, SONAR: "success" }), 0);
    assert.notEqual(gate({ ...proven, SONAR: "skipped" }), 0);
    assert.notEqual(gate({ ...proven, SONAR: "failure" }), 0);
  });

  it("a docs-only change still owes the light scan, and a code change check and sonar", () => {
    const docs = { CODE: "false", PROVEN: "", CHECK: "skipped", SONAR: "skipped" };
    assert.equal(gate({ ...docs, SONAR_LIGHT: "success" }), 0);
    assert.notEqual(gate({ ...docs, SONAR_LIGHT: "skipped" }), 0);
    assert.equal(gate({ CODE: "true", PROVEN: "", CHECK: "success", SONAR: "success", SONAR_LIGHT: "skipped" }), 0);
    assert.notEqual(gate({ CODE: "true", PROVEN: "", CHECK: "skipped", SONAR: "skipped", SONAR_LIGHT: "skipped" }), 0);
  });

  it("the sonar job takes the proven entry with that run's coverage; the light scan leaves it", () => {
    assert.match(job("sonar"), /\|\| \(!cancelled\(\) && needs\.changes\.outputs\.proven-run != ''\)/);
    assert.match(job("sonar"), /run-id: \$\{\{ needs\.changes\.outputs\.proven-run \}\}/);
    assert.match(job("sonar"), /actions: read/);
    assert.match(job("sonar-light"), /needs\.changes\.outputs\.proven-run == ''/);
  });
});
