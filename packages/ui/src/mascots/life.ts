/**
 * The life of the flock — what a bird does when nobody asks it for anything (`Mascot life`): it breathes, blinks in its
 * own rhythm, tilts its head, ruffles a wing, now and then hops — each in character: the falcon watches (a slow scan),
 * the owl reads (a tilt, a slow double blink), the duck builds (quick nods, like typing), the flamingo answers (its neck
 * sways towards you), the pigeon delivers (its head bobs, its parcel swings). CSS only: transform and opacity, no
 * timer, no frame loop; `Flock` adds the moments between birds (a glance, a delivery) by setting `look` and `flying`.
 *
 * Every motion is a keyframe on its own group (hop → bird → look → head), so they add up instead of fighting for one
 * `transform`; each starts at a phase of its own (`--kzb-ph`) so two birds never move together.
 */
import type { MascotBird } from "./geometry";

/** Where the head turns: the neck's base (the flamingo and the crane sway from their shoulder). */
export const HEAD_PIVOT: Readonly<Record<MascotBird, readonly [number, number]>> = {
  falcon: [60, 54],
  owl: [60, 52],
  duck: [60, 60],
  flamingo: [58, 60],
  pigeon: [60, 50],
  lovebird: [60, 52],
  crane: [52, 62],
  magpie: [58, 50],
  beaver: [60, 56],
};

export const MASCOT_LOOKS = ["center", "left", "right", "up"] as const;
export type MascotLook = (typeof MASCOT_LOOKS)[number];

interface Character {
  /** The head's keyframes over `head` seconds (a pose is a `transform`). */
  head: { seconds: number; frames: string };
  /** The eyes close over `blink` seconds: a single blink or a slow double one. */
  blink: { seconds: number; frames: string };
  /** The wings ruffle over `flutter` seconds, once in the cycle. */
  flutter: { seconds: number; at: number; angle: number };
  /** A hop over `hop` seconds, once in the cycle (0: this bird never hops). */
  hop: { seconds: number; height: number };
}

const SINGLE = "0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}";
const DOUBLE = "0%,80%,100%{transform:scaleY(1)}83%{transform:scaleY(.08)}86%{transform:scaleY(1)}89%{transform:scaleY(.08)}93%{transform:scaleY(1)}";

/** Poses are written `rotate(deg)` + a little `translate`, around HEAD_PIVOT. */
const pose = (rotate: number, x = 0, y = 0) => `transform:translate(${x}px,${y}px) rotate(${rotate}deg)`;

const DEFAULT: Character = {
  head: { seconds: 10, frames: `0%,100%{${pose(0)}}25%{${pose(-5)}}45%{${pose(-5)}}60%{${pose(4)}}80%{${pose(4)}}` },
  blink: { seconds: 5.2, frames: SINGLE },
  flutter: { seconds: 12, at: 0.7, angle: 12 },
  hop: { seconds: 0, height: 0 },
};

