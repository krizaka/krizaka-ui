"use client";

// The flock's scenes: what a bird does between the idle motions, each one true to the promise it carries — the owl reads
// (a book, a leaf turned), the flamingo and the lovebird answer (a speech mark, a reply), the crane steps and bows, the
// beaver carries a log and taps it, the magpie spots a shiny point and takes it, the duck builds, the falcon scans — and the
// pigeon's parcel changes hands: the receiver reacts in its own way. A director picks one beat at a time from what the
// flock holds, with chance in the waits and in the choice, so it never loops the same minute twice. Transform and opacity
// only (Web Animations on a few small elements, timers between beats); nothing runs off screen or under reduced motion.
import * as React from "react";

import type { MascotBird, MascotLook } from "../mascots";
import { PARCEL } from "../mascots/geometry";

export type PropKind = "say" | "book" | "log" | "glint" | "gift";

/** A small thing a bird shows for a while: a speech mark, a book, a log, a shiny point, a parcel. */
export interface Shown {
  id: number;
  /** Index of the bird it belongs to. */
  at: number;
  kind: PropKind;
  /** How long it stays (ms). */
  ms: number;
  /** The mark of a speech bubble. */
  mark?: string;
  /** Which side it comes from (1: right, -1: left). */
  side?: 1 | -1;
}

/** What a beat can do on the stage (built by `Flock`; every wait ends when the flock stops). */
export interface Stage {
  birds: readonly { bird: MascotBird; x: number; y: number; size: number }[];
  /** Indexes left to right. */
  order: readonly number[];
  random: () => number;
  look: (index: number, to: MascotLook) => void;
  rest: (...indexes: number[]) => void;
  poke: (index: number, ms?: number) => void;
  say: (index: number, mark: string, ms: number) => void;
  show: (index: number, kind: PropKind, ms: number, side?: 1 | -1) => void;
  /** Move a bird's body for a while (transform only). */
  move: (index: number, keyframes: Keyframe[], ms: number) => Promise<void>;
  wait: (ms: number) => Promise<void>;
}

const side = (s: Stage, i: number, j: number): 1 | -1 => (s.birds[j]!.x >= s.birds[i]!.x ? 1 : -1);
const towards = (s: Stage, i: number, j: number): MascotLook => (side(s, i, j) > 0 ? "right" : "left");
/** Where a bird is among its neighbours, left to right: the one beside it (the nearer one when there are two). */
export function neighbourOf(s: Stage, i: number): number | null {
  const at = s.order.indexOf(i);
  const near = [s.order[at - 1], s.order[at + 1]].filter((n): n is number => n !== undefined);
  if (!near.length) return null;
  const gap = (n: number) => Math.abs(s.birds[n]!.x - s.birds[i]!.x);
  return near.reduce((a, b) => (gap(a) <= gap(b) ? a : b), near[0]!);
}

// @fixed: the choreography's pace — how long each beat lasts. A rhythm to the eye, not a business parameter.
const BOOK_MS = 4800;
const LOG_MS = 3800;
const GLINT_MS = 3400;
const SAY_MS = 1500;

/** The owl reads: it looks down at its book, a leaf turns, and it turns another. A neighbour glances over. */
async function read(s: Stage, i: number) {
  const j = neighbourOf(s, i);
  s.look(i, "left");
  s.show(i, "book", BOOK_MS);
  await s.wait(BOOK_MS * 0.45);
  if (j !== null && s.random() < 0.5) {
    s.look(j, towards(s, j, i));
    await s.wait(1100);
    s.rest(j);
  }
  await s.wait(BOOK_MS * 0.5);
  s.rest(i);
}

/** The flamingo or the lovebird speaks; its neighbour listens, then answers, and they both light up. */
async function chat(s: Stage, i: number) {
  const j = neighbourOf(s, i);
  s.look(i, j === null ? "up" : towards(s, i, j));
  s.say(i, "…", SAY_MS);
  await s.wait(SAY_MS * 0.6);
  if (j === null) {
    await s.wait(SAY_MS * 0.6);
    s.rest(i);
    return;
  }
  s.look(j, towards(s, j, i));
  await s.wait(SAY_MS * 0.7);
  s.say(j, s.random() < 0.5 ? "!" : "?", SAY_MS);
  s.poke(j);
  await s.wait(SAY_MS * 0.5);
  s.poke(i);
  await s.wait(SAY_MS * 0.7);
  s.rest(i, j);
}

