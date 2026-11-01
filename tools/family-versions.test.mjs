// The versions dispatch-release sends (krizaka-internal#879): public @krizaka/* only, read from a commit.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertCommit, familyOf } from "./family-versions.mjs";

test("only the public @krizaka/* manifests, with their versions", () => {
  const texts = [
    JSON.stringify({ name: "@krizaka/ui", version: "3.77.0" }),
    JSON.stringify({ name: "@krizaka/site", version: "0.0.0", private: true }),
    JSON.stringify({ name: "other", version: "1.0.0" }),
    "not json",
  ];
  assert.deepEqual(familyOf(texts), { "@krizaka/ui": "3.77.0" });
});

test("the release tells the consumers once every version is on npm", () => {
  const wf = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
  const check = wf.indexOf("tools/check-published.sh");
  const dispatch = wf.indexOf("krizaka/.github/actions/dispatch-release@");
  assert.ok(check > 0 && dispatch > check, "dispatch-release runs after check-published");
  assert.match(wf, /node tools\/family-versions\.mjs "\$GITHUB_SHA"/);
});

test("a commit is a SHA or HEAD, never an option or a path handed to git", () => {
  assert.equal(assertCommit("HEAD"), "HEAD");
  assert.equal(assertCommit("2eb79be5"), "2eb79be5");
  for (const bad of ["--output=/tmp/x", "main; rm -rf /", "../x", "", "HEAD~1"]) assert.throws(() => assertCommit(bad), /not a commit/);
});
