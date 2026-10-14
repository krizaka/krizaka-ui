// node --test tools/ — every published package runs on a supported Node: Node 20 is end of life, so `engines` says >=22.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const packages = join(import.meta.dirname, "..", "packages");

describe("engines", () => {
  for (const name of readdirSync(packages)) {
    it(`@krizaka/${name} requires Node >=22`, () => {
      const pkg = JSON.parse(readFileSync(join(packages, name, "package.json"), "utf8"));
      assert.equal(pkg.engines?.node, ">=22");
    });
  }
});