export const CHARACTERS: Readonly<Record<MascotBird, Character>> = {
  // Watches: a slow scan left, then right, a look up — it blinks rarely.
  falcon: {
    head: { seconds: 9, frames: `0%,100%{${pose(0)}}12%,30%{${pose(-6, -1)}}38%,56%{${pose(5, 1)}}64%{${pose(0)}}78%,88%{${pose(0, 0, -1.6)}}` },
    blink: { seconds: 7.5, frames: SINGLE },
    flutter: { seconds: 15, at: 0.78, angle: 9 },
    hop: { seconds: 0, height: 0 },
  },
  // Reads: the head tilts to a page, a slow double blink, a small nod at the end of a line.
  owl: {
    head: { seconds: 11, frames: `0%,100%{${pose(0)}}18%,36%{${pose(-10, -1)}}44%{${pose(0)}}52%{${pose(0, 0, 1.6)}}58%{${pose(0)}}68%,82%{${pose(7, 1)}}90%{${pose(0)}}` },
    blink: { seconds: 8, frames: DOUBLE },
    flutter: { seconds: 14, at: 0.66, angle: 10 },
    hop: { seconds: 0, height: 0 },
  },
  // Builds: quick nods in a burst, like typing, and an excited hop when a block fits.
  duck: {
    head: { seconds: 7, frames: `0%,48%,100%{${pose(0)}}51%,59%,67%{${pose(2, 0, 2)}}55%,63%,71%{${pose(0)}}` },
    blink: { seconds: 4.6, frames: SINGLE },
    flutter: { seconds: 10, at: 0.8, angle: 14 },
    hop: { seconds: 13, height: 7 },
  },
  // Answers: the neck sways towards you, the head tilts as it listens, a flick of a wing.
  flamingo: {
    head: { seconds: 8, frames: `0%,100%{${pose(0)}}25%{${pose(-4, -1)}}50%{${pose(3, 1)}}75%{${pose(-2)}}` },
    blink: { seconds: 5.6, frames: SINGLE },
    flutter: { seconds: 11, at: 0.72, angle: 13 },
    hop: { seconds: 0, height: 0 },
  },
  // Delivers: the head bobs as it walks, the wings shake out, a hop on the doorstep.
  pigeon: {
    head: { seconds: 3.1, frames: `0%,30%,100%{${pose(0)}}8%{${pose(-1, -2.2, 1)}}16%{${pose(0, 1.4)}}24%{${pose(0)}}` },
    blink: { seconds: 4.2, frames: SINGLE },
    flutter: { seconds: 9, at: 0.74, angle: 18 },
    hop: { seconds: 11, height: 6 },
  },
  lovebird: { ...DEFAULT, flutter: { seconds: 9, at: 0.7, angle: 16 }, hop: { seconds: 12, height: 6 } },
  crane: { ...DEFAULT, head: { seconds: 14, frames: `0%,100%{${pose(0)}}30%,50%{${pose(-3, -1)}}` }, blink: { seconds: 9, frames: DOUBLE } },
  magpie: { ...DEFAULT, head: { seconds: 6, frames: `0%,100%{${pose(0)}}20%{${pose(-7, -1)}}30%{${pose(6, 1)}}42%{${pose(-4)}}55%{${pose(0)}}` }, hop: { seconds: 10, height: 6 } },
  beaver: { ...DEFAULT, flutter: { seconds: 13, at: 0.75, angle: 8 } },
};

const pct = (n: number) => `${+(n * 100).toFixed(1)}%`;

/** The rules every bird shares: they read the bird's own timings from custom properties (`birdLifeCss`). */
export function sharedLifeCss(): string {
  return [
    `@keyframes kzb-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(.996,1.018)}}`,
    `@keyframes kzb-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}`,
    `@keyframes kzb-flap{from{transform:rotate(calc(var(--kzb-s)*-8deg))}to{transform:rotate(calc(var(--kzb-s)*46deg))}}`,
    `@keyframes kzb-poke{0%{transform:translateY(0)}35%{transform:translateY(-5px)}70%{transform:translateY(0)}85%{transform:translateY(-1px)}100%{transform:translateY(0)}}`,
    `.kzb-hop,.kzb-look,.kzb-head,.kzb-pupil,.kzb-parcel{transform-box:view-box}`,
    `.kzb-hop{transform-origin:60px 108px}.kzb-parcel{transform-origin:60px 99px}.kzb-look,.kzb-head{transform-origin:var(--kzb-pivot,60px 52px)}`,
    `.kzb-wing-l{--kzb-s:1}.kzb-wing-r{--kzb-s:-1}`,
    // Each motion, from the bird's own timings (animation + delay as a fraction of its period, so no two birds move together).
    `[data-animated][data-life] .kzb-bird{animation:kzb-breathe 4.2s ease-in-out infinite;animation-delay:calc(var(--kzb-ph)*-4.2s)}`,
    `[data-animated][data-life] .kzb-blink{animation:var(--kzb-lid-a);animation-delay:calc(var(--kzb-ph)*var(--kzb-lid-d))}`,
    `[data-animated][data-life] .kzb-head{animation:var(--kzb-head-a);animation-delay:calc(var(--kzb-ph)*var(--kzb-head-d))}`,
    `[data-animated][data-life][data-mood] .kzb-wing{animation:var(--kzb-wing-a);animation-delay:calc(var(--kzb-ph)*var(--kzb-wing-d))}`,
    `[data-animated][data-life] .kzb-hop{animation:var(--kzb-hop-a,none);animation-delay:calc(var(--kzb-ph)*var(--kzb-hop-d,0s))}`,
    `[data-animated][data-life] .kzb-parcel{animation:var(--kzb-parcel-a,none);animation-delay:calc(var(--kzb-ph)*-3.2s)}`,
    // Where it looks (set by a flock, or a pointer): the head turns, the pupils follow.
    `[data-animated][data-life] .kzb-look{transition:transform .5s cubic-bezier(.3,.9,.3,1)}`,
    `[data-animated][data-life] .kzb-pupil{transition:transform .4s cubic-bezier(.3,.9,.3,1)}`,
    `[data-animated][data-look="left"] .kzb-look{transform:translateX(-1.5px) rotate(-8deg)}[data-animated][data-look="right"] .kzb-look{transform:translateX(1.5px) rotate(8deg)}[data-animated][data-look="up"] .kzb-look{transform:translateY(-2px) rotate(0)}`,
    `[data-animated][data-look="left"] .kzb-pupil{transform:translateX(-1.6px)}[data-animated][data-look="right"] .kzb-pupil{transform:translateX(1.6px)}[data-animated][data-look="up"] .kzb-pupil{transform:translateY(-1.8px)}`,
    // A poke (a tap): a little jump. In flight (the pigeon's delivery): the wings beat, the body leans into the trip.
    `[data-animated][data-life][data-poked] .kzb-hop{animation:kzb-poke .55s ease-out 1}`,
    `[data-animated][data-life][data-flying] .kzb-wing{animation:kzb-flap .17s ease-in-out infinite alternate;animation-delay:0s}`,
    `[data-animated][data-life][data-flying] .kzb-bird{animation:none;transform:rotate(calc(var(--kzb-bank,0)*7deg))}`,
    `[data-animated][data-life][data-flying] :is(.kzb-head,.kzb-hop){animation:none}`,
    `@media (prefers-reduced-motion:reduce){.kzb-hop,.kzb-head,.kzb-parcel{animation:none!important}}`,
  ].join("\n");
}

