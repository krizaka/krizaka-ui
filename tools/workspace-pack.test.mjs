// node --test tools/ — a release pull request names versions of the siblings that npm does not have yet: the packed
// package must install with its workspace dependencies, offline. Fixtures in a temporary monorepo; real pnpm and npm.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";

import { packWithSiblings, workspaceDependencies } from "./workspace-pack.mjs";

let root;
const write = (dir, manifest) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module", exports: "./index.js", ...manifest }));
  writeFileSync(join(dir, "index.js"), "export default 1;\n");
};
const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
// Nothing may come from a registry: an unpublished version has nowhere to be found, as on a release pull request.
const NO_REGISTRY = ["--registry=http://127.0.0.1:9", "--no-audit", "--no-fund", "--fetch-retries=0", "--loglevel=error"];

before(() => {
  root = mkdtempSync(join(tmpdir(), "kz-workspace-pack-"));
  writeFileSync(join(root, "pnpm-workspace.yaml"), 'packages:\n  - "packages/*"\n');
  // top → middle → leaf, versions that exist nowhere but here (the release pull request's bump).
  write(join(root, "packages", "leaf"), { name: "@kz-fixture/leaf", version: "9.9.9" });
  write(join(root, "packages", "middle"), { name: "@kz-fixture/middle", version: "9.9.9", dependencies: { "@kz-fixture/leaf": "workspace:^" } });
  write(join(root, "packages", "top"), { name: "@kz-fixture/top", version: "9.9.9", dependencies: { "@kz-fixture/middle": "workspace:^" }, devDependencies: { "@kz-fixture/leaf": "workspace:*" } });
  write(join(root, "packages", "alone"), { name: "@kz-fixture/alone", version: "9.9.9", devDependencies: { "@kz-fixture/leaf": "workspace:*" } });
});
after(() => rmSync(root, { recursive: true, force: true }));

describe("workspace-pack", () => {
  it("lists the workspace dependencies transitively, dependencies first, and not the dev ones", () => {
    assert.deepEqual(workspaceDependencies(join(root, "packages", "top")).map((d) => d.name), ["@kz-fixture/leaf", "@kz-fixture/middle"]);
    assert.deepEqual(workspaceDependencies(join(root, "packages", "alone")), []);
  });

  it("packs the package with its siblings, the package last", () => {
    const out = mkdtempSync(join(tmpdir(), "kz-pack-out-"));
    try {
      const packed = packWithSiblings(join(root, "packages", "top"), out);
      assert.deepEqual(packed.map((p) => p.name), ["@kz-fixture/leaf", "@kz-fixture/middle", "@kz-fixture/top"]);
      for (const { tarball } of packed) assert.ok(existsSync(tarball), tarball);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  it("installs offline with its siblings, where the tarball alone cannot", () => {
    const out = mkdtempSync(join(tmpdir(), "kz-pack-install-"));
    const consumer = mkdtempSync(join(tmpdir(), "kz-consumer-"));
    try {
      const packed = packWithSiblings(join(root, "packages", "top"), out);
      writeFileSync(join(consumer, "package.json"), JSON.stringify({ name: "consumer", private: true }));
      // Alone: `@kz-fixture/middle@^9.9.9` is on no registry — the failure of the release pull request.
      assert.throws(() => sh("npm", ["install", packed.at(-1).tarball, ...NO_REGISTRY], consumer));
      sh("npm", ["install", ...packed.map((p) => p.tarball), ...NO_REGISTRY], consumer);
      for (const name of ["leaf", "middle", "top"]) assert.ok(existsSync(join(consumer, "node_modules", "@kz-fixture", name, "package.json")), name);
    } finally {
      rmSync(out, { recursive: true, force: true });
      rmSync(consumer, { recursive: true, force: true });
    }
  });
});
