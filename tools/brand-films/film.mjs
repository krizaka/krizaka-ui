// "Le monde de Krizaka" — the film of the flock, as data: when each bird steps forward, where everyone stands in each
// aspect, the captions (EN/FR). The stage (./stage.mjs) turns it into a page; ./render.mjs films it.
//
//   0–5 s    the valley at dusk (krizaka.com's hero Landscape), a light sweep, the flock hops up on the ridge
//   6–35 s   each bird steps forward, keeps its promise (its loop gesture), and steps back — 6 s each
//   35–39 s  together: they hop as one, and the family's younger birds (lovebird, crane, magpie, beaver) join
//   39–44 s  the night falls on the Krizaka mark, which draws itself (the same gesture as the www hero's intro)
import { DEFAULT_VIEW, EASE, FALL, OUT, POP } from "./choreography.mjs";
import { birdLoops } from "./choreography.mjs";

const CAST = ["falcon", "owl", "duck", "flamingo", "pigeon"];
const FAMILY = ["lovebird", "crane", "magpie", "beaver"];
const STEP = 6;
const FIRST = 6;
const spotlight = Object.fromEntries(CAST.map((b, i) => [b, FIRST + STEP * i]));
const LAST_BACK = FIRST + STEP * (CAST.length - 1) + 5.4;

export const FILM = {
  name: "le-monde-de-krizaka",
  seconds: 44,
  fps: 30,
  /** The still the page shows before play (and under reduced motion): the five on the ridge, together. */
  poster: 36.6,
  aspects: { "16x9": [1920, 1080], "9x16": [1080, 1920], "4x5": [1080, 1350] },
  cast: CAST,
  family: FAMILY,
  spotlight,
  /** From the moment a bird is in front to the moment it is back in the row. */
  spotlightLength: 5.4,
  /** The loop's second the gesture is at when the bird arrives in front. */
  gestureLead: 0.4,
  /** The captions: EN/FR, the same words as krizaka.com's /story (the site renders its own WebVTT from its messages). */
  cues: [
    { id: "title", start: 0.6, end: 3.6, en: "The world of Krizaka.", fr: "Le monde de Krizaka." },
    { id: "falcon", start: spotlight.falcon + 0.2, end: spotlight.falcon + 4.8, en: "The falcon keeps watch: security comes first.", fr: "Le faucon veille : la sécurité d’abord." },
    { id: "owl", start: spotlight.owl + 0.2, end: spotlight.owl + 4.8, en: "The owl reads every page and knows every face.", fr: "Le hibou lit chaque page et reconnaît chaque visage." },
    { id: "duck", start: spotlight.duck + 0.2, end: spotlight.duck + 4.8, en: "The duck builds, line by line, in the open.", fr: "Le canard construit, ligne après ligne, en open source." },
    { id: "flamingo", start: spotlight.flamingo + 0.2, end: spotlight.flamingo + 4.8, en: "The flamingo answers, and the payment follows.", fr: "Le flamant répond, et le paiement suit." },
    { id: "pigeon", start: spotlight.pigeon + 0.2, end: spotlight.pigeon + 4.8, en: "The pigeon delivers, every time.", fr: "Le pigeon livre, à chaque fois." },
    { id: "together", start: LAST_BACK, end: LAST_BACK + 2.0, en: "Each bird carries a promise.", fr: "Chaque oiseau porte une promesse." },
    { id: "family", start: LAST_BACK + 2.2, end: LAST_BACK + 4.2, en: "And the family keeps growing.", fr: "Et la famille s’agrandit." },
  ],
  /** Where each bird stands and moves (seconds over the whole film). */
  actorTrack,
  sceneTracks,
  /** The music bed (ACE-Step through Orazaka's media worker): the prompt and the seed that made it. */
  music: {
    prompt: "warm whimsical cinematic underscore, gentle pizzicato strings, celesta and soft marimba, light woodwinds, warm pads, hopeful, premium brand film, unhurried, 92 bpm, instrumental",
    seed: 20261016,
    fadeIn: 1.5,
    fadeOut: 3,
  },
};

