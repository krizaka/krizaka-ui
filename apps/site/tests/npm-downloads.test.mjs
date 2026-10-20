// The parsers behind the home's download figures (lib/npm-downloads.ts), on fixtures of api.npmjs.org's payloads.
import assert from "node:assert/strict";
import { test } from "node:test";

import { parseLastWeek, rangeWindow, sumKnown, weeklyBuckets } from "../lib/npm-downloads.ts";

const days = (start, counts) => counts.map((downloads, i) => ({ day: new Date(Date.parse(start) + i * 864e5).toISOString().slice(0, 10), downloads }));

test("the window is the 84 days that end on the given day, inclusive", () => {
  assert.deepEqual(rangeWindow("2026-10-18"), { start: "2026-07-27", end: "2026-10-18" });
});

test("12 weekly sums, oldest first, from a range payload", () => {
  const w = rangeWindow("2026-10-18");
  const counts = Array.from({ length: 84 }, (_, i) => Math.floor(i / 7) + 1);
  assert.deepEqual(weeklyBuckets({ downloads: days(w.start, counts) }, w.end), [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84]);
});

test("fail soft: a gap, a bad type or a negative count gives null", () => {
  const w = rangeWindow("2026-10-18");
  const ok = days(w.start, Array(84).fill(1));
  assert.equal(weeklyBuckets(null, w.end), null);
  assert.equal(weeklyBuckets({ error: "rate limited" }, w.end), null);
  assert.equal(weeklyBuckets({ downloads: ok.slice(1) }, w.end), null);
  assert.equal(weeklyBuckets({ downloads: [...ok.slice(0, 83), { day: ok[83].day, downloads: "1" }] }, w.end), null);
  assert.equal(weeklyBuckets({ downloads: [...ok.slice(0, 83), { day: ok[83].day, downloads: -4 }] }, w.end), null);
});

test("last-week: the figure and the day it ends on, or nothing", () => {
  assert.deepEqual(parseLastWeek({ downloads: 4968, start: "2026-10-12", end: "2026-10-18", package: "@krizaka/ui" }), { weekly: 4968, end: "2026-10-18" });
  assert.equal(parseLastWeek({ error: "package not found" }), null);
  assert.equal(parseLastWeek({ downloads: 12, end: "yesterday" }), null);
  assert.equal(parseLastWeek({ downloads: 1.5, end: "2026-10-18" }), null);
});

test("sumKnown adds what is known and says nothing when nothing is", () => {
  assert.equal(sumKnown([4968, undefined, 12, null]), 4980);
  assert.equal(sumKnown([undefined]), undefined);
});