/** The crane steps out of the line, bows to its neighbour, and steps back. */
async function bow(s: Stage, i: number) {
  const j = neighbourOf(s, i);
  const dir = j === null ? 1 : side(s, i, j);
  const step = `${(s.birds[i]!.size * 0.14 * dir).toFixed(2)}cqw`;
  const lean = `rotate(${dir * 11}deg)`;
  const at = (x: string, r: string) => `translateX(${x}) ${r}`;
  const run = s.move(
    i,
    [
      { transform: at("0cqw", "rotate(0deg)"), easing: "ease-in-out" },
      { transform: at(step, "rotate(0deg)"), offset: 0.22, easing: "ease-in-out" },
      { transform: at(step, lean), offset: 0.42, easing: "ease-in-out" },
      { transform: at(step, lean), offset: 0.6, easing: "ease-in-out" },
      { transform: at(step, "rotate(0deg)"), offset: 0.74, easing: "ease-in-out" },
      { transform: at("0cqw", "rotate(0deg)") },
    ],
    3800,
  );
  if (j !== null) {
    await s.wait(1700);
    s.look(j, towards(s, j, i));
    await s.wait(1200);
    s.poke(j);
    await s.wait(500);
    s.rest(j);
  }
  await run;
}

/** The beaver brings a log, taps it into place three times, and takes it away. */
async function tap(s: Stage, i: number) {
  s.show(i, "log", LOG_MS, s.birds[i]!.x > 50 ? 1 : -1);
  await s.wait(LOG_MS * 0.3);
  for (let n = 0; n < 3; n++) {
    s.poke(i, 420);
    await s.wait(520);
  }
  await s.wait(LOG_MS * 0.3);
}

/** The magpie sees something shiny on the ground, looks, hops, and takes it. */
async function shine(s: Stage, i: number) {
  const dir: 1 | -1 = s.birds[i]!.x > 50 ? -1 : 1;
  const to: MascotLook = dir > 0 ? "right" : "left";
  s.show(i, "glint", GLINT_MS, dir);
  await s.wait(GLINT_MS * 0.28);
  s.look(i, to);
  await s.wait(GLINT_MS * 0.3);
  s.poke(i);
  await s.wait(GLINT_MS * 0.25);
  s.look(i, "up");
  await s.wait(GLINT_MS * 0.2);
  s.rest(i);
}

/** The duck builds: quick nods in a burst, like typing a block into place. */
async function build(s: Stage, i: number) {
  for (let n = 0; n < 4; n++) {
    s.poke(i, 300);
    await s.wait(380);
  }
}

/** The falcon watches: a slow scan, left then right, and a look up. */
async function scan(s: Stage, i: number) {
  for (const to of ["left", "up", "right"] as const) {
    s.look(i, to);
    await s.wait(1100);
  }
  s.rest(i);
}

/** The pigeon's parcel has just been handed over: the receiver reacts in its own way (about 2 s). */
export async function receive(s: Stage, i: number, from: number) {
  const bird = s.birds[i]!.bird;
  s.look(i, towards(s, i, from));
  s.show(i, "gift", 2400);
  await s.wait(350);
  if (bird === "crane") await bow(s, i);
  else if (bird === "magpie") {
    s.poke(i);
    await s.wait(700);
    s.show(i, "glint", GLINT_MS * 0.6, side(s, i, from));
    await s.wait(1200);
  } else if (bird === "beaver" || bird === "duck") {
    s.poke(i, 420);
    await s.wait(520);
    s.poke(i, 420);
    await s.wait(900);
  } else if (bird === "owl") {
    s.say(i, "?", SAY_MS);
    await s.wait(900);
    s.poke(i);
    await s.wait(700);
  } else {
    s.say(i, "!", SAY_MS);
    s.poke(i);
    await s.wait(1500);
  }
}

export interface Beat {
  id: string;
  bird: MascotBird;
  run: (s: Stage, index: number) => Promise<void>;
}

/** What each bird of the flock can do on its own (the pigeon's trip is the flock's courier). */
export const BEATS: readonly Beat[] = [
  { id: "read", bird: "owl", run: read },
  { id: "chat", bird: "flamingo", run: chat },
  { id: "chat", bird: "lovebird", run: chat },
  { id: "bow", bird: "crane", run: bow },
  { id: "tap", bird: "beaver", run: tap },
  { id: "shine", bird: "magpie", run: shine },
  { id: "build", bird: "duck", run: build },
  { id: "scan", bird: "falcon", run: scan },
];

// ─── The small things a bird shows ───────────────────────────────────────────────────────────────

const PAPER = "var(--kz-surface-1)";
const INK = "var(--kz-text-primary)";
const LINE = "var(--kz-border-strong, currentColor)";

/** One thing, in its own frame: it comes in, stays for `ms`, and goes (opacity and transform only). */
function lifeFrames(from: string, to: string): Keyframe[] {
  return [
    { opacity: 0, transform: from, offset: 0 },
    { opacity: 1, transform: "none", offset: 0.14 },
    { opacity: 1, transform: "none", offset: 0.84 },
    { opacity: 0, transform: to, offset: 1 },
  ];
}

