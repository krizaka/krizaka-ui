// The v3 films (orazaka#289, ADR-080 v3): no narrator, cut to the music, and the anomalies of the v2 audit fixed in the
// staging code — a bird stands ON the surface it names, at its size against a reference object, casts its shadow on the
// ground away from the light (nothing under a flying bird), without its render's props or baked shadow.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const here = new URL(".", import.meta.url).pathname;
const py = (code) => execFileSync("python3", ["-c", code], { cwd: here, encoding: "utf8" }).trim();
const films = ["krizaka", "orochia"].map((f) => [f, JSON.parse(readFileSync(new URL(`./${f}/treatment.json`, import.meta.url), "utf8"))]);

const MOVES = new Set(["handheld", "whip-pan", "dolly-in", "dolly-out", "tracking", "orbit", "crane-up", "fpv", "crane-down", "push-in", "pull-back", "tilt-up", "tilt-down", "snap-zoom", "locked"]);

for (const [name, t] of films) {
  test(`${name}: no narrator — the story is told by picture, action, music and sound`, () => {
    assert.equal(t.narration, "none");
    assert.deepEqual(t.lines, []);
  });

  test(`${name}: 45–70 s, every section of the score filled by shots to the beat`, () => {
    const beats = {};
    for (const s of t.shots) beats[s.section] = (beats[s.section] ?? 0) + s.beats;
    const sections = Object.keys(beats);
    assert.deepEqual(Object.values(beats), t.score.form.map((f) => f.bars * 4), `${sections}`);
    const seconds = (t.shots.reduce((a, s) => a + s.beats, 0) * 60) / t.score.bpm + 4; // + the end card
    assert.ok(seconds >= 45 && seconds <= 70, `${seconds} s`);
  });

  test(`${name}: every character shot stages each character on a surface (with a scale reference), in the air or held`, () => {
    for (const s of t.shots) {
      for (const c of s.characters) {
        const g = (s.staging ?? []).find((x) => x.character === c);
        assert.ok(g, `shot ${s.id}: ${c} not staged`);
        if (g.support === "ground") {
          assert.ok(g.surface && g.scale?.ref && g.scale.ratio > 0, `shot ${s.id}: ${c} has no surface or scale`);
          assert.ok(g.scale.ratio < 1.6, `shot ${s.id}: ${c} would be ${g.scale.ratio}× its reference`);
        }
      }
    }
  });

  test(`${name}: a kinetic camera — at most 15 % locked off, low angles and macro inserts, Wan frames 4k+1`, () => {
    assert.ok(t.shots.every((s) => MOVES.has(s.camera)));
    assert.ok(t.shots.filter((s) => s.camera === "locked").length / t.shots.length <= 0.15);
    assert.ok(t.shots.filter((s) => s.angle === "low" || s.angle === "macro").length >= 3);
    for (const s of t.shots) assert.equal((s.frames - 1) % 4, 0, `shot ${s.id}: ${s.frames} frames`);
  });

  test(`${name}: a hard key light is said in the plate (the shadows know where to fall)`, () => {
    const words = { left: /(from|on) the left/, right: /(from|on) the right/, "back-left": /behind left/, "back-right": /behind right/ };
    for (const s of t.shots) if (s.light.hard && words[s.light.key]) assert.match(s.plate, words[s.light.key], `shot ${s.id}`);
  });

  test(`${name}: the legal rule — no real person, song, brand or platform named`, () => {
    const text = JSON.stringify({ ...t, legal: undefined }).toLowerCase();
    for (const n of t.legal.never) assert.ok(!text.includes(n.toLowerCase()), n);
  });
}

test("orochia: neutral and brand-safe — nothing adult or suggestive, never « live »", () => {
  const t = films.find(([n]) => n === "orochia")[1];
  const text = JSON.stringify(t.shots).toLowerCase();
  for (const w of ["sexy", "sensual", "seductive", "lingerie", "kiss", "bedroom", "nude", "naked", "twerk", "strip", "stripper", "live", "livestream"]) {
    assert.doesNotMatch(text, new RegExp(`\\b${w}\\b`), w);
  }
  assert.ok(t.shots.some((s) => s.characters.includes("pigeon") && /deliver/.test(s.intent)), "the pigeon delivers");
});

test("a grounded bird's feet go inside the surface it names, at its depth", () => {
  assert.deepEqual(JSON.parse(py("import json, stage; print(json.dumps(stage.feet_on((400, 416, 824, 496), 0.5, 0.4)))")), [612, 448]);
});

test("its height is the ratio of its reference object, kept inside the frame", () => {
  const out = JSON.parse(py("import json, stage; print(json.dumps([stage.height_from((0, 100, 10, 600), 0.2, 720), stage.height_from((0, 0, 10, 2000), 0.9, 720), stage.height_from((0, 0, 10, 20), 0.2, 720)]))"));
  assert.deepEqual(out, [100, 612, 36]);
});

