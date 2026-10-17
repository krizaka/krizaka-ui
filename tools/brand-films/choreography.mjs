// The choreography of the brand films: what each bird of the flock does in its loop, as data. The birds are never
// redrawn here — `Mascot` (@krizaka/ui) draws them; this file only moves the parts the component already names
// (`.kzb-bird`, `.kzb-wing`, `.kzb-wing-r`, `.kzb-eye`) and adds the props of each promise (a page, blocks, a parcel's
// doorstep…) on the mascot's own 120 × 120 grid, in the bird's own colours (OWN_PALETTES, read from the source).
//
// A track is a selector and its stops in SECONDS of the loop: [time, "css declarations", easing-to-the-next-stop?].
// The builder closes every track on its first stop, so a loop always ends where it began (seamless by construction).
// Idle life (breathe, blink, ruffle) animates the individual transform properties (`scale`, `rotate`, `translate`);
// the gestures animate `transform`: the two compose, so a gesture never cancels the idle life.
import { MOOD_PARTS, OWN_PALETTES } from "../../packages/ui/src/mascots/geometry.ts";

export const LOOP = { seconds: 8, fps: 30 };

export const EASE = "cubic-bezier(.45,0,.55,1)";
export const OUT = "cubic-bezier(.22,1,.36,1)";
export const POP = "cubic-bezier(.34,1.56,.64,1)";
export const FALL = "cubic-bezier(.55,0,1,.45)";

/** The outline every mascot part is drawn with (the component's own role). */
export const LINE = "var(--kz-border-strong, rgba(127,127,140,.5))";
const PAPER = "#ffffff";
const INK = "#cbd5e1";
const SUCCESS = "var(--kz-success)";
const SURFACE = "var(--kz-surface-0)";
const GOLD = ["#fbbf24", "#f59e0b", "#b45309"];