/** Per aspect: the actors' places and sizes, the spotlight, the ridge, the captions and the end card, in pixels. */
export function layout(aspect) {
  const [W, H] = FILM.aspects[aspect];
  const vertical = H > W;
  const portrait = aspect === "4x5";
  const A = portrait ? 210 : vertical ? 230 : 250;
  const feet = portrait ? 1180 : vertical ? 1600 : 900;
  const famFeet = feet - (vertical ? 16 : 14);
  const castX = vertical ? [0.11, 0.305, 0.5, 0.695, 0.89] : [0.2, 0.35, 0.5, 0.65, 0.8];
  const famX = vertical ? [0.215, 0.405, 0.595, 0.785] : [0.275, 0.425, 0.575, 0.725];
  const loops = birdLoops();
  /** The feet are at view y 108 of the bird's frame; its centre line at x 60. */
  const place = (bird, x, feetY, size) => {
    const v = loops[bird].view ?? DEFAULT_VIEW;
    const cx = x - ((60 - (v[0] + v[2] / 2)) / v[2]) * size;
    const cy = feetY - ((108 - v[1]) / v[3] - 0.5) * size;
    return { x: Math.round(cx), y: Math.round(cy), size, feetY, birdX: x };
  };
  const actors = {};
  CAST.forEach((b, i) => (actors[b] = place(b, castX[i] * W, feet, A)));
  FAMILY.forEach((b, i) => (actors[b] = place(b, famX[i] * W, famFeet, Math.round(A * 0.66))));
  const spotScale = vertical ? 2.3 : 2.0;
  const spotSize = A * spotScale;
  const ridgeY = feet + 6;
  return {
    W,
    H,
    actors,
    spotScale,
    spotSize,
    /** The centre of the bird in front (its feet on the ridge, in the middle). */
    spot: [W / 2, Math.round(feet - ((108 + 20) / 170 - 0.5) * spotSize)],
    hide: Math.round(A * 0.95),
    ridge: `M0 ${H} L0 ${ridgeY + 10} C${W * 0.22} ${ridgeY - 2} ${W * 0.4} ${ridgeY + 6} ${W * 0.5} ${ridgeY + 2} S${W * 0.82} ${ridgeY - 4} ${W} ${ridgeY + 8} L${W} ${H} Z`,
    ridgeEdge: `M0 ${ridgeY + 10} C${W * 0.22} ${ridgeY - 2} ${W * 0.4} ${ridgeY + 6} ${W * 0.5} ${ridgeY + 2} S${W * 0.82} ${ridgeY - 4} ${W} ${ridgeY + 8}`,
    caption: portrait ? 1270 : vertical ? 1790 : 1000,
    /** The valley is lifted a little, so the ridge where the birds stand is low in the frame. */
    world: vertical ? 1.2 : 1.18,
    /** The phoenix stands at the centre of the valley: behind the row in the wide frame, in the middle bird's way in the tall one. */
    phoenix: !vertical,
    captionSize: vertical ? 54 : 46,
    captionMax: vertical ? 940 : 1500,
    mark: vertical ? 440 : 380,
    word: vertical ? 112 : 100,
    tag: vertical ? 26 : 22,
    endGap: vertical ? 26 : 18,
  };
}

const T = (x, y, s = 1, z = 1) => `transform:translate(${Math.round(x)}px,${Math.round(y)}px) scale(${s});z-index:${z}`;

/** One bird's path through the film: up on the ridge, in front at its moment, a hop with the others; the family pops in. */
export function actorTrack(bird, L) {
  const a = L.actors[bird];
  const i = CAST.indexOf(bird);
  if (i < 0) {
    const j = FAMILY.indexOf(bird);
    const t = LAST_BACK + 2.2 + 0.22 * j;
    return [[0, `transform:translateY(12px) scale(0);z-index:0`], [t, `transform:translateY(12px) scale(0);z-index:0`, POP], [t + 0.5, `transform:translateY(0) scale(1);z-index:0`], [FILM.seconds, `transform:translateY(0) scale(1);z-index:0`]];
  }
  const e = 2.6 + 0.32 * i;
  const s = FILM.spotlight[bird];
  const back = s + FILM.spotlightLength;
  const dx = L.spot[0] - a.x;
  const dy = L.spot[1] - a.y;
  const hopAt = LAST_BACK + 0.4;
  return [
    [0, T(0, L.hide)],
    [e, T(0, L.hide), OUT],
    [e + 0.45, T(0, -24), FALL],
    [e + 0.7, T(0, 0), EASE],
    [e + 0.8, T(0, -3), EASE],
    [e + 0.9, T(0, 0)],
    [s - 0.62, T(0, 0)],
    [s - 0.6, T(0, 0, 1, 6), EASE],
    [s, T(dx, dy, L.spotScale, 6)],
    [back - 0.5, T(dx, dy, L.spotScale, 6), EASE],
    [back, T(0, 0, 1, 6)],
    [back + 0.02, T(0, 0)],
    [hopAt, T(0, 0), OUT],
    [hopAt + 0.25, T(0, -26), FALL],
    [hopAt + 0.5, T(0, 0), EASE],
    [hopAt + 0.6, T(0, -3), EASE],
    [hopAt + 0.7, T(0, 0)],
    [FILM.seconds, T(0, 0)],
  ];
}

