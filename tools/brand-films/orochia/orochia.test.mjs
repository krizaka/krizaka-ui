// « Orochia : la première livraison » (orazaka#289): the edit holds every planned shot once, the doll take is never in
// the cut, every LTX landscape says it is empty, and the gate passed with the child-safety check and a review.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const plan = read("./treatment.json");
const edl = read("./edl.json");
const gate = read("./gate.json");

test("the edit holds every planned shot once, in order, with a 9:16 centre", () => {
  assert.deepEqual(edl.shots.map((s) => s.shot), plan.shots.map((s) => s.id));
  for (const s of edl.shots) assert.ok(s.vx > 0 && s.vx < 1 && s.screen > 0, `shot ${s.shot}`);
});

test("the doll take is never in the cut, and the bed of shot 3 is said empty", () => {
  assert.ok(!edl.shots.some((s) => s.take === "03-flamingo-shares-t0.mp4"));
  assert.match(plan.shots[2].plate, /no people, no dolls, no toys/);
});

test("every LTX landscape is empty: no animals, no birds, no people", () => {
  for (const s of plan.shots.filter((x) => x.model.startsWith("ltx"))) assert.match(s.motion, /no animals, no birds, no people/, `shot ${s.id}`);
});

test("the gate passed: child-safe (keyframes and takes checked, none left), reviewed, the mix and every line", () => {
  assert.equal(gate.pass, true);
  assert.ok(gate.childSafe.keyframes.checked >= plan.shots.length && gate.childSafe.reviewedBy);
  assert.deepEqual(gate.childSafe.takes.rejected, ["03-flamingo-shares-t0.mp4"]);
  for (const lang of ["en", "fr"]) {
    assert.ok(Math.abs(gate.final.mix[lang].lufs + 14) <= 0.5 && gate.final.mix[lang].truePeak <= -1, lang);
    assert.ok(gate.final.lines[lang].every((l) => l.fits), lang);
  }
  assert.equal(gate.final.foley.ratio, 1);
});
