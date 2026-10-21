// « Le monde de Krizaka : le relais » — v2 of the reference film (krizaka/orazaka#289): a story, not a catalogue. Its
// treatment holds to the brand reference and to the rubric the cinema pack applies: an arc, purposeful living shots,
// birds that act on each other (never a lineup), rhythm, a score that changes genre with each place and resolves, a sound
// for every shot, and the legal rule (no real person, song, game or show — every nod evoked by original means). Pure data.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { LOOP_BIRDS } from "../../choreography.mjs";
import { FILM } from "../../film.mjs";

const read = (name) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const plan = read("./treatment.json");
const edl = read("./edl.json");
const gate = read("./gate.json");
const CAST = [...LOOP_BIRDS, "phoenix"];
const MODELS = ["wan2.2-i2v-a14b-hq", "ltx-video-0.9.8-13b-distilled"];
const BEATS = ["hook", "journey", "turn", "payoff"];
const PROMISE_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"];
const INTERACTIONS = ["meet", "help", "argue", "handoff", "tease", "celebrate", "compete", "rescue"];

test("the flock only, each bird from its render, every shot on a licensed model, LTX never drawing a bird", () => {
  for (const c of plan.characters) {
    assert.ok(CAST.includes(c.id), c.id);
    assert.equal(c.reference, c.id);
    assert.ok(c.promise && c.intention, `${c.id} has a promise and an intention`);
  }
  plan.shots.forEach((s, i) => assert.equal(s.id, i + 1));
  for (const s of plan.shots) {
    assert.ok(MODELS.includes(s.model), `${s.id}: ${s.model}`);
    if (s.model.startsWith("ltx")) assert.equal(s.characters.length, 0, `${s.id}: LTX never draws a bird`);
    for (const place of s.birds ?? []) assert.ok(CAST.includes(place.bird) && place.x > 0 && place.x < 1, `${s.id}: ${place.bird}`);
    assert.ok(s.place, `${s.id}: where it happens`);
  }
});

test("the story has an arc in order, a turn after the first third, a theme, and every shot a purpose", () => {
  assert.ok(plan.theme.length > 10);
  assert.deepEqual(plan.arc.map((a) => a.beat), BEATS);
  const order = plan.shots.map((s) => BEATS.indexOf(s.beat));
  order.forEach((b, i) => assert.ok(b >= 0 && (i === 0 || b >= order[i - 1]), `shot ${i + 1}: beats in order`));
  const total = plan.shots.reduce((t, s) => t + s.seconds, 0);
  const beforeTurn = plan.shots.slice(0, plan.shots.findIndex((s) => s.beat === "turn")).reduce((t, s) => t + s.seconds, 0);
  assert.ok(beforeTurn > total / 3, "the turn comes after the first third");
  for (const s of plan.shots) assert.ok(s.purpose.split(" ").length >= 4, `${s.id}: purpose`);
});

test("the birds act on each other — meet, argue, help, hand off — and are never lined up for the camera", () => {
  const birdShots = plan.shots.filter((s) => s.characters.length);
  const together = birdShots.filter((s) => s.characters.length >= 2);
  for (const s of together) assert.ok(INTERACTIONS.includes(s.interactionKind), `${s.id}: what they do to each other`);
  const kinds = new Set(together.map((s) => s.interactionKind));
  for (const k of ["meet", "argue", "help", "handoff"]) assert.ok(kinds.has(k), `the story has a ${k}`);
  assert.ok(together.length >= birdShots.length / 2, "most bird shots hold birds acting on each other");
  const lineup = /\b(in a row|line[sd]? up|lineup|turns? (their|its) heads? (to|toward) the (camera|lens)|looks? (in)?to the (camera|lens))\b/i;
  for (const s of birdShots) {
    for (const k of ["intent", "gaze", "physics", "action", "motion"]) assert.ok(s[k], `${s.id}: ${k}`);
    assert.doesNotMatch(s.action, lineup, `${s.id}: a lineup`);
    assert.doesNotMatch(s.action, /\b(looks around|turns its head (left|right)|flies around|scanning the valley)\b/i, `${s.id}: generic`);
  }
});

test("rhythm: shot lengths vary, with runs of quick cuts", () => {
  const lengths = plan.shots.map((s) => s.seconds);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const spread = Math.sqrt(lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length) / mean;
  assert.ok(spread >= 0.15, `spread ${spread.toFixed(2)}`);
  assert.ok(lengths.some((_, i) => lengths.slice(i, i + 3).length === 3 && lengths.slice(i, i + 3).every((x) => x <= 3)));
});