test("the shadow lies on the ground away from the key light, with a contact under the feet", () => {
  const code = `
import json, numpy as np, stage
a = np.zeros((100, 40)); a[10:100, 10:30] = 1
def centre(key):
    s, (left, top) = stage.cast_shadow(a, key, True)
    ys, xs = np.nonzero(s > 0.2)
    return [float(xs.mean() + left - 20), float(ys.mean() + top - 100)]
print(json.dumps({k: centre(k) for k in ["left", "right", "back", "front"]}))`;
  const c = JSON.parse(py(code));
  assert.ok(c.left[0] > 5, `key left: the shadow falls right (${c.left})`);
  assert.ok(c.right[0] < -5, `key right: the shadow falls left (${c.right})`);
  assert.ok(c.back[1] > -2, `backlit: the shadow comes toward the camera (${c.back})`);
  assert.ok(c.front[1] < c.back[1], `front light: the shadow goes behind (${c.front} vs ${c.back})`);
  for (const k of ["left", "right", "back"]) assert.ok(Math.abs(c[k][1]) < 40, `${k}: the shadow stays at the feet line`);
});

test("the render's baked shadow and its props are not part of the bird", () => {
  const code = `
import numpy as np, stage
from PIL import Image
a = np.zeros((100, 100, 4), np.uint8); a[0:90, 20:80] = (200, 50, 50, 255); a[92:100, 10:90] = (0, 0, 0, 80)
out = stage.clean(Image.fromarray(a), "falcon")
print(out.size[1])`;
  assert.equal(Number(py(code)), 90);
});

test("the vision model's boxes come back in the plate's own pixels; its answers are read strictly", () => {
  const out = JSON.parse(py(`import json, vlm
b = vlm.parse_box('[{"bbox_2d": [401, 416, 824, 496], "label": "table"}]', (1176, 672), (1280, 720))
print(json.dumps([b, vlm.parse_box("no box", (1176, 672), (1280, 720)), vlm.parse_yes_no("YES", "YES"), vlm.parse_yes_no("No.", "NO"), vlm.parse_yes_no("Yes, but it floats", "YES"), vlm.parse_yes_no("unclear", "NO")]))`));
  assert.deepEqual(out, [[436, 446, 897, 531], null, true, true, false, false]);
});

test("the light check: a bird that takes the scene's light passes; one that keeps its render's colours in a coloured light does not", () => {
  const out = JSON.parse(py(`import json, numpy as np, integrity as g
light = np.array((0.55, 0.35, 0.15))                                      # a warm lamp-lit room
room = np.zeros((100, 100, 3)); room[...] = light
own = np.array((0.25, 0.45, 0.85))                                        # a blue bird in white light
lit = room.copy(); lit[40:60, 40:60] = own * light / light.mean()         # the same bird under the lamp
pasted = room.copy(); pasted[40:60, 40:60] = own                          # v2: the render's colours as they are
a = g.light_match(lit, (40, 40, 60, 60), tuple(own)); b = g.light_match(pasted, (40, 40, 60, 60), tuple(own))
print(json.dumps([a["chromaShift"] < g.MAX_CHROMA_SHIFT, b["chromaShift"] > g.MAX_CHROMA_SHIFT, a, b]))`));
  assert.equal(out[0], true, JSON.stringify(out[2]));
  assert.equal(out[1], true, JSON.stringify(out[3]));
});

test("a contact shadow is measured under a standing bird: darker under its feet than beside them", () => {
  const out = JSON.parse(py(`import json, numpy as np, integrity as g
ground = np.full((200, 200, 3), 0.5); ground[40:100, 80:120] = 0.9      # a bird standing at y=100, nothing under it
pasted = g.contact_ratio(ground, (80, 40, 120, 100))
ground[98:106, 80:122] = 0.2                                               # its contact shadow
print(json.dumps([pasted, g.contact_ratio(ground, (80, 40, 120, 100)), g.MAX_CONTACT_RATIO]))`));
  assert.ok(out[0] > out[2], `no shadow reads ${out[0]}`);
  assert.ok(out[1] < out[2], `a contact shadow reads ${out[1]}`);
});

test("a whited-out frame and a wrong scale are measured; the thresholds mirror the pack's (cinema.staging.ts)", () => {
  const out = JSON.parse(py(`import json, numpy as np, integrity as g
white = np.full((10, 10, 3), 255, np.uint8); grey = np.full((10, 10, 3), 120, np.uint8)
print(json.dumps([g.clipped_seconds([white, white, grey], 0.2), g.scale_ok(100, 500, 0.2), g.scale_ok(220, 500, 0.2),
  g.MIN_CAMERA_SHIFT, g.MIN_ZOOM, list(g.LUMA_RATIO), g.MAX_CHROMA_SHIFT, g.MAX_CLIPPED_SECONDS, g.SCALE_TOLERANCE]))`));
  assert.deepEqual(out, [0.4, true, false, 0.0015, 0.01, [0.55, 1.6], 15, 0.3, 1.43]);
});

