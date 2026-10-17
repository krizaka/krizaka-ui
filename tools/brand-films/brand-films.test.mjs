// The brand films' choreography and film plan: pure data, tested without a browser (pnpm test:tools).
import assert from "node:assert/strict";
import { test } from "node:test";

import { MASCOT_BIRDS } from "../../packages/ui/src/mascots/geometry.ts";
import { birdLoops, DEFAULT_VIEW, flaps, IDLE, keyframes, LOOP, LOOP_BIRDS, tracksCss } from "./choreography.mjs";
import { FILM, layout, sceneTracks, vtt } from "./film.mjs";
import { parseArgs } from "./render.mjs";
import { drawable, dress } from "./stage.mjs";

test("every bird of the flock has a loop — a new bird fails here until it is given its gesture", () => {
  assert.deepEqual([...LOOP_BIRDS].sort(), [...MASCOT_BIRDS].sort());
  assert.deepEqual(Object.keys(birdLoops()).sort(), [...MASCOT_BIRDS].sort());
});

test("a loop track closes on its first stop (seamless), a film moment holds its last", () => {
  const loop = keyframes("a", [[0, "opacity:0"], [2, "opacity:1"]], 8);
  assert.match(loop, /0% \{ opacity:0 \}/);
  assert.match(loop, /100% \{ opacity:0 \}/);
  const film = keyframes("b", [[0, "opacity:0"], [2, "opacity:1"]], 8, { hold: true });
  assert.match(film, /100% \{ opacity:1 \}/);
  assert.throws(() => keyframes("c", [[1, "opacity:0"]], 8), /starts at 0/);
  assert.throws(() => keyframes("d", [[0, "x:0"], [3, "x:1"], [2, "x:2"]], 8), /back in time/);
  assert.throws(() => keyframes("e", [[0, "x:0"], [9, "x:1"]], 8), /past the end/);
});

test("every track of every loop starts at 0, stays inside the loop, and the poster is inside it too", () => {
  for (const [bird, spec] of Object.entries(birdLoops())) {
    for (const [sel, stops] of [...IDLE, ...spec.tracks]) {
      assert.equal(stops[0][0], 0, `${bird} ${sel}`);
      for (let i = 1; i < stops.length; i++) assert.ok(stops[i][0] >= stops[i - 1][0] && stops[i][0] <= LOOP.seconds, `${bird} ${sel} stop ${i}`);
    }
    assert.ok(spec.poster > 0 && spec.poster < LOOP.seconds, bird);
    assert.doesNotThrow(() => tracksCss([...IDLE, ...spec.tracks]), bird);
  }
});

test("tracks on one selector share one animation list (a gesture never cancels the idle life)", () => {
  const css = tracksCss([[".kzb-eye", [[0, "scale:1"]]], [".kzb-eye", [[0, "transform:none"]], { delay: 3, iterations: 1 }]], { prefix: "t" });
  const rules = css.split("\n").filter((l) => l.startsWith(".kzb-eye"));
  assert.equal(rules.length, 1);
  assert.match(rules[0], /animation: t-0 8s linear 0s infinite both, t-1 8s linear 3s 1 both;/);
});

test("wingbeats always land back at rest", () => {
  const f = flaps(1, 2, 0.4, 30);
  assert.equal(f.at(-1)[1], "transform:rotate(0deg)");
  assert.ok(f.some(([, d]) => d === "transform:rotate(30deg)"));
});

const MASCOT = '<svg width="96" height="96" viewBox="0 0 120 120" fill="none" data-bird="owl"><style>x</style><defs><linearGradient id="kzb-R1"><stop/></linearGradient></defs><ellipse cx="60"/><g class="kzb-bird"><path fill="url(#kzb-R1)"/><g class="kzb-wing kzb-wing-r" style="transform-origin:91px 58px;transform:rotate(-20deg)"><path/></g></g></svg>';

