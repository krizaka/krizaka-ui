// The epic (« Le monde de Krizaka : la tournée »): its shot plan and its cut hold to the brand reference — pure data, no GPU.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { LOOP_BIRDS } from "../choreography.mjs";
import { FILM } from "../film.mjs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const plan = read("./shots.json");
const edl = read("./edl.json");

test("every bird of the plan is a bird of the flock, placed inside the frame", () => {
  for (const shot of plan.shots) {
    for (const place of [...shot.birds, ...(shot.birds9x16 ?? [])]) {
      assert.ok(LOOP_BIRDS.includes(place.bird), `${shot.id}: ${place.bird}`);
      assert.ok(place.x > 0 && place.x < 1 && place.h > 0 && place.h <= 1.2, `${shot.id}: ${place.bird} placement`);
    }
  }
});

test("shot ids are unique, numbered, and give unique seeds", () => {
  const ids = plan.shots.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^\d\d-[a-z0-9-]+$/);
  const seeds = ids.map((id) => plan.seedBase + Number(id.slice(0, 2)));
  assert.equal(new Set(seeds).size, seeds.length);
});

test("prompts name no real person, artist, film, song or brand (the guardrails of TREATMENT.md)", () => {
  const banned = /chappelle|elmaleh|godfather|corleone|ali g|tupac|2pac|marley|wu-tang|agassi|nadal|federer|roland|wimbledon|nike|adidas|akai|mpc|technics|sony|hawk-eye|marvel|pixar|disney/i;
  for (const shot of plan.shots) {
    for (const text of [shot.keyframe, shot.motion]) assert.doesNotMatch(text, banned, shot.id);
  }
  for (const cue of edl.music) assert.doesNotMatch(cue.prompt, banned, cue.id);
});

test("every motion prompt carries one camera move, and the KEEP line closes it (guidance 1.0: no negative prompt)", () => {
  assert.match(plan.keep, /exact cartoon design/);
  const moves = /\b(static|locked-off|dolly|push-in|orbit|crane up|handheld|tracking|rack focus)\b/gi;
  for (const shot of plan.shots) assert.ok((shot.motion.match(moves) ?? []).length >= 1, shot.id);
});

test("the captions are the film's own lines, word for word (REFERENCE-PERSONNAGES-ET-DISCOURS §2)", () => {
  const lines = new Set(FILM.cues.flatMap((c) => [c.en, c.fr]));
  for (const shot of edl.shots) {
    if (!shot.caption) continue;
    assert.ok(lines.has(shot.caption.en), `${shot.id} en: ${shot.caption.en}`);
    assert.ok(lines.has(shot.caption.fr), `${shot.id} fr: ${shot.caption.fr}`);
  }
});

test("the cut uses every generated shot once, plus the code film at both ends", () => {
  const cut = edl.shots.map((s) => s.id);
  for (const shot of plan.shots) assert.ok(cut.includes(shot.id), `${shot.id} is not in the cut`);
  assert.equal(edl.shots[0].clip, "code-film.mp4");
  assert.equal(edl.shots.at(-1).clip, "code-film.mp4");
  for (const s of edl.shots) {
    assert.ok(s.out > s.in, s.id);
    if (s.ramp) assert.ok(s.ramp[0] > s.in && s.ramp[0] < s.out, `${s.id} ramp`);
  }
});
