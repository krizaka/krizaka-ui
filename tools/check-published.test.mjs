import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, chmodSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const script = new URL("./check-published.sh", import.meta.url).pathname;

// A repo with one package at 1.0.0 and a fake `npm` that answers 1.0.0 only from its Nth call on.
function run(answerFromCall, budget) {
  const dir = mkdtempSync(join(tmpdir(), "cp-"));
  mkdirSync(join(dir, "packages/a"), { recursive: true });
  mkdirSync(join(dir, "bin"));
  writeFileSync(join(dir, "packages/a/package.json"), JSON.stringify({ name: "@x/a", version: "1.0.0" }));
  writeFileSync(join(dir, "count"), "0");
  writeFileSync(join(dir, "bin/npm"), `#!/bin/sh\nn=$(($(cat ${dir}/count)+1)); echo $n > ${dir}/count\n[ $n -ge ${answerFromCall} ] && echo 1.0.0\nexit 0\n`);
  chmodSync(join(dir, "bin/npm"), 0o755);
  const env = { ...process.env, PATH: `${join(dir, "bin")}:${process.env.PATH}`, PUBLISHED_WAIT_SECONDS: String(budget), PUBLISHED_FIRST_DELAY: "1" };
  const r = spawnSync("bash", [script], { cwd: dir, encoding: "utf8", env });
  return { status: r.status, out: r.stdout, calls: Number(readFileSync(join(dir, "count"), "utf8")) };
}

test("passes at once when the version is on npm", () => assert.equal(run(1, 5).status, 0));
test("waits for a lagging registry, then passes", () => {
  const r = run(3, 10);
  assert.equal(r.status, 0);
  assert.equal(r.calls, 3);
});
test("still fails when the version never appears (the guard stays strict)", () => {
  const r = run(999, 2);
  assert.equal(r.status, 1);
  assert.match(r.out, /not on npm yet/);
});