/** One bird's own timings: its keyframes (named after it) and the custom properties the shared rules read. */
export function birdLifeCss(bird: MascotBird): string {
  const c = CHARACTERS[bird];
  const [hx, hy] = HEAD_PIVOT[bird];
  const f = c.flutter;
  const k = (name: string) => `kzb-${bird}-${name}`;
  const flutterFrames = `0%,${pct(f.at)},${pct(f.at + 0.1)},100%{transform:rotate(0)}${pct(f.at + 0.025)}{transform:rotate(calc(var(--kzb-s)*${f.angle}deg))}${pct(f.at + 0.05)}{transform:rotate(calc(var(--kzb-s)*${+(f.angle * 0.2).toFixed(1)}deg))}${pct(f.at + 0.075)}{transform:rotate(calc(var(--kzb-s)*${+(f.angle * 0.9).toFixed(1)}deg))}`;
  const props = [
    `--kzb-pivot:${hx}px ${hy}px`,
    `--kzb-head-a:${k("head")} ${c.head.seconds}s ease-in-out infinite`,
    `--kzb-head-d:-${c.head.seconds}s`,
    `--kzb-lid-a:${k("lid")} ${c.blink.seconds}s ease-in-out infinite`,
    `--kzb-lid-d:-${c.blink.seconds}s`,
    `--kzb-wing-a:${k("flutter")} ${f.seconds}s ease-out infinite`,
    `--kzb-wing-d:-${f.seconds}s`,
    c.hop.seconds ? `--kzb-hop-a:${k("leap")} ${c.hop.seconds}s ease-out infinite` : "",
    c.hop.seconds ? `--kzb-hop-d:-${c.hop.seconds}s` : "",
    bird === "pigeon" ? `--kzb-parcel-a:kzb-sway 3.2s ease-in-out infinite` : "",
  ].filter(Boolean);
  return [
    `@keyframes ${k("head")}{${c.head.frames}}`,
    `@keyframes ${k("lid")}{${c.blink.frames}}`,
    `@keyframes ${k("flutter")}{${flutterFrames}}`,
    c.hop.seconds
      ? `@keyframes ${k("leap")}{0%,86%,100%{transform:translateY(0)}90%{transform:translateY(-${c.hop.height}px)}94%{transform:translateY(0)}96.5%{transform:translateY(-${+(c.hop.height * 0.3).toFixed(1)}px)}98.5%{transform:translateY(0)}}`
      : "",
    `svg[data-bird="${bird}"]{${props.join(";")}}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** The whole stylesheet of the flock's life: what `blocks.css` carries between its `mascot-life` markers (a test keeps them equal). */
export function lifeCss(): string {
  return [sharedLifeCss(), ...(Object.keys(CHARACTERS) as MascotBird[]).map(birdLifeCss)].join("\n");
}

/** A phase between 0 and 1 from any string (an id), so two instances of one bird do not move together. */
export const phaseOf = (seed: string): number => [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 997;