/** The five-point star the props use (coins, the podium), centred on (cx, cy). */
export function star(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${+(cx + rr * Math.cos(a)).toFixed(2)} ${+(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** A heart of width ~2r centred on (cx, cy). */
export const heart = (cx, cy, r) =>
  `M${cx} ${cy + r * 0.9} C${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.9} ${cy - r * 1.3} ${cx} ${cy - r * 0.45} C${cx + r * 0.9} ${cy - r * 1.3} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r * 0.9} Z`;

const badge = (cls = "bf-badge") => {
  const b = MOOD_PARTS.badge;
  return `<g class="${cls} bf-pop"><circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="${SUCCESS}"/><path d="${MOOD_PARTS.check}" stroke="${SURFACE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
};
const sparkles = (fill) => MOOD_PARTS.sparkles.map((d, i) => `<path class="bf-spark bf-spark-${i} bf-pop" d="${d}" fill="${fill}"/>`).join("");

/** A pop in at `t`, held, gone at `end` (scale, from the element's centre — `.bf-pop`). */
export const popTrack = (sel, t, end, d = 0.45) => [sel, [[0, "transform:scale(0)"], [t, "transform:scale(0)", POP], [t + d, "transform:scale(1)"], [end - 0.5, "transform:scale(1)", EASE], [end, "transform:scale(0)"]]];
/** Two sparkles that twinkle between `t` and `end` (the second a beat later). */
function twinkle(t, end) {
  return [0, 1].map((i) => {
    const a = t + 0.3 * i;
    const d = (end - a) / 4;
    const on = "opacity:1;transform:scale(1)";
    const dim = "opacity:.3;transform:scale(.7)";
    const off = "opacity:0;transform:scale(.6)";
    return [`.bf-spark-${i}`, [[0, off], [a, off, EASE], [a + d, on, EASE], [a + 2 * d, dim, EASE], [a + 3 * d, on, EASE], [end, off]]];
  });
}
/** Quick wingbeats: `angle` and back to `rest`, every `period` seconds between `from` and about `to`. */
export function flaps(from, to, period, angle, rest = 0) {
  const r = (a) => `transform:rotate(${a}deg)`;
  const out = [[0, r(rest)], [from, r(rest), EASE]];
  let t = from;
  let up = true;
  while (t + period / 2 <= to) {
    t += period / 2;
    out.push([+t.toFixed(3), r(up ? angle : rest), EASE]);
    up = !up;
  }
  if (!up) out.push([+(t + period / 2).toFixed(3), r(rest)]);
  return out;
}
/** A hop of the whole bird at `t` (`.bf-move`). */
const hop = (t, h = 6) => [[0, "transform:translateY(0)"], [t, "transform:translateY(0)", OUT], [t + 0.22, `transform:translateY(-${h}px)`, FALL], [t + 0.44, "transform:translateY(0)", EASE], [t + 0.56, "transform:translateY(-1px)", EASE], [t + 0.7, "transform:translateY(0)"]];

/** The idle life every bird has in every film: it breathes, blinks twice and ruffles its wings. */
export const IDLE = [
  [".kzb-bird", [[0, "scale:1 1;translate:0 0", EASE], [2, "scale:1.012 1.028;translate:0 -1px", EASE], [4, "scale:1 1;translate:0 0", EASE], [6, "scale:1.01 1.024;translate:0 -.8px", EASE]]],
  [".kzb-eye", [[0, "scale:1 1"], [2.3, "scale:1 1"], [2.38, "scale:1 .1"], [2.48, "scale:1 1"], [6.55, "scale:1 1"], [6.63, "scale:1 .1"], [6.73, "scale:1 1"]]],
  [".kzb-wing:not(.kzb-wing-r)", [[0, "rotate:0deg", EASE], [2, "rotate:3deg", EASE], [4, "rotate:0deg", EASE], [6, "rotate:2deg", EASE]]],
  [".kzb-wing-r", [[0, "rotate:0deg", EASE], [2.2, "rotate:-3deg", EASE], [4.2, "rotate:0deg", EASE], [6.2, "rotate:-2deg", EASE]]],
];

const PUPILS = ".kzb-eye > circle:not(:first-child)";

/**
 * Each bird's promise as a gesture (AGENTS §4.1 of krizaka-com: the bird carries a promise, never decoration).
 * `back` is drawn behind the bird, `inner` moves with it (what it holds), `outer` stays on the ground in front.
 * `view`: the square of the grid the loop frames (the bird's 120 grid plus room for its props).
 * `poster`: the second the still image is taken at (the promise kept: the check, the stack, the parcel delivered).
 */
export function birdLoops() {
  const P = OWN_PALETTES;
  return {
    falcon: {
      promise: "watch",
      poster: 5.4,
      outer: `<g class="bf-acc bf-frame"><path d="M98 58 V50 H106 M126 50 H134 V58 M134 82 V90 H126 M106 90 H98 V82" stroke="${P.falcon.eye}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path class="bf-scan" d="M101 52 H131" stroke="${P.falcon.eye}" stroke-width="1.6" stroke-linecap="round"/></g>
<g class="bf-acc bf-shield bf-pop"><path d="M116 57 L127 61 V70 C127 77 122 82 116 84 C110 82 105 77 105 70 V61 Z" fill="${P.falcon.from}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/><path class="bf-draw" pathLength="1" d="M110.5 70.5 L114.5 74.5 L121.5 66" stroke="${SURFACE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`,
      tracks: [
        [".bf-move", [[0, "transform:rotate(0deg)"], [0.6, "transform:rotate(0deg)", EASE], [1.3, "transform:rotate(-2deg)"], [1.9, "transform:rotate(-2deg)", EASE], [2.7, "transform:rotate(2.5deg)"], [4.7, "transform:rotate(2.5deg)", EASE], [5.5, "transform:rotate(0deg)"]]],
        [".kzb-eye", [[0, "transform:translate(0,0)"], [0.6, "transform:translate(0,0)", EASE], [1.2, "transform:translate(-6px,0)"], [1.9, "transform:translate(-6px,0)", EASE], [2.6, "transform:translate(6px,0)"], [4.7, "transform:translate(6px,0)", EASE], [5.3, "transform:translate(0,0)"]]],
        [".bf-frame", [[0, "opacity:0"], [2.4, "opacity:0", EASE], [2.9, "opacity:1"], [6.8, "opacity:1", EASE], [7.5, "opacity:0"]]],
        [".bf-scan", [[0, "transform:translateY(0);opacity:0"], [2.8, "transform:translateY(0);opacity:0"], [2.9, "transform:translateY(0);opacity:1", EASE], [3.7, "transform:translateY(36px);opacity:1", EASE], [4.4, "transform:translateY(0);opacity:1"], [4.5, "transform:translateY(0);opacity:0"]]],
        popTrack(".bf-shield", 4.4, 7.5),
        [".bf-draw", [[0, "stroke-dashoffset:1"], [4.7, "stroke-dashoffset:1", OUT], [5.2, "stroke-dashoffset:0"], [7.5, "stroke-dashoffset:0"]]],
      ],
    },
    owl: {
      promise: "read",
      poster: 5.6,
      inner: `<g class="bf-acc bf-page"><path d="M36 66 H76 L84 74 V104 H36 Z" fill="${PAPER}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/><path d="M76 66 V74 H84" fill="#f1f5f9" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/>
${["M42 76 H70", "M42 83 H78", "M42 90 H78", "M42 97 H64"].map((d) => `<path d="${d}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`).join("")}
${["M42 76 H70", "M42 83 H78", "M42 90 H78", "M42 97 H64"].map((d, i) => `<path class="bf-draw bf-l${i}" pathLength="1" d="${d}" stroke="${P.owl.to}" stroke-width="2.4" stroke-linecap="round"/>`).join("")}
<g class="bf-stamp bf-pop"><circle cx="74" cy="96" r="6" fill="${SUCCESS}"/><path d="M71 96 L73.2 98.2 L77 93.8" stroke="${SURFACE}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`,
      outer: `<g class="bf-acc">${badge()}${sparkles(P.owl.from)}</g>`,
      tracks: [
        [PUPILS, [[0, "transform:translate(0,0)"], [0.4, "transform:translate(0,0)", EASE], [0.7, "transform:translate(-3.5px,2px)"], [1.5, "transform:translate(3.5px,2px)", EASE], [1.7, "transform:translate(-3.5px,2.8px)"], [2.5, "transform:translate(3.5px,2.8px)", EASE], [2.7, "transform:translate(-3.5px,3.6px)"], [3.5, "transform:translate(3.5px,3.6px)", EASE], [3.7, "transform:translate(-3.5px,4.4px)"], [4.5, "transform:translate(2px,4.4px)", EASE], [5.0, "transform:translate(0,-1px)"], [6.8, "transform:translate(0,-1px)", EASE], [7.3, "transform:translate(0,0)"]]],
        ...[0, 1, 2, 3].map((i) => [`.bf-l${i}`, [[0, "stroke-dashoffset:1"], [0.7 + i, "stroke-dashoffset:1"], [(i === 3 ? 4.5 : 1.5 + i), "stroke-dashoffset:0"], [6.8, "stroke-dashoffset:0", EASE], [7.4, "stroke-dashoffset:1"]]]),
        [".kzb-eye", [[0, "transform:scale(1,1)"], [4.9, "transform:scale(1,1)", EASE], [5.2, "transform:scale(1,.6)"], [6.4, "transform:scale(1,.6)", EASE], [6.8, "transform:scale(1,1)"]]],
        popTrack(".bf-stamp", 4.7, 7.3, 0.35),
        popTrack(".bf-badge", 5.0, 7.3),
        ...twinkle(5.0, 6.8),
        [".bf-move", hop(5.0, 5)],
      ],
    },
    duck: {
      promise: "build",
      poster: 5.0,
      outer: `<g class="bf-acc"><ellipse class="bf-stack-shadow" cx="115" cy="108" rx="14" ry="2.5" fill="#000" opacity=".14"/>
${[
  ["bf-b0", 93, P.duck.from, "&lt;/&gt;"],
  ["bf-b1", 79, P.duck.wing, "{ }"],
  ["bf-b2", 65, P.duck.detail, "fn"],
]
  .map(([cls, y, fill, glyph]) => `<g class="${cls}"><rect x="104" y="${y}" width="22" height="14" rx="3" fill="${fill}" stroke="${LINE}" stroke-width="1.4"/><text x="115" y="${y + 9.6}" text-anchor="middle" font-size="7" font-weight="700" fill="#fff" style="font-family:var(--kz-font-mono)">${glyph}</text></g>`)
  .join("")}
<rect class="bf-glow" x="100.5" y="61.5" width="29" height="49" rx="5" stroke="${P.duck.beak}" stroke-width="1.6" fill="none"/><path class="bf-spark bf-spark-0 bf-pop" d="${star(132, 58, 4)}" fill="${P.duck.beak}"/><path class="bf-spark bf-spark-1 bf-pop" d="${star(98, 66, 2.6)}" fill="${P.duck.beak}"/></g>`,
      tracks: [
        ...[0, 1, 2].map((k) => {
          const s = 0.8 + 1.2 * k;
          return [`.bf-b${k}`, [[0, "transform:translateY(-70px);opacity:0"], [s, "transform:translateY(-70px);opacity:0", FALL], [s + 0.05, "transform:translateY(-66px);opacity:1", FALL], [s + 0.45, "transform:translateY(0);opacity:1", OUT], [s + 0.55, "transform:translateY(-3px);opacity:1", EASE], [s + 0.65, "transform:translateY(0);opacity:1"], [6.6, "transform:translateY(0);opacity:1", EASE], [7.4, "transform:translateY(4px);opacity:0"]]];
        }),
        [".kzb-wing-r", [[0, "transform:rotate(0deg)"], ...[0, 1, 2].flatMap((k) => { const s = 0.8 + 1.2 * k; return [[s + 0.2, "transform:rotate(0deg)", EASE], [s + 0.42, "transform:rotate(-26deg)", EASE], [s + 0.75, "transform:rotate(0deg)"]]; })]],
        [".kzb-eye", [[0, "transform:translate(0,0)"], [0.5, "transform:translate(0,0)", EASE], [0.8, "transform:translate(2.4px,-1.2px)", EASE], [1.3, "transform:translate(2.4px,.8px)", EASE], [2.0, "transform:translate(2.4px,-1.2px)", EASE], [2.5, "transform:translate(2.4px,.6px)", EASE], [3.2, "transform:translate(2.4px,-1.4px)", EASE], [3.7, "transform:translate(2.4px,.4px)", EASE], [4.4, "transform:translate(0,0)"]]],
        [".bf-glow", [[0, "opacity:0"], [4.4, "opacity:0", EASE], [4.7, "opacity:1"], [6.3, "opacity:1", EASE], [6.8, "opacity:0"]]],
        [".bf-stack-shadow", [[0, "opacity:0"], [1.1, "opacity:0", EASE], [1.3, "opacity:1"], [6.6, "opacity:1", EASE], [7.4, "opacity:0"]]],
        [".bf-move", hop(4.4, 6)],
        ...twinkle(4.5, 6.6),
      ],
    },
    flamingo: {
      promise: "answer",
      poster: 5.3,
      outer: `<g class="bf-acc"><g class="bf-q bf-pop"><path d="M84 6 H126 Q132 6 132 12 V26 Q132 32 126 32 H122 L128 39 L114 32 H84 Q78 32 78 26 V12 Q78 6 84 6 Z" fill="var(--kz-surface-1)" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/><text x="105" y="25" text-anchor="middle" font-size="17" font-weight="800" fill="var(--kz-text-secondary)" style="font-family:var(--kz-font-display)">?</text></g>
<g class="bf-a bf-pop"><path d="M-16 -16 H26 Q32 -16 32 -10 V2 Q32 8 26 8 H24 L22 15 L16 8 H-16 Q-22 8 -22 2 V-10 Q-22 -16 -16 -16 Z" fill="${P.flamingo.from}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/>
<g class="bf-dots">${[-6, 5, 16].map((x, i) => `<circle class="bf-d${i} bf-pop" cx="${x}" cy="-4" r="2.4" fill="#fff"/>`).join("")}</g>
<path class="bf-draw bf-r0" pathLength="1" d="M-14 -8 H24" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path class="bf-draw bf-r1" pathLength="1" d="M-14 0 H10" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>
<ellipse class="bf-coin-shadow bf-pop" cx="104" cy="109" rx="8" ry="1.8" fill="#000" opacity=".16"/>
<g class="bf-coin"><g class="bf-coin-face bf-pop"><circle cx="104" cy="98" r="9" fill="${GOLD[0]}" stroke="${GOLD[2]}" stroke-width="1.4"/><circle cx="104" cy="98" r="6.4" stroke="#fde68a" stroke-width="1.2" fill="none"/><path d="${star(104, 98.4, 4.2)}" fill="${GOLD[2]}"/></g></g>
${sparkles(GOLD[0])}</g>`,
      tracks: [
        popTrack(".bf-q", 0.4, 4.0, 0.4),
        popTrack(".bf-a", 1.6, 7.4, 0.4),
        [".bf-dots", [[0, "opacity:0"], [1.8, "opacity:0"], [1.85, "opacity:1"], [2.9, "opacity:1", EASE], [3.0, "opacity:0"]]],
        ...[0, 1, 2].map((i) => [`.bf-d${i}`, [[0, "transform:scale(1)"], [1.85 + 0.12 * i, "transform:scale(1)", EASE], [2.1 + 0.12 * i, "transform:scale(1.35)", EASE], [2.35 + 0.12 * i, "transform:scale(1)", EASE], [2.6 + 0.12 * i, "transform:scale(1.35)", EASE], [2.85 + 0.12 * i, "transform:scale(1)"]]]),
        [".bf-r0", [[0, "stroke-dashoffset:1"], [3.0, "stroke-dashoffset:1", OUT], [3.4, "stroke-dashoffset:0"], [7.4, "stroke-dashoffset:0"]]],
        [".bf-r1", [[0, "stroke-dashoffset:1"], [3.25, "stroke-dashoffset:1", OUT], [3.6, "stroke-dashoffset:0"], [7.4, "stroke-dashoffset:0"]]],
        [".bf-coin", [[0, "transform:translateY(-118px);opacity:0"], [4.0, "transform:translateY(-118px);opacity:0", FALL], [4.05, "transform:translateY(-112px);opacity:1", FALL], [4.55, "transform:translateY(0);opacity:1", OUT], [4.72, "transform:translateY(-7px);opacity:1", FALL], [4.9, "transform:translateY(0);opacity:1"], [6.8, "transform:translateY(0);opacity:1", EASE], [7.4, "transform:translateY(0);opacity:0"]]],
        [".bf-coin-face", [[0, "transform:scale(1,1)"], [4.05, "transform:scale(1,1)", EASE], [4.2, "transform:scale(.12,1)", EASE], [4.35, "transform:scale(1,1)", EASE], [4.5, "transform:scale(.12,1)", EASE], [4.65, "transform:scale(1,1)"]]],
        popTrack(".bf-coin-shadow", 4.3, 7.4, 0.3),
        [".kzb-wing-r", [[0, "transform:rotate(0deg)"], [4.85, "transform:rotate(0deg)", POP], [5.15, "transform:rotate(-26deg)", EASE], [5.5, "transform:rotate(-8deg)", EASE], [5.75, "transform:rotate(-22deg)", EASE], [6.2, "transform:rotate(0deg)"]]],
        [PUPILS, [[0, "transform:translate(0,0)"], [0.5, "transform:translate(0,0)", EASE], [0.8, "transform:translate(1.2px,-.4px)"], [1.5, "transform:translate(1.2px,-.4px)", EASE], [1.8, "transform:translate(-1px,-.8px)"], [3.8, "transform:translate(-1px,-.8px)", EASE], [4.2, "transform:translate(1px,1.2px)"], [5.4, "transform:translate(1px,1.2px)", EASE], [6.0, "transform:translate(0,0)"]]],
        ...twinkle(4.9, 6.8),
      ],
    },
    pigeon: {
      promise: "deliver",
      poster: 4.9,
      back: `<g class="bf-acc bf-trail">${["M-14 50 H6", "M-20 61 H0", "M-12 72 H8"].map((d) => `<path d="${d}" stroke="${P.pigeon.from}" stroke-width="2.4" stroke-linecap="round"/>`).join("")}</g>`,
      outer: `<g class="bf-acc"><rect class="bf-mat bf-pop" x="34" y="119" width="52" height="5" rx="2.5" fill="${P.pigeon.detail}" opacity=".55"/>${badge()}${sparkles(P.pigeon.from)}</g>`,
      tracks: [
        [".bf-move", [[0, "transform:translate(0,0)"], [0.9, "transform:translate(0,0)", EASE], [1.3, "transform:translate(0,3px)", OUT], [1.75, "transform:translate(-2px,-16px)", EASE], [2.25, "transform:translate(2px,-13px)", EASE], [2.75, "transform:translate(5px,-17px)", EASE], [3.2, "transform:translate(2px,-14px)", EASE], [3.8, "transform:translate(0,0)", EASE], [3.95, "transform:translate(0,2px)", EASE], [4.1, "transform:translate(0,0)"]]],
        [".bf-shadow", [[0, "transform:scale(1);opacity:1"], [1.3, "transform:scale(1);opacity:1", EASE], [1.75, "transform:scale(.6);opacity:.5"], [3.2, "transform:scale(.6);opacity:.5", EASE], [3.8, "transform:scale(1);opacity:1"]]],
        [".kzb-wing:not(.kzb-wing-r)", flaps(1.3, 3.75, 0.36, 38)],
        [".kzb-wing-r", flaps(1.3, 3.75, 0.36, -38)],
        [".bf-trail", [[0, "opacity:0;transform:translateX(0)"], [1.8, "opacity:0;transform:translateX(0)", EASE], [2.2, "opacity:.8;transform:translateX(4px)", EASE], [2.8, "opacity:.5;transform:translateX(-2px)", EASE], [3.3, "opacity:.8;transform:translateX(4px)", EASE], [3.7, "opacity:0;transform:translateX(0)"]]],
        popTrack(".bf-mat", 3.6, 7.4, 0.35),
        popTrack(".bf-badge", 4.2, 7.2),
        ...twinkle(4.3, 6.6),
      ],
    },
    lovebird: {
      promise: "introduce",
      poster: 3.5,
      outer: `<g class="bf-acc">${[
        ["bf-p0", 14, P.lovebird.from],
        ["bf-p1", 106, P.lovebird.detail],
      ]
        .map(([cls, x, fill]) => `<g class="${cls}"><circle cx="${x}" cy="4" r="6.5" fill="${fill}" stroke="${LINE}" stroke-width="1.4"/><path d="M${x - 10} 22 C${x - 10} 13 ${x + 10} 13 ${x + 10} 22 Z" fill="${fill}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/></g>`)
        .join("")}<g class="bf-heart bf-pop"><path d="${heart(60, 0, 7)}" fill="${P.lovebird.detail}" stroke="${LINE}" stroke-width="1.4" stroke-linejoin="round"/></g>${sparkles(P.lovebird.from)}</g>`,
      tracks: [
        [".bf-p0", [[0, "transform:translate(-26px,10px);opacity:0"], [0.7, "transform:translate(-26px,10px);opacity:0", OUT], [2.5, "transform:translate(12px,0);opacity:1"], [6.8, "transform:translate(12px,0);opacity:1", EASE], [7.4, "transform:translate(12px,0);opacity:0"]]],
        [".bf-p1", [[0, "transform:translate(26px,10px);opacity:0"], [0.9, "transform:translate(26px,10px);opacity:0", OUT], [2.6, "transform:translate(-12px,0);opacity:1"], [6.8, "transform:translate(-12px,0);opacity:1", EASE], [7.4, "transform:translate(-12px,0);opacity:0"]]],
        [".bf-heart", [[0, "transform:scale(0)"], [2.7, "transform:scale(0)", POP], [3.1, "transform:scale(1)", EASE], [3.35, "transform:scale(1.18)", EASE], [3.6, "transform:scale(1)", EASE], [3.85, "transform:scale(1.18)", EASE], [4.1, "transform:scale(1)"], [6.8, "transform:scale(1)", EASE], [7.3, "transform:scale(0)"]]],
        [".kzb-wing-r", [[0, "transform:rotate(0deg)"], [2.7, "transform:rotate(0deg)", EASE], [3.0, "transform:rotate(-32deg)", EASE], [3.3, "transform:rotate(-14deg)", EASE], [3.6, "transform:rotate(-32deg)", EASE], [4.0, "transform:rotate(0deg)"]]],
        [PUPILS, [[0, "transform:translate(0,0)"], [0.7, "transform:translate(0,0)", EASE], [1.0, "transform:translate(-1.8px,-1px)"], [1.5, "transform:translate(-1.8px,-1px)", EASE], [1.8, "transform:translate(1.8px,-1px)"], [2.3, "transform:translate(1.8px,-1px)", EASE], [2.6, "transform:translate(0,-1.6px)"], [4.4, "transform:translate(0,-1.6px)", EASE], [4.8, "transform:translate(0,0)"]]],
        [".bf-move", hop(2.8, 5)],
        ...twinkle(3.0, 6.0),
      ],
    },
    crane: {
      promise: "listen",
      poster: 3.0,
      back: `<g class="bf-acc">${[0, 1, 2].map((i) => `<path class="bf-w${i}" d="M-6 ${10 - i * 2} Q4 ${21} -6 ${32 + i * 2}" stroke="${P.crane.to}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`).join("")}</g>`,
      outer: `<g class="bf-acc">${MOOD_PARTS.dots.map(([cx, cy, r], i) => `<circle class="bf-c${i} bf-pop" cx="${cx}" cy="${cy}" r="${r}" fill="var(--kz-text-secondary)"/>`).join("")}</g>`,
      tracks: [
        ...[0, 1, 2].map((i) => {
          const a = 0.8 + 0.35 * i;
          const b = 2.3 + 0.35 * i;
          return [`.bf-w${i}`, [[0, "transform:translateX(0);opacity:0"], [a, "transform:translateX(0);opacity:0", "linear"], [a + 0.3, "transform:translateX(7px);opacity:.9", "linear"], [a + 1.1, "transform:translateX(26px);opacity:0"], [b, "transform:translateX(0);opacity:0", "linear"], [b + 0.3, "transform:translateX(7px);opacity:.9", "linear"], [b + 1.1, "transform:translateX(26px);opacity:0"]]];
        }),
        [".bf-move", [[0, "transform:rotate(0deg)"], [1.0, "transform:rotate(0deg)", EASE], [1.8, "transform:rotate(-2.5deg)"], [4.0, "transform:rotate(-2.5deg)", EASE], [4.8, "transform:rotate(0deg)"]]],
        [".kzb-eye", [[0, "transform:scale(1,1)"], [2.0, "transform:scale(1,1)", EASE], [2.3, "transform:scale(1,.12)"], [3.6, "transform:scale(1,.12)", EASE], [3.9, "transform:scale(1,1)"]]],
        ...[0, 1, 2].map((i) => popTrack(`.bf-c${i}`, 4.2 + 0.3 * i, 7.2, 0.35)),
      ],
    },
    magpie: {
      promise: "score",
      poster: 3.5,
      view: [-12, -20, 170, 170],
      outer: `<g class="bf-acc">${[
        ["bf-bar0", 112, 92, 16, P.magpie.wing],
        ["bf-bar1", 124, 80, 28, GOLD[0]],
        ["bf-bar2", 136, 98, 10, P.magpie.from],
      ]
        .map(([cls, x, y, h, fill]) => `<rect class="${cls} bf-rise" x="${x}" y="${y}" width="12" height="${h}" rx="1.5" fill="${fill}" stroke="${LINE}" stroke-width="1.4"/>`)
        .join("")}<g class="bf-star"><path d="${star(130, 72, 7)}" fill="${GOLD[0]}" stroke="${GOLD[2]}" stroke-width="1.2" stroke-linejoin="round"/></g>${sparkles(GOLD[0])}</g>`,
      tracks: [
        ...[0, 1, 2].map((i) => [`.bf-bar${i}`, [[0, "transform:scaleY(0)"], [0.8 + 0.35 * i, "transform:scaleY(0)", POP], [1.3 + 0.35 * i, "transform:scaleY(1)"], [6.8, "transform:scaleY(1)", EASE], [7.4, "transform:scaleY(0)"]]]),
        [".bf-star", [[0, "transform:translateY(-90px) rotate(-90deg);opacity:0"], [2.3, "transform:translateY(-90px) rotate(-90deg);opacity:0", FALL], [2.35, "transform:translateY(-84px) rotate(-80deg);opacity:1", FALL], [2.8, "transform:translateY(0) rotate(0deg);opacity:1", OUT], [2.95, "transform:translateY(-5px) rotate(0deg);opacity:1", FALL], [3.1, "transform:translateY(0) rotate(0deg);opacity:1"], [6.8, "transform:translateY(0) rotate(0deg);opacity:1", EASE], [7.3, "transform:translateY(0) rotate(0deg);opacity:0"]]],
        [PUPILS, [[0, "transform:translate(0,0)"], [0.6, "transform:translate(0,0)", EASE], [0.9, "transform:translate(2px,1px)"], [2.2, "transform:translate(2px,1px)", EASE], [2.5, "transform:translate(2px,-1.6px)", EASE], [2.85, "transform:translate(2px,.4px)"], [4.4, "transform:translate(2px,.4px)", EASE], [4.8, "transform:translate(0,0)"]]],
        [".bf-move", hop(3.1, 6)],
        [".kzb-wing-r", [[0, "transform:rotate(0deg)"], [3.1, "transform:rotate(0deg)", EASE], [3.35, "transform:rotate(-24deg)", EASE], [3.8, "transform:rotate(0deg)"]]],
        ...twinkle(3.1, 6.2),
      ],
    },
    beaver: {
      promise: "shop",
      poster: 3.7,
      view: [-12, -20, 170, 170],
      outer: `<g class="bf-acc"><g class="bf-receipt"><rect x="121" y="50" width="20" height="38" fill="${PAPER}" stroke="${LINE}" stroke-width="1.4"/>${["M125 57 H137", "M125 63 H134", "M125 69 H137", "M125 75 H131"].map((d) => `<path d="${d}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`).join("")}<path d="M125 82 H137" stroke="${P.beaver.to}" stroke-width="2.6" stroke-linecap="round"/></g>
<rect x="114" y="86" width="34" height="22" rx="3" fill="${P.beaver.wing}" stroke="${LINE}" stroke-width="1.4"/><rect x="118" y="91" width="16" height="7" rx="1.5" fill="#0f172a"/><path d="M120 94.5 H131" stroke="${P.beaver.beak}" stroke-width="1.4" stroke-linecap="round"/>${[0, 1, 2].map((i) => `<circle cx="${120 + i * 5}" cy="103" r="1.6" fill="#fde68a"/>`).join("")}<rect x="119" y="85" width="24" height="3" rx="1.5" fill="#000" opacity=".35"/>
<g class="bf-stamp bf-pop"><circle cx="137" cy="58" r="6" fill="${SUCCESS}"/><path d="M134 58 L136.2 60.2 L140 55.8" stroke="${SURFACE}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`,
      tracks: [
        [".bf-receipt", [[0, "transform:scaleY(0)"], [0.9, "transform:scaleY(0)", EASE], [1.3, "transform:scaleY(.3)"], [1.6, "transform:scaleY(.3)", EASE], [2.0, "transform:scaleY(.62)"], [2.3, "transform:scaleY(.62)", EASE], [2.8, "transform:scaleY(1)"], [6.8, "transform:scaleY(1)", EASE], [7.5, "transform:scaleY(0)"]]],
        [".kzb-wing-r", [[0, "transform:rotate(0deg)"], ...[0.5, 0.8, 1.1, 1.4].flatMap((t) => [[t, "transform:rotate(0deg)", EASE], [t + 0.12, "transform:rotate(-14deg)", EASE], [t + 0.26, "transform:rotate(0deg)"]]), [3.0, "transform:rotate(0deg)", EASE], [3.25, "transform:rotate(-30deg)", POP], [3.6, "transform:rotate(0deg)"]]],
        popTrack(".bf-stamp", 3.3, 7.3, 0.35),
        [PUPILS, [[0, "transform:translate(0,0)"], [0.4, "transform:translate(0,0)", EASE], [0.7, "transform:translate(2px,1.4px)"], [2.2, "transform:translate(2px,1.4px)", EASE], [2.6, "transform:translate(2px,-1.4px)"], [4.0, "transform:translate(2px,-1.4px)", EASE], [4.4, "transform:translate(0,0)"]]],
        [".bf-move", [[0, "transform:rotate(0deg)"], [3.4, "transform:rotate(0deg)", EASE], [3.6, "transform:rotate(-3deg)", EASE], [3.8, "transform:rotate(2deg)", EASE], [4.0, "transform:rotate(0deg)"]]],
      ],
    },
  };
}

export const LOOP_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon", "lovebird", "crane", "magpie", "beaver"];
export const DEFAULT_VIEW = [-25, -20, 170, 170];

// ---- the CSS builder --------------------------------------------------------------------------------------------

const pct = (t, total) => `${+((t / total) * 100).toFixed(4)}%`;

/**
 * The stops of a track as keyframes over `total` seconds, closed on the first stop (a loop ends where it began).
 * Stops must start at 0 and go forward in time.
 */
export function keyframes(name, stops, total, { hold = false } = {}) {
  if (!stops.length || stops[0][0] !== 0) throw new Error(`${name}: a track starts at 0 s`);
  for (let i = 1; i < stops.length; i++) {
    if (stops[i][0] < stops[i - 1][0]) throw new Error(`${name}: stop ${i} (${stops[i][0]} s) goes back in time`);
    if (stops[i][0] > total) throw new Error(`${name}: stop ${i} (${stops[i][0]} s) is past the end (${total} s)`);
  }
  // A loop closes on its first stop; a moment of the film (`hold`) keeps its last one to the end.
  const closed = stops.at(-1)[0] === total ? stops : [...stops, [total, (hold ? stops.at(-1) : stops[0])[1]]];
  const body = closed.map(([t, decl, ease]) => `  ${pct(t, total)} { ${decl}${ease ? `; animation-timing-function: ${ease}` : ""} }`).join("\n");
  return `@keyframes ${name} {\n${body}\n}`;
}

/**
 * Tracks → CSS. `scope` prefixes every selector (one bird of the film), `prefix` names the keyframes, `delay` and
 * `iterations` say when and how often (`infinite` in a loop; once, at its moment, in the film). Tracks on the same
 * selector share one `animation` list, so none cancels another.
 */
export function tracksCss(tracks, { scope = "", prefix = "bf", total = LOOP.seconds, delay = 0, iterations = "infinite", hold = false } = {}) {
  const frames = [];
  const bySel = new Map();
  tracks.forEach(([sel, stops, own = {}], i) => {
    const name = `${prefix}-${i}`;
    const t = own.total ?? total;
    frames.push(keyframes(name, stops, t, { hold: own.hold ?? hold }));
    const list = bySel.get(sel) ?? [];
    list.push(`${name} ${t}s linear ${+(own.delay ?? delay).toFixed(3)}s ${own.iterations ?? iterations} both`);
    bySel.set(sel, list);
  });
  const rules = [...bySel].map(([sel, list]) => `${scope} ${sel} { animation: ${list.join(", ")}; }`.trim());
  return `${frames.join("\n")}\n${rules.join("\n")}`;
}

/** The parts the gestures move, and how they turn (the props' own boxes; the bird's feet for the whole bird). */
export const BASE_CSS = `
.bf-move { transform-box: view-box; transform-origin: 60px 108px; }
.bf-pop, .bf-shadow, .bf-coin-face, .bf-star, .bf-heart { transform-box: fill-box; transform-origin: center; }
.bf-rise, .bf-receipt { transform-box: fill-box; transform-origin: center bottom; }
.bf-draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
`;
