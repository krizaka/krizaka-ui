// @krizaka/config is published from krizaka/krizaka-ts (packages/config), the single source. A copy here published 0.9.0
// without krizaka-known-violations and the presets, and broke the apps' pre-push hooks (krizaka-ui#639). This repository
// consumes the published package; it never holds, versions or publishes one.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/** Every package.json of the workspaces (packages/*, apps/*, the root). */
function manifests() {
  const files = [join(root, "package.json")];
  for (const group of ["packages", "apps"]) {
    for (const dir of readdirSync(join(root, group), { withFileTypes: true })) {
      if (dir.isDirectory()) files.push(join(root, group, dir.name, "package.json"));
    }
  }
  return files.flatMap((file) => {
    try {
      return [{ file, json: JSON.parse(readFileSync(file, "utf8")) }];
    } catch {
      return [];
    }
  });
}

test("no workspace package is named @krizaka/config (krizaka-ts is the single source)", () => {
  const copies = manifests().filter(({ json }) => json.name === "@krizaka/config");
  assert.deepEqual(copies.map(({ file }) => file), []);
  assert.throws(() => readdirSync(join(root, "packages", "config")), { code: "ENOENT" });
});

test("@krizaka/config is consumed from npm, never through the workspace", () => {
  for (const { file, json } of manifests()) {
    for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
      const range = json[field]?.["@krizaka/config"];
      if (range === undefined) continue;
      assert.ok(!String(range).startsWith("workspace:"), `${file}: ${field} uses ${range}`);
      assert.match(String(range), /^[\^~]?(?:0\.(?:9\.[1-9]|[1-9]\d)|[1-9])/, `${file}: ${range} is below 0.9.1 (0.9.0 is broken)`);
    }
  }
});

test("the release workflow refuses to publish @krizaka/config", () => {
  const workflow = readFileSync(join(root, ".github", "workflows", "release.yml"), "utf8");
  assert.match(workflow, /@krizaka\/config is published from krizaka-ts/);
});
