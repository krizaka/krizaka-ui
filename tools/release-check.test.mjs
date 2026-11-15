import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const release = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
const turboRuns = release.split("\n").filter((line) => /\bturbo run\b/.test(line) && !line.trimStart().startsWith("#"));

// krizaka-internal#3904: one unbounded `turbo run check` of every package ran lint, typecheck, test and build of @krizaka/ui at once and
// the hosted runner was stopped (« The runner has received a shutdown signal »), so @krizaka/ui 4.9.0 never reached npm.
test("the release check runs lint and types first, then check, on the published packages", () => {
  const lint = release.indexOf("turbo run lint typecheck --filter='./packages/*'");
  const check = release.indexOf("turbo run check --filter='./packages/*'");
  assert.ok(lint > 0, "lint and typecheck have their own step, as in CI");
  assert.ok(check > lint, "check comes after them and replays them from the cache");
});

test("every turbo run of the release check is bounded to a runner's memory", () => {
  const checks = turboRuns.filter((line) => /turbo run (check|lint|typecheck|test)\b/.test(line));
  assert.ok(checks.length >= 2);
  for (const line of checks) {
    const bound = /--concurrency[= ](\d+)\b/.exec(line);
    assert.ok(bound, `unbounded: ${line.trim()}`);
    assert.ok(Number(bound[1]) <= 2, `more than two tasks at once: ${line.trim()}`);
  }
});
