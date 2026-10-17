import assert from "node:assert/strict";
import { test } from "node:test";

import { parityCounts, parityProblems, parityRow } from "./parity.mjs";

const gap = { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "The phone apps write it by hand today." };
const na = { status: "n/a", reason: "A page block of a public site, not an app screen.", use: "card" };

test("a web-only component without a native decision fails, and the message says how to decide", () => {
  const problems = parityProblems("stat", { platforms: "web", parity: { desktop: "web" } }, ["stat", "card"]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /stat: meta\.parity\.native: it is web only — decide React Native/);
});

test("a component without any parity says the whole shape to write", () => {
  const [problem] = parityProblems("kanban", { platforms: "web" });
  assert.match(problem, /kanban: meta\.parity is missing/);
  assert.match(problem, /desktop: "web" \| "desktop"/);
});

test("a complete decision passes, for each side", () => {
  assert.deepEqual(parityProblems("stat", { platforms: "web", parity: { native: gap, desktop: "web" } }, ["stat", "card"]), []);
  assert.deepEqual(parityProblems("page", { platforms: "web", parity: { native: na, desktop: na } }, ["page", "card"]), []);
  assert.deepEqual(parityProblems("button", { platforms: "both", parity: { desktop: "desktop" } }, ["button"]), []);
  assert.deepEqual(parityProblems("fab", { platforms: "native", parity: { web: na, desktop: na } }, ["fab", "card"]), []);
});

test("refuses contradictions: an absence on a side it has, a web form for a native-only, a gap without its issue", () => {
  assert.match(parityProblems("button", { platforms: "both", parity: { native: na, desktop: "web" } }, ["button", "card"])[0], /has a native side/);
  assert.match(parityProblems("fab", { platforms: "native", parity: { web: na, desktop: "web" } }, ["fab", "card"])[0], /needs a web side/);
  assert.match(parityProblems("stat", { platforms: "web", parity: { native: { status: "gap", reason: "The apps write it by hand." }, desktop: "web" } })[0], /issue/);
  assert.match(parityProblems("stat", { platforms: "web", parity: { native: { status: "n/a", reason: "Not for a phone at all.", use: "nope" }, desktop: "web" } }, ["stat"])[0], /"nope" is not a component/);
  assert.match(parityProblems("stat", { platforms: "web", parity: { native: { status: "maybe", reason: "Not decided at all yet." }, desktop: "web" } })[0], /"gap" .* or "n\/a"/);
});

test("the row and the counts of the matrix", () => {
  const rows = [
    parityRow({ platforms: "web", parity: { native: gap, desktop: "web" } }),
    parityRow({ platforms: "both", parity: { desktop: "desktop" } }),
    parityRow({ platforms: "native", parity: { web: na, desktop: na } }),
  ];
  assert.deepEqual(rows[0], { web: { state: "yes" }, native: { state: "gap", reason: gap.reason, issue: gap.issue }, desktop: { state: "yes" } });
  assert.deepEqual(rows[2].web, { state: "n/a", reason: na.reason, use: "card" });
  assert.deepEqual(parityCounts(rows), {
    web: { yes: 2, gap: 0, "n/a": 1 },
    native: { yes: 2, gap: 1, "n/a": 0 },
    desktop: { yes: 2, gap: 0, "n/a": 1 },
  });
});