const LEAF: Keyframe[] = [
  { transform: "scaleX(1)", offset: 0 },
  { transform: "scaleX(1)", offset: 0.25 },
  { transform: "scaleX(-1)", offset: 0.38 },
  { transform: "scaleX(1)", offset: 0.39 },
  { transform: "scaleX(1)", offset: 0.62 },
  { transform: "scaleX(-1)", offset: 0.75 },
  { transform: "scaleX(-1)", offset: 1 },
];

export function Prop({ shown, size }: { shown: Shown; size: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const leaf = React.useRef<HTMLDivElement>(null);
  const dir = shown.side ?? 1;
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    const from: Record<PropKind, [string, string]> = {
      say: ["translateY(30%) scale(.5)", "translateY(-12%) scale(.9)"],
      book: ["translateY(40%) scale(.8)", "translateY(20%) scale(.9)"],
      log: [`translateX(${190 * dir}%)`, `translateX(${190 * dir}%)`],
      glint: ["scale(.2) rotate(-60deg)", `translate(${-90 * dir}%, -170%) scale(.2) rotate(60deg)`],
      gift: ["translateY(40%) scale(.3)", "translateY(-30%) scale(1.4)"],
    };
    const [a, b] = from[shown.kind];
    const animations = [el.animate(lifeFrames(a, b), { duration: shown.ms, fill: "both", easing: "ease-out" })];
    if (shown.kind === "book" && leaf.current) animations.push(leaf.current.animate(LEAF, { duration: shown.ms, fill: "both", easing: "ease-in-out" }));
    if (shown.kind === "glint") animations.push(el.firstElementChild!.animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 700, iterations: Math.ceil(shown.ms / 700), easing: "ease-in-out" }));
    return () => animations.forEach((x) => x.cancel());
  }, [shown, dir]);

  const unit = (n: number) => `calc(${size}cqw * ${n})`;
  const base: React.CSSProperties = { position: "absolute", pointerEvents: "none", opacity: 0 };

  if (shown.kind === "say")
    return (
      <div ref={ref} data-flock-prop="say" style={{ ...base, left: "58%", top: "-6%", width: unit(0.34), height: unit(0.24), transformOrigin: "20% 100%" }}>
        <span
          style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: PAPER, border: `1.5px solid ${LINE}`, borderRadius: "999px", color: INK, font: `600 ${unit(0.17)}/1 var(--font-mono, ui-monospace, monospace)` }}
        >
          {shown.mark ?? "…"}
        </span>
        <span style={{ position: "absolute", left: "14%", bottom: "-12%", width: unit(0.07), height: unit(0.07), background: PAPER, borderRight: `1.5px solid ${LINE}`, borderBottom: `1.5px solid ${LINE}`, transform: "rotate(45deg)" }} />
      </div>
    );

  if (shown.kind === "book")
    return (
      <div ref={ref} data-flock-prop="book" style={{ ...base, left: "17%", bottom: "-2%", width: "66%", height: unit(0.2), transformOrigin: "50% 100%" }}>
        {[0, 1].map((n) => (
          <span key={n} style={{ position: "absolute", top: 0, bottom: 0, [n ? "right" : "left"]: 0, width: "50%", background: `repeating-linear-gradient(${PAPER} 0 18%, ${LINE} 18% 24%)`, border: `1.5px solid ${LINE}`, borderRadius: n ? "0 3px 3px 0" : "3px 0 0 3px" }} />
        ))}
        <div ref={leaf} style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "50%", transformOrigin: "0 50%", background: PAPER, border: `1.5px solid ${LINE}`, borderRadius: "0 3px 3px 0" }} />
      </div>
    );

  if (shown.kind === "log")
    return (
      <div ref={ref} data-flock-prop="log" style={{ ...base, left: "22%", bottom: "-3%", width: "56%", height: unit(0.17), background: PARCEL[2], borderRadius: "999px", boxShadow: `inset -${unit(0.04)} 0 0 ${PARCEL[1]}` }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(${PARCEL[0]} 0 25%, ${PARCEL[1]} 26% 55%, ${PARCEL[2]} 56%)`, border: `1px solid ${PARCEL[2]}` }} />
      </div>
    );

  if (shown.kind === "glint")
    return (
      <div ref={ref} data-flock-prop="glint" style={{ ...base, [dir > 0 ? "left" : "right"]: "94%", bottom: "2%", width: unit(0.2), height: unit(0.2) }}>
        <span style={{ position: "absolute", inset: 0, background: PARCEL[0], clipPath: "polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)" }} />
      </div>
    );

  return (
    <div ref={ref} data-flock-prop="gift" style={{ ...base, left: "58%", top: "2%", width: unit(0.26), height: unit(0.22), background: PARCEL[0], border: `1.5px solid ${PARCEL[2]}`, borderRadius: 2 }}>
      <span style={{ position: "absolute", left: "44%", top: 0, bottom: 0, width: "12%", background: PARCEL[2] }} />
      <span style={{ position: "absolute", top: "42%", left: 0, right: 0, height: "16%", background: PARCEL[2] }} />
    </div>
  );
}
