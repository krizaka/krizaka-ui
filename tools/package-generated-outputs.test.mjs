// node --test tools/ — a file a package exports and git ignores is written by its `build`, so it must be an output of
// turbo's `build`: a cache hit restores only the outputs. One left out is missing after a replayed build, and whatever
// imports it fails — `@krizaka/ui/catalog.json` broke the site's build that way (krizaka-ui#1044; the site's own
// generated files are guarded by site-generated-outputs.test.mjs, krizaka-ui#980).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");
const outputs = JSON.parse(readFileSync(join(root, "turbo.json"), "utf8")).tasks.build.outputs;

/** turbo's output globs, as this repository writes them: `dir/**` or an exact path. */
const isOutput = (file) =>
  outputs.some((glob) => (glob.endsWith("/**") ? file.startsWith(glob.slice(0, -2)) : file === glob));

/** Every string target of an `exports` map, without its leading `./`. */
function targets(value) {
  if (typeof value === "string") return [value.replace(/^\.\//, "")];
  if (value && typeof value === "object") return Object.values(value).flatMap(targets);
  return [];
}

const ignored = (dir, files) => {
  if (files.length === 0) return [];
  try {
    return execFileSync("git", ["check-ignore", ...files], { cwd: dir, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return []; // exit 1: none is ignored
  }
};

const packages = readdirSync(join(root, "packages"))
  .map((name) => join(root, "packages", name))
  .filter((dir) => existsSync(join(dir, "package.json")));

test("the workspace packages are found", () => {
  assert.ok(packages.length > 0);
});

for (const dir of packages) {
  const manifest = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const exported = [...new Set(targets(manifest.exports ?? {}))].filter((file) => !file.includes("*"));
  test(`${manifest.name}: every generated file it exports is an output of turbo's build`, () => {
    const missing = ignored(dir, exported).filter((file) => !isOutput(file));
    assert.deepEqual(missing, [], `${manifest.name} exports these git-ignored files that turbo.json tasks.build.outputs misses`);
  });
}