test("dress keeps the bird as drawn and only adds: frame, shadow name, props, a wrapper that moves it", () => {
  const out = dress(MASCOT, { back: "<i/>", inner: "<b/>", outer: "<u/>", view: [-25, -20, 170, 170], size: 540, uid: "owl" });
  assert.match(out, /viewBox="-25 -20 170 170"/);
  assert.match(out, /width="540" height="540"/);
  assert.match(out, /<ellipse class="bf-shadow" /);
  assert.match(out, /style="transform-origin:91px 58px"/);
  assert.match(out, /<g class="bf-props"><i\/><\/g><g class="bf-move"><g class="kzb-bird">/);
  assert.match(out, /<g class="bf-props"><b\/><\/g><\/g><g class="bf-props"><u\/><\/g><\/svg>$/);
  assert.match(out, /id="kzb-R1-owl"/);
  assert.match(out, /url\(#kzb-R1-owl\)/);
  assert.throws(() => dress("<svg></svg>"), /not a Mascot/);
});

test("the mark's shield gets a path length, to draw itself", () => {
  assert.match(drawable('<svg><path d="M1 1" stroke="url(#ink)"/></svg>'), /<path pathLength="1" d="M1 1" stroke="url\(#ink\)"/);
  assert.throws(() => drawable("<svg><circle/></svg>"), /no stroked shield/);
});

test("the film lasts 30–45 s, each bird has its moment alone, and the captions follow in order", () => {
  assert.ok(FILM.seconds >= 30 && FILM.seconds <= 45);
  const moments = FILM.cast.map((b) => FILM.spotlight[b]);
  for (let i = 1; i < moments.length; i++) assert.ok(moments[i - 1] + FILM.spotlightLength <= moments[i] - 0.5, `${FILM.cast[i]} waits for ${FILM.cast[i - 1]}`);
  for (let i = 0; i < FILM.cues.length; i++) {
    const c = FILM.cues[i];
    assert.ok(c.start < c.end && c.end <= FILM.seconds, c.id);
    assert.ok(c.en.trim() && c.fr.trim(), c.id);
    if (i) assert.ok(FILM.cues[i - 1].end <= c.start, `${c.id} overlaps`);
  }
  for (const b of FILM.cast) assert.ok(FILM.cues.some((c) => c.id === b), `${b} says its promise`);
  assert.ok(FILM.poster > 0 && FILM.poster < FILM.seconds);
});

test("in each aspect, the bird in front stands on the ridge like the others, and everyone is in the frame", () => {
  for (const aspect of Object.keys(FILM.aspects)) {
    const L = layout(aspect);
    const feetInFront = L.spot[1] + ((108 - DEFAULT_VIEW[1]) / DEFAULT_VIEW[3] - 0.5) * L.spotSize;
    assert.ok(Math.abs(feetInFront - L.actors.owl.feetY) <= 1, aspect);
    for (const [bird, a] of Object.entries(L.actors)) assert.ok(a.birdX > 0 && a.birdX < L.W && a.y < L.H, `${aspect} ${bird}`);
    assert.ok(L.caption > L.actors.owl.feetY && L.caption < L.H, `${aspect}: captions sit under the ridge`);
    assert.doesNotThrow(() => tracksCss(sceneTracks(L), { total: FILM.seconds, iterations: 1, hold: true }));
    for (const b of [...FILM.cast, ...FILM.family]) assert.doesNotThrow(() => tracksCss([[".x", FILM.actorTrack(b, L)]], { total: FILM.seconds, hold: true }), `${aspect} ${b}`);
  }
});

test("captions are written as WebVTT, one cue per line said", () => {
  const en = vtt("en");
  assert.match(en, /^WEBVTT\n\ntitle\n00:00:00\.600 --> 00:00:03\.600\nThe world of Krizaka\.\n/);
  assert.equal(en.split(" --" + "> ").length - 1, FILM.cues.length);
  assert.match(vtt("fr"), /Le monde de Krizaka\./);
});

test("the CLI wants an output folder and knows its birds and aspects", () => {
  assert.throws(() => parseArgs([]), /--out/);
  assert.throws(() => parseArgs(["--out", "x", "--birds", "dodo"]), /no loop for "dodo"/);
  assert.throws(() => parseArgs(["--out", "x", "--aspects", "4x3"]), /no aspect/);
  const o = parseArgs(["--out", "x", "--only", "loops", "--birds", "owl,duck"]);
  assert.deepEqual(o.only, ["loops"]);
  assert.deepEqual(o.birds, ["owl", "duck"]);
});

test("the loops' hashes go from krizaka-com's manifest into the site module, and nothing else", async () => {
  const { loopHashes, withHashes } = await import("./hashes.mjs");
  const manifest = { files: { "brand-films/loops/owl-square-dark.mp4": "0123456789", "brand-films/loops/owl-square-dark.jpg": "abcdefabcd", "brand-films/loops/owl-alpha.webm": "ffffffffff", "home/kit/x.mp4": "1111111111" } };
  assert.deepEqual(loopHashes(manifest), { "owl-square-dark.jpg": "abcdefabcd", "owl-square-dark.mp4": "0123456789" });
  const src = "a\nexport const LOOP_HASHES: Record<string, string> = {};\nb";
  assert.equal(withHashes(src, { "owl-square-dark.mp4": "0123456789" }), 'a\nexport const LOOP_HASHES: Record<string, string> = {\n  "owl-square-dark.mp4": "0123456789",\n};\nb');
});