test("every v3 plate and keyframe prompt carries the child-safety rule", () => {
  const src = readFileSync(new URL("./keyframes.py", import.meta.url), "utf8");
  const body = (name) => src.slice(src.indexOf(`def ${name}(`), src.indexOf("\ndef ", src.indexOf(`def ${name}(`) + 1));
  for (const fn of ["plate_prompt", "integrate_prompt"]) assert.match(body(fn), /\{NO_CHILDREN\}/, fn);
});

test("the score is arranged on the grid: sections back to back, a filter that glides, a tempo found to 0.01 BPM", () => {
  const out = JSON.parse(py(`import json, numpy as np, arrange as a
s = a.sections([{"section": "intro", "bars": 4}, {"section": "drop", "bars": 8}], 120)
hop = 0.005; t = np.arange(0, 20, hop); onset = np.zeros_like(t)
for b in np.arange(0, 20, 60 / 133.37): onset[int(round(b / hop))] = 1
print(json.dumps([s, a.tempo_of(onset, hop, 140)]))`));
  assert.deepEqual(out[0].map((x) => [x.section, x.start, x.end]), [["intro", 0, 8], ["drop", 8, 24]]);
  assert.ok(Math.abs(out[1] - 133.37) < 0.3, `${out[1]}`);
});

test("each shot becomes one GPU take from its own keyframe, with the keep line and the child-safety rule", () => {
  const out = JSON.parse(py(`import json, jobs
plan = json.load(open("krizaka/treatment.json"))
print(json.dumps([jobs.job(plan["shots"][2], plan), jobs.job(plan["shots"][2], plan, 1)["name"]]))`));
  const [j, reshoot] = out;
  assert.equal(j.name, "03-pigeon-ledge-t0");
  assert.equal(reshoot, "03-pigeon-ledge-t1");
  assert.deepEqual(j.start, { keyframe: 3 });
  assert.match(j.prompt, /No children, no child-like figures, no dolls or toys\.$/);
  assert.match(j.prompt, /contact shadows/);
  assert.equal(j.fps, 16);
  assert.equal((j.frames - 1) % 4, 0);
});

test("the camera comes to the birds' scale: the plate is cropped (≤ 3.2×) until the tallest bird is hero-sized", () => {
  const out = JSON.parse(py(`import json, stage
small = stage.reframe([(640, 600, 60)], (1280, 720), 0.42)
big = stage.reframe([(640, 600, 400)], (1280, 720), 0.42)
tiny = stage.reframe([(100, 700, 10)], (1280, 720), 0.42)
print(json.dumps([small, big, tiny, stage.hero_size({"characters": ["a"], "framing": "medium"}), stage.hero_size({"characters": ["a", "b", "c"]}), stage.hero_size({"characters": ["a"], "framing": "close-up"})]))`));
  const [small, big, tiny, one, three, close] = out;
  assert.ok(small[0] > 2 && small[0] <= 3.2, `zoom ${small[0]}`);
  // the feet stay inside the crop, low in it (the bird stands in the lower part of the frame)
  const feetY = (600 - small[2]) * small[0];
  assert.ok(feetY > 720 * 0.6 && feetY < 720, `feet at ${feetY}`);
  assert.deepEqual(big, [1, 0, 0], "a bird already big enough is not reframed");
  assert.ok(tiny[0] === 3.2 && tiny[1] >= 0 && tiny[2] >= 0 && tiny[1] + 1280 / 3.2 <= 1280 + 1e-6 && tiny[2] + 720 / 3.2 <= 720 + 1e-6, "the crop stays inside the plate");
  assert.ok(one > three && close > one);
});

test("the edit cuts on the beat grid: every cut within half a frame of its beat, no drift", () => {
  const out = JSON.parse(py(`import json, edit
shots = [{"beats": b} for b in [8, 4, 4, 2, 2, 4, 4, 4, 6, 6] * 4]
sp = edit.spans(shots, 140, 24)
beat = 60 / 140
errs, at = [], 0
for s, (a, b) in zip(shots, sp):
    at += s["beats"]
    errs.append(abs(b / 24 - at * beat))
print(json.dumps([max(errs), sp[0][0], all(sp[i][1] == sp[i + 1][0] for i in range(len(sp) - 1))]))`));
  assert.ok(out[0] <= 0.5 / 24 + 1e-9, `${out[0]}`);
  assert.equal(out[1], 0);
  assert.equal(out[2], true, "shots are back to back");
});
