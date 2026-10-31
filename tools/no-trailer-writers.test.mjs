import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

// Commits carry the bot identity only (2026-10-31): no workflow or tool may write a co-author trailer, the org check rejects it.
const needle = ["co-authored", "by"].join("-");
const files = [];
for (const dir of [".github/workflows", "tools"]) {
  for (const e of readdirSync(dir, { withFileTypes: true })) if (e.isFile() && /\.(ya?ml|mjs|sh)$/.test(e.name) && e.name !== "no-trailer-writers.test.mjs") files.push(join(dir, e.name));
}

test("no workflow or tool writes a co-author trailer", () => {
  const found = files.filter((f) => readFileSync(f, "utf8").toLowerCase().includes(needle));
  assert.deepEqual(found, []);
});
