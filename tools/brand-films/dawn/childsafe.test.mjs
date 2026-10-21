// The hard rule of every Orochia or brand film (orazaka#289, ADR-080 v2.8): no children, no child-like figures, no dolls
// or toys. Every plate and keyframe prompt says it, Wan's negative names it, and childsafe.py checks sampled frames of
// every take with a local vision model, read strictly, before a person's review.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const here = new URL(".", import.meta.url).pathname;
const RULE = "No children, no child-like figures, no dolls or toys.";
const py = (code) => execFileSync("python3", ["-c", code], { cwd: here, encoding: "utf8" }).trim();

test("every plate and keyframe prompt carries the rule", () => {
  const shot = { keyframe: "A desk at night.", plate: "A desk at night.", birds: [{ bird: "flamingo" }] };
  const plan = { style: "Warm.", keyframeKeep: "Keep the design.", characters: [{ id: "flamingo", description: "a pink flamingo" }] };
  const out = JSON.parse(py(`import json, keyframes as k; s=${JSON.stringify(JSON.stringify(shot))}; p=${JSON.stringify(JSON.stringify(plan))}; print(json.dumps([k.plate_prompt(json.loads(s), json.loads(p)), k.integrate_prompt(json.loads(s), json.loads(p))]))`));
  for (const prompt of out) assert.ok(prompt.includes(RULE), prompt);
});

test("Wan's negative prompt names children, dolls and toys", () => {
  const src = readFileSync(new URL("./pod/run_jobs.py", import.meta.url), "utf8");
  const negative = src.slice(src.indexOf("NEGATIVE = ("), src.indexOf(")", src.indexOf("NEGATIVE = (")));
  for (const word of ["child", "children", "child-like figure", "doll", "toy"]) assert.ok(negative.includes(word), word);
});

test("the frame check samples the whole take and reads the model strictly", () => {
  const out = JSON.parse(py(`import json, childsafe as c; print(json.dumps([c.sample_times(5), len(c.sample_times(2, 3)), c.parse("NO"), c.parse("no."), c.parse("YES, a doll"), c.parse("maybe")]))`));
  assert.deepEqual(out[0], [0.05, 1.03, 2.01, 2.99, 3.97, 4.95]);
  assert.equal(out[1], 6);
  assert.deepEqual(out.slice(2), [false, false, true, true]);
});

test("the question is the pack's own (orazaka-cli cinema.childsafe.ts)", () => {
  const q = py("import childsafe as c; print(c.QUESTION)");
  assert.equal(q, "Is there a doll or a human child anywhere in this image, even small or in the background? Answer YES or NO only.");
});
