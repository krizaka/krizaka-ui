// @vitest-environment node
// @krizaka/ui, @krizaka/tailwind and @krizaka/tokens ship together (tailwind and ui are peers of each other, pinned to
// the same release line). A package that declares one of them on an older major makes npm hoist the old copy to the
// workspace root, where `@import "@krizaka/tailwind"` (theme.css) then resolves a tailwind whose own imports
// (`@krizaka/ui/motion.css`) are not installed next to it: every app build fails (the Sovkora web app's main, 2026-10-16).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { test } from "vitest";

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
// In krizaka-ui the platform packages are workspace siblings (`workspace:^`): the range they publish is the sibling's version.
const versionOf = (name, range) =>
  range.startsWith("workspace:") ? read(`../../${name.split("/")[1]}/package.json`).version : range;
const major = (name, range) => Number(/(\d+)\./.exec(versionOf(name, range))[1]);

test("the design system declares @krizaka/ui, tailwind and tokens on the same major", () => {
  const { dependencies: d } = read("../package.json");
  const ui = major("@krizaka/ui", d["@krizaka/ui"]);
  assert.equal(major("@krizaka/tailwind", d["@krizaka/tailwind"]), ui, "tailwind vs ui");
  assert.equal(major("@krizaka/tokens", d["@krizaka/tokens"]), ui, "tokens vs ui");
});

test("orazaka-shared's @krizaka/tokens is on the design system's major", () => {
  const ds = read("../package.json").dependencies["@krizaka/tokens"];
  const shared = read("../../orazaka-shared/package.json").devDependencies["@krizaka/tokens"];
  assert.equal(major("@krizaka/tokens", shared), major("@krizaka/tokens", ds));
});