/** The scene around the birds: the push-in on the valley, the sweeps, the spotlight's dimming and glow, the end card. */
export function sceneTracks(L) {
  const w = (k) => `transform:scale(${+(L.world * k).toFixed(4)})`;
  const end = LAST_BACK + 4.0;
  const glows = CAST.map((b) => {
    const s = FILM.spotlight[b];
    return [`.bf-glow-${b}`, [[0, "opacity:0"], [s - 0.6, "opacity:0", EASE], [s, "opacity:1"], [s + FILM.spotlightLength - 0.6, "opacity:1", EASE], [s + FILM.spotlightLength, "opacity:0"]]];
  });
  return [
    [".bf-world", [[0, w(1.08), EASE], [8, w(1)], [LAST_BACK, w(1), EASE], [end + 0.8, w(1.04)]]],
    [".bf-sweep", [[0, "transform:translateX(-110%)"], [0.8, "transform:translateX(-110%)", EASE], [2.8, "transform:translateX(110%)"]]],
    [".bf-scrim", [[0, "opacity:0"], [FIRST - 0.7, "opacity:0", EASE], [FIRST - 0.1, "opacity:1"], [LAST_BACK - 0.5, "opacity:1", EASE], [LAST_BACK + 0.1, "opacity:0"]]],
    ...glows,
    [".bf-end", [[0, "opacity:0"], [end - 0.6, "opacity:0", EASE], [end + 0.4, "opacity:1"]]],
    [".bf-mark", [[0, "opacity:0;transform:scale(.92)"], [end + 0.1, "opacity:0;transform:scale(.92)", OUT], [end + 1.1, "opacity:1;transform:scale(1)"]]],
    [".bf-mark path[pathLength]", [[0, "stroke-dashoffset:1"], [end + 0.2, "stroke-dashoffset:1", EASE], [end + 1.6, "stroke-dashoffset:0"]]],
    [".bf-word", [[0, "opacity:0;transform:translateY(16px)"], [end + 1.3, "opacity:0;transform:translateY(16px)", OUT], [end + 2.1, "opacity:1;transform:translateY(0)"]]],
    [".bf-tag", [[0, "opacity:0;transform:translateY(10px)"], [end + 1.8, "opacity:0;transform:translateY(10px)", OUT], [end + 2.6, "opacity:1;transform:translateY(0)"]]],
    [".bf-endsweep", [[0, "transform:translateX(-110%)"], [end + 2.6, "transform:translateX(-110%)", EASE], [end + 3.8, "transform:translateX(110%)"]]],
  ];
}

/** WebVTT of the cues in one language. */
export function vtt(lang, cues = FILM.cues) {
  const ts = (t) => {
    const ms = Math.round(t * 1000);
    const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}.${String(ms % 1000).padStart(3, "0")}`;
  };
  return `WEBVTT\n\n${cues.map((c) => `${c.id}\n${ts(c.start)} --> ${ts(c.end)}\n${c[lang]}\n`).join("\n")}`;
}

/**
 * The home's ambient loop: the same valley and flock, no text, no spotlight — the birds breathe and blink, each one in
 * turn makes a small gesture (a hop, a wave), a light crosses the valley once. Seamless over `seconds`; the valley's
 * own loops are held still (their periods do not divide the loop), so only the birds and the light move.
 */
export const AMBIENT = {
  name: "home-ambient",
  seconds: 12,
  fps: 30,
  /** Where the page shows it: 16:9 on wide screens, 4:5 on phones. Encoded smaller than the stage (it is a backdrop). */
  aspects: { "16x9": [1280, 720], "4x5": [720, 900] },
  /** The still before play and under reduced motion / Save-Data: the five on the ridge, at rest. */
  poster: 0,
  /** Each bird's turn: its second in the loop. */
  turns: Object.fromEntries(CAST.map((b, i) => [b, 0.8 + 2.3 * i])),
  sweep: [7.6, 10.4],
};

/** The idle life of the loops (8 s) stretched to another period (the ambient's 12 s). */
export const stretch = (stops, k) => stops.map(([t, d, e]) => [+(t * k).toFixed(3), d, e]);

/** A bird's small gesture in the ambient loop: a hop and a wave of the right wing at `t`. */
export function ambientGesture(t) {
  return [
    [".bf-move", [[0, "transform:translateY(0)"], [t, "transform:translateY(0)", OUT], [t + 0.22, "transform:translateY(-7px)", FALL], [t + 0.44, "transform:translateY(0)", EASE], [t + 0.56, "transform:translateY(-1px)", EASE], [t + 0.7, "transform:translateY(0)"]]],
    [".kzb-wing-r", [[0, "transform:rotate(0deg)"], [t + 0.1, "transform:rotate(0deg)", EASE], [t + 0.4, "transform:rotate(-30deg)", EASE], [t + 0.7, "transform:rotate(-12deg)", EASE], [t + 1.0, "transform:rotate(-28deg)", EASE], [t + 1.4, "transform:rotate(0deg)"]]],
  ];
}
