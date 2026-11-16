// The JavaScript build runs tsup's configs one after another (scripts/build-js.mjs): tsup alone builds every config of
// the array at once, each declaration build with its own TypeScript program, and @krizaka/ui's two largest (9 GB and
// 6 GB) side by side passed 15 GB, the 16 GB of a CI runner (exit 137 on krizaka-ui#1041, twice).
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { buildInTurn } from "./build-js.mjs";
import { PKG } from "./registry.mjs";

describe("buildInTurn", () => {
  it("starts a config only once the one before has finished", async () => {
    const events = [];
    const build = async (options) => {
      events.push(`start ${options.name}`);
      await new Promise((resolve) => setTimeout(resolve, 5));
      events.push(`end ${options.name}`);
    };
    await buildInTurn([{ name: "a" }, { name: "b" }, { name: "c" }], build);
    expect(events).toEqual(["start a", "end a", "start b", "end b", "start c", "end c"]);
  });

  it("passes each config whole, and never lets tsup load the config file again (it would build the whole array)", async () => {
    const seen = [];
    await buildInTurn([{ entry: { cn: "src/cn.ts" }, dts: true }], async (options) => seen.push(options));
    expect(seen).toEqual([{ entry: { cn: "src/cn.ts" }, dts: true, config: false }]);
  });

  it("stops at the first config that fails, with its error", async () => {
    const built = [];
    const boom = new Error("dts failed");
    const build = async (options) => {
      if (options.name === "b") throw boom;
      built.push(options.name);
    };
    await expect(buildInTurn([{ name: "a" }, { name: "b" }, { name: "c" }], build)).rejects.toBe(boom);
    expect(built).toEqual(["a"]);
  });
});

describe("the package's build", () => {
  it("runs tsup through build-js.mjs, never the bare `tsup` that builds every config at once", () => {
    const { scripts } = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
    expect(scripts.build).toContain("node scripts/build-js.mjs");
    expect(scripts.build).not.toMatch(/(^|&&\s*)tsup(\s|$)/);
  });

  it("finishes before the package's tests start: they read dist/, which the build first deletes (turbo.json)", () => {
    const { tasks } = JSON.parse(readFileSync(join(PKG, "turbo.json"), "utf8"));
    expect(tasks.test?.dependsOn).toEqual(expect.arrayContaining(["^build", "build"]));
  });
});
