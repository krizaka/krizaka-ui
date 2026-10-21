// The pod's job queue stops its own pod when the queue empties, and on any failure (never an idle GPU billing).
// Dry run: DRY_RUN=1 prints each step and the stop instead of running them.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const queue = new URL("./queue.sh", import.meta.url).pathname;
const here = new URL(".", import.meta.url).pathname;
// The v1/v2 tests run without a push destination (NO_PUSH=1); the v3 tests below give one.
const run = (env) =>
  spawnSync("bash", [queue, "/w/jobs.json", "/w/kfinal", "/w/takes", "/w/up4k"], {
    env: { PATH: process.env.PATH, DRY_RUN: "1", RUNPOD_POD_ID: "pod123", NO_PUSH: env.PUSH_PREFIX === undefined ? "1" : "", ...env },
    encoding: "utf8",
  });
const STORE = ["MEDIA", "STORAGE"].join("_");
const storage = (key, zone) => ({ [`${STORE}_API_KEY`]: key, [`${STORE}_ZONE`]: zone });

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

// v3 (ADR-080 v3): every output leaves the pod for Bunny (pr-assets) BEFORE the pod stops — after each stage, and once
// more in the trap, on success and on failure. A queue that could not push refuses to start.
const runPush = (env) => run({ PUSH_PREFIX: "pr-assets/orazaka/cinema-v3/krizaka", ...storage("k", "z"), ...env });

test("each stage's outputs are pushed, and everything is pushed again before the stop", () => {
  const r = runPush({});
  assert.equal(r.status, 0, r.stderr);
  const lines = r.stdout.trim().split("\n");
  const at = (re) => lines.findIndex((l) => re.test(l));
  const lastAt = (re) => lines.length - 1 - [...lines].reverse().findIndex((l) => re.test(l));
  assert.ok(at(/push\.sh \/w\/takes pr-assets\/orazaka\/cinema-v3\/krizaka\/takes/) > at(/run_jobs\.py .*ltx-video/), "takes pushed after LTX");
  assert.ok(lastAt(/push\.sh \/w\/up4k .*\/up4k/) > at(/upscale\.py/), "4K pushed after the upscale");
  assert.ok(lastAt(/push\.sh/) < lines.length - 1, "the push comes before the stop");
  assert.match(lines.at(-1), /^STOP pod123$/);
});

test("the jobs run in WORKDIR, entered after the setup made it", () => {
  const lines = run({ PRE: "bash setup.sh", WORKDIR: "/w/worker" }).stdout.split("\n");
  assert.ok(lines.indexOf("cd /w/worker") > lines.findIndex((l) => /setup\.sh/.test(l)));
  assert.ok(lines.indexOf("cd /w/worker") < lines.findIndex((l) => /run_jobs/.test(l)));
});

test("a pusher sends each take as it lands, so a pod stopped from outside (the guard) loses nothing", () => {
  const lines = runPush({}).stdout.trim().split("\n");
  const pusher = lines.findIndex((l) => /^PUSHER every \d+ s$/.test(l));
  assert.ok(pusher >= 0 && pusher < lines.findIndex((l) => /run_jobs/.test(l)), "started before the first job");
  assert.doesNotMatch(run({}).stdout, /PUSHER/, "no pusher without a destination");
});

test("a failing stage still pushes what was made, then stops", () => {
  const r = runPush({ DRY_RUN_FAIL: "wan2.2" });
  assert.notEqual(r.status, 0);
  const lines = r.stdout.trim().split("\n");
  assert.match(lines.at(-1), /^STOP pod123$/);
  assert.ok(lines.slice(-3).some((l) => /push\.sh \/w\/takes/.test(l)), "the takes made before the failure are pushed");
  assert.ok(lines.slice(-3).some((l) => /push\.sh \/w\/up4k/.test(l)), "and whatever 4K exists");
});

test("without a push destination or its storage key, the queue refuses to start (unless NO_PUSH=1)", () => {
  const r = run({ PUSH_PREFIX: "" });
  assert.notEqual(r.status, 0);
  assert.doesNotMatch(r.stdout, /run_jobs/);
  assert.equal(run({ NO_PUSH: "1" }).status, 0);
  const noKey = runPush(storage("", "z"));
  assert.notEqual(noKey.status, 0);
  assert.doesNotMatch(noKey.stdout, /run_jobs/);
});

test("push.sh uploads each file, never prints the key", () => {
  const push = new URL("./push.sh", import.meta.url).pathname;
  const r = spawnSync("bash", [push, here, "pr-assets/x"], {
    env: { PATH: process.env.PATH, DRY_RUN: "1", ...storage("not-printed-123", "zone") },
    encoding: "utf8",
  });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /PUT https:\/\/storage\.bunnycdn\.com\/zone\/pr-assets\/x\/queue\.sh/);
  assert.doesNotMatch(r.stdout + r.stderr, /not-printed-123/);
});
