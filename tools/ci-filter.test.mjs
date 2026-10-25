import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { baseBranch, selectTurboFilter } from "./ci-filter.mjs";

describe("CI Turbo filter", () => {
  const affectedFilter = "...[origin/main]";

  it("checks every package for a root-only shared ESLint config change", () => {
    assert.equal(selectTurboFilter(["eslint.config.mjs"], affectedFilter), "*");
  });

  it("keeps package changes on the affected-package filter", () => {
    assert.equal(selectTurboFilter(["packages/ui/src/button.tsx"], affectedFilter), affectedFilter);
  });

  it("checks every package when a root config changes with a package", () => {
    assert.equal(selectTurboFilter(["packages/ui/src/button.tsx", "turbo.json"], affectedFilter), "*");
  });
});

describe("CI base branch", () => {
  it("accepts a branch name", () => {
    assert.equal(baseBranch("main"), "main");
    assert.equal(baseBranch("release/3.x"), "release/3.x");
  });

  it("refuses what is not a plain branch name", () => {
    for (const name of [undefined, "", "-x", "main;rm", "a..b", "main] --filter=*"]) assert.throws(() => baseBranch(name));
  });
});
