// « Le monde de Krizaka : l'aube »: its treatment and its edit hold to the brand reference — pure data, no GPU.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { LOOP_BIRDS } from "../choreography.mjs";
import { FILM } from "../film.mjs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const plan = read("./treatment.json");
const edl = read("./edl.json");
const CAST = [...LOOP_BIRDS, "phoenix"];
const MODELS = ["wan2.2-i2v-a14b-hq", "ltx-video-0.9.8-13b-distilled"];

test("every bird is a bird of the flock (or the phoenix), drawn from its render, placed inside the frame", () => {
  for (const c of plan.characters) {
    assert.ok(CAST.includes(c.id), c.id);
    assert.equal(c.reference, c.id, `${c.id} starts from its own render`);
  }
  for (const shot of plan.shots) {
    for (const place of shot.birds) {
      assert.ok(CAST.includes(place.bird), `${shot.id}: ${place.bird}`);
      assert.ok(place.x > 0 && place.x < 1 && place.h > 0, `${shot.id}: ${place.bird} placement`);
    }
    for (const id of shot.characters) assert.ok(plan.characters.some((c) => c.id === id), `${shot.id}: ${id}`);
  }
});

test("shots are numbered in order and each names a licensed model: Wan at full steps for birds, LTX only for landscapes", () => {
  plan.shots.forEach((shot, i) => assert.equal(shot.id, i + 1));
  for (const shot of plan.shots) {
    assert.ok(MODELS.includes(shot.model), `${shot.id}: ${shot.model}`);
    if (shot.model.startsWith("ltx")) assert.equal(shot.characters.length, 0, `${shot.id}: LTX never draws a bird`);
  }
});

test("prompts name no real person, artist, film, song or brand, and every motion carries a camera move", () => {
  const banned = /apple|google|pixar|disney|marvel|nike|adidas|sony|hitchcock|spielberg|nolan|zimmer|hans|beyonc|swift/i;
  const moves = /\b(static|locked-off|dolly|push|push-in|orbit|crane|tilt|pan|handheld|tracking|glide|aerial)\b/i;
  for (const shot of plan.shots) {
    for (const text of [shot.keyframe, shot.motion, shot.plate ?? ""]) assert.doesNotMatch(text, banned, `${shot.id}`);
    assert.match(shot.motion, moves, `${shot.id}: a camera move`);
  }
  assert.doesNotMatch(plan.music, banned);
  assert.match(plan.keep, /exact cartoon design/);
});

test("the captions are the film's own lines, word for word (REFERENCE-PERSONNAGES-ET-DISCOURS §2)", () => {
  const lines = new Set(FILM.cues.flatMap((c) => [c.en, c.fr]));
  for (const [id, cue] of Object.entries(plan.cues)) {
    assert.ok(lines.has(cue.en), `${id} en: ${cue.en}`);
    assert.ok(lines.has(cue.fr), `${id} fr: ${cue.fr}`);
  }
  for (const t of plan.titles) assert.ok(lines.has(t.en) && lines.has(t.fr), t.en);
  // Each promise bird says its own line, once, over its own shot.
  for (const bird of ["falcon", "owl", "duck", "flamingo", "pigeon"]) {
    const shots = edl.shots.filter((s) => s.caption === bird);
    assert.ok(shots.length >= 1, `${bird} speaks`);
    for (const s of shots) {
      const planned = plan.shots.find((p) => s.take.startsWith(`${String(p.id).padStart(2, "0")}-`));
      assert.ok(planned.characters.includes(bird), `${bird}'s line is over ${planned.slug}`);
    }
  }
});

test("the edit uses only planned shots, each once, with a 9:16 centre inside the frame", () => {
  const takes = edl.shots.map((s) => s.take.slice(0, 2));
  assert.equal(new Set(takes).size, takes.length);
  for (const s of edl.shots) {
    assert.ok(plan.shots.some((p) => s.take.startsWith(`${String(p.id).padStart(2, "0")}-${p.slug}-`)), s.take);
    assert.ok(s.vx >= 0 && s.vx <= 1, `${s.take} vx`);
    assert.ok(s.screen > 1 && s.screen <= 7, `${s.take} screen`);
  }
});