test("the promise lines are the film's own words (REFERENCE-PERSONNAGES-ET-DISCOURS §2); the new lines name no bird", () => {
  const film = new Set(FILM.cues.flatMap((c) => [c.en, c.fr]));
  const byId = Object.fromEntries(plan.lines.map((l) => [l.id, l]));
  for (const id of ["falcon", "owl", "duck", "flamingo", "pigeon", "together"]) {
    assert.ok(film.has(byId[id].en), `${id} en: ${byId[id].en}`);
    assert.ok(film.has(byId[id].fr), `${id} fr: ${byId[id].fr}`);
  }
  for (const id of ["cold", "quebec"]) {
    for (const lang of ["en", "fr"]) assert.doesNotMatch(byId[id][lang], /falcon|owl|duck|flamingo|pigeon|faucon|hibou|canard|flamant/i, `${id} ${lang}`);
  }
  for (const bird of PROMISE_BIRDS) {
    assert.ok(byId[bird].shots.some((id) => plan.shots[id - 1].characters.includes(bird)), `${bird}'s line is over its own shot`);
  }
  for (const l of plan.lines) assert.ok(l.direction.emotion && l.direction.pace, `${l.id}: directed`);
  const lower = new Set([...film].map((x) => x.toLowerCase()));
  for (const t of plan.titles) assert.ok(lower.has(`${t.en}.`.toLowerCase()) && lower.has(`${t.fr}.`.toLowerCase()), t.en);
});

test("the score changes genre with each place, never at full scale, and resolves; every shot has a sound", () => {
  const cues = plan.music.cues;
  assert.ok(new Set(cues.map((c) => c.genre)).size >= 6, "a journey of genres");
  let next = 1;
  for (const c of cues) {
    assert.equal(c.shots[0], next, `cue ${c.genre} starts where the last one ended`);
    next = c.shots[1] + 1;
    assert.ok(c.intensity <= 0.85, `${c.genre} under the story`);
    assert.match(c.prompt, /no vocals/, `${c.genre} instrumental`);
  }
  assert.equal(next, plan.shots.length + 1, "every shot is scored");
  const peak = Math.max(...cues.map((c) => c.intensity));
  assert.ok(cues[0].intensity <= Math.min(...cues.map((c) => c.intensity)), "it opens soft");
  assert.ok(cues.at(-1).intensity <= peak - 0.1, "it resolves after its peak");
  for (const s of plan.shots) {
    assert.ok(s.sound.length > 0, `${s.id}: a sound`);
    if (s.characters.length) assert.ok(s.sound.some((c) => c.at !== undefined), `${s.id}: its action is heard`);
  }
});

test("the legal rule: no real person, song, game, show or brand anywhere; every reference says how it is evoked", () => {
  const never = [...plan.legal.never, "snoop", "kendrick", "drake", "sugar sammy", "bougon", "gta", "grand theft auto", "not like us"].map((n) => n.toLowerCase());
  const { legal, references, ...rest } = plan;
  const text = JSON.stringify(rest).toLowerCase() + JSON.stringify(references).toLowerCase();
  for (const name of never) assert.doesNotMatch(text, new RegExp(`[^a-z]${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^a-z]`), name);
  assert.ok(references.length >= 4);
  for (const r of references) assert.ok(r.how.split(/\s+/).length >= 6, `${r.evokes}: how`);
  assert.ok(legal.never.length >= 5);
});

test("the edit holds every planned shot once, with a 9:16 centre; the gate has a check for every step", () => {
  assert.deepEqual(edl.shots.map((s) => s.shot), plan.shots.map((s) => s.id));
  for (const s of edl.shots) assert.ok(s.vx >= 0 && s.vx <= 1 && s.screen > 1 && s.screen <= 5, `${s.take}`);
  for (const step of ["story", "takes", "voice", "music", "foley", "loudness", "titles"]) assert.ok(gate[step], `gate.${step}`);
});

test("a film longer than the worker's cut (24 shots) is cut in parts at hard cuts, every shot once, in order", async () => {
  const { execFileSync } = await import("node:child_process");
  const parts = (count, limit, cuts) =>
    JSON.parse(execFileSync("python3", ["-c", `import json,sys; sys.path.insert(0, "."); from finish import parts; print(json.dumps(parts(${count}, ${limit}, json.loads(sys.argv[1]))))`, JSON.stringify(cuts)], { cwd: new URL(".", import.meta.url) }).toString());
  assert.deepEqual(parts(5, 24, [true, true, true, true, true]), [[0, 5]]);
  const all = Array(25).fill(true);
  const split = parts(25, 24, all);
  assert.equal(split.length, 2);
  assert.deepEqual(split.flatMap(([a, b]) => Array.from({ length: b - a }, (_, k) => a + k)), [...Array(25).keys()]);
  for (const [a, b] of split) assert.ok(b - a <= 24 && b > a);
  // never split on a transition: shot 13 dissolves in, so the part starts elsewhere
  const soft = [...all];
  soft[13] = false;
  for (const [a] of parts(25, 24, soft)) assert.notEqual(a, 13);
  assert.ok(edl.shots.length > 24, "le relais needs the split");
});
