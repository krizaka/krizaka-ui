// The pod's job queue stops its own pod when the queue empties, and on any failure (never an idle GPU billing).
// Dry run: DRY_RUN=1 prints each step and the stop instead of running them.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const queue = new URL("./queue.sh", import.meta.url).pathname;
const run = (env) =>
  spawnSync("bash", [queue, "/w/jobs.json", "/w/kfinal", "/w/takes", "/w/up4k"], {
    env: { PATH: process.env.PATH, DRY_RUN: "1", RUNPOD_POD_ID: "pod123", ...env },
    encoding: "utf8",
  });

test("the queue runs LTX, then Wan, then every 4K upscale, then stops its pod", () => {
  const r = run({});
  assert.equal(r.status, 0, r.stderr);
  const lines = r.stdout.trim().split("\n");
  const at = (re) => lines.findIndex((l) => re.test(l));
  assert.ok(at(/run_jobs\.py .*ltx-video/) >= 0, r.stdout);
  assert.ok(at(/run_jobs\.py .*ltx-video/) < at(/run_jobs\.py .*wan2\.2/));
  assert.ok(at(/run_jobs\.py .*wan2\.2/) < at(/upscale\.py/));
  assert.match(lines.at(-1), /^STOP pod123$/, "the last step stops the pod");
});

test("a failing step still stops the pod, and the queue says it failed", () => {
  const r = run({ DRY_RUN_FAIL: "wan2.2" });
  assert.notEqual(r.status, 0);
  assert.match(r.stdout.trim().split("\n").at(-1), /^STOP pod123$/);
  assert.doesNotMatch(r.stdout, /upscale\.py/, "nothing runs after the failure");
});

test("without a pod id it refuses to start (it could not stop itself)", () => {
  const r = run({ RUNPOD_POD_ID: "" });
  assert.notEqual(r.status, 0);
  assert.doesNotMatch(r.stdout, /run_jobs/);
});

test("a setup to run first (PRE) runs under the same trap: when it fails, nothing else runs and the pod stops", () => {
  const ok = run({ PRE: "bash setup.sh" });
  assert.match(ok.stdout.split("\n")[0], /^bash -c bash setup\.sh$/);
  const bad = run({ PRE: "bash setup.sh", DRY_RUN_FAIL: "setup.sh" });
  assert.notEqual(bad.status, 0);
  assert.doesNotMatch(bad.stdout, /run_jobs/);
  assert.match(bad.stdout.trim().split("\n").at(-1), /^STOP pod123$/);
});
