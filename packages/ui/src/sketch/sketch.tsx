// Server-safe. A screen drawn as with a pen in a school notebook (krizaka-internal#4006, blocks.css): ink strokes that
// wobble a little, deterministic from the spec's seed, on the Seyès ruling; numbered callouts in the margin red; the
// meaning in a real HTML legend under the drawing. The SVG is one image named by its title: on a phone its few words
// shrink, the legend does not.
import * as glyphs from "@krizaka/icons/glyphs";
import type * as React from "react";

import { bend, box, circle, hatch, head, type Rng, rngFor, scribble, stroke, wash } from "./ink";
import type { SketchCallout, SketchLegendItem, SketchShape, SketchSpec } from "./sketch.types";

// The block's class and the caller's: two names at most, so no `cn` (clsx + tailwind-merge) in the budget.
const classes = (own: string, extra?: string) => (extra ? `${own} ${extra}` : own);

export type SketchProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** What the drawing shows, in one sentence: the drawing's accessible name. */
  title: string;
  /** The drawing. */
  spec: SketchSpec;
  /** One line per callout number, in reading order: every number has a line, every line a number. */
  legend?: readonly SketchLegendItem[];
  /** The caption under the figure: `Fig. 2 — the booking page`. */
  caption?: React.ReactNode;
};

export type SketchPairProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** The sketch before the change. */
  before: SketchProps;
  /** The sketch after the change. */
  after: SketchProps;
  /** The note above the first sketch: `before`. */
  beforeLabel: React.ReactNode;
  /** The note above the second sketch: `after`. */
  afterLabel: React.ReactNode;
};

type Glyph = glyphs.Glyph;
const GLYPHS = glyphs as unknown as Readonly<Record<string, Glyph>>;

/** The glyph of an `@krizaka/icons` name, or `undefined` when the set has no such icon. */
export const sketchGlyph = (name: string): Glyph | undefined => (Object.hasOwn(glyphs.glyphIndex, name) ? GLYPHS[name] : undefined);

/** The text of an `icon` shape whose name is not in `@krizaka/icons`: the sketch refuses to draw it. */
export class SketchIconError extends Error {
  constructor(readonly icon: string) {
    super(`Sketch: « ${icon} » is not an @krizaka/icons glyph.`);
    this.name = "SketchIconError";
  }
}

/**
 * What does not match between a spec's callouts and its legend: a number with no legend line, a line with no number.
 * Empty when they pair one to one (a number given twice is React's duplicate-key warning). The component warns with it in development.
 */
export function sketchProblems(spec: SketchSpec, legend: readonly SketchLegendItem[] = []): string[] {
  const called = (spec.callouts ?? []).map((c) => c.n);
  const told = legend.map((l) => l.n);
  return [
    ...called.filter((n) => !told.includes(n)).map((n) => `callout ${n} has no legend line`),
    ...told.filter((n) => !called.includes(n)).map((n) => `legend line ${n} has no callout`),
  ];
}

const warnProblems = (title: string, problems: string[]) => {
  if (problems.length === 0 || typeof process === "undefined" || process.env.NODE_ENV === "production") return;
  console.warn(`@krizaka/ui/sketch « ${title} »: ${problems.join("; ")}.`);
};

// @fixed: the gap between two scribbled lines, in units: a line of body text on a screen.
const LINE_GAP = 12;
const WORD_SIZE = { sm: 12, md: 16 } as const;
const FRAME_PAD = { desktop: 6, phone: 16, none: 0 } as const;

type Drawn = { ink: string; faint: string; washes: React.ReactNode[]; marks: React.ReactNode[] };
type Bounds = { x0: number; y0: number; x1: number; y1: number };

const grow = (b: Bounds, x: number, y: number, pad = 0) => {
  b.x0 = Math.min(b.x0, x - pad);
  b.y0 = Math.min(b.y0, y - pad);
  b.x1 = Math.max(b.x1, x + pad);
  b.y1 = Math.max(b.y1, y + pad);
};

const word = (key: string, x: number, y: number, text: string, size: number, className = "kz-sketch-word", anchor?: "middle") => (
  <text key={key} className={className} x={x} y={y} fontSize={size} textAnchor={anchor} dominantBaseline={anchor ? "central" : undefined}>
    {text}
  </text>
);

// `SketchShape & { kind: K }` and not `Extract`: the line and the arrow share one member of the union.
// A shape stays on the screen (`width` × `height`): only the frame and the callouts widen the view box.
type Drawer<K extends SketchShape["kind"]> = (s: SketchShape & { kind: K }, rng: Rng, out: Drawn, key: string) => void;

const line: Drawer<"line" | "arrow"> = (s, rng, out) => {
  out.ink += stroke(rng, s.from, s.to);
};
const arrow: Drawer<"line" | "arrow"> = (s, rng, out, key) => {
  line(s, rng, out, key);
  out.ink += head(rng, s.from, s.to, 9);
};

// One drawer per kind, built once: the spec's closed set of shapes.
const DRAW: { [K in SketchShape["kind"]]: Drawer<K> } = {
  box: (s, rng, out, key) => {
    const fill = s.fill ?? "none";
    if (fill !== "none") out.washes.push(<path key={key} className="kz-sketch-wash" data-fill={fill} d={wash(rng, s.x, s.y, s.w, s.h)} />);
    if (s.dashed) out.marks.push(<path key={`${key}d`} className="kz-sketch-ink" data-dashed="" d={box(rng, s.x, s.y, s.w, s.h)} />);
    else out.ink += box(rng, s.x, s.y, s.w, s.h);
  },
  button: (s, rng, out, key) => {
    if (s.variant === "primary") out.washes.push(<path key={key} className="kz-sketch-wash" data-fill="primary" d={wash(rng, s.x, s.y, s.w, s.h)} />);
    out.ink += box(rng, s.x, s.y, s.w, s.h);
    if (s.label) {
      const size = Math.min(WORD_SIZE.md, s.h * 0.45);
      out.marks.push(word(`${key}l`, s.x + s.w / 2, s.y + s.h / 2, s.label, size, s.variant === "primary" ? "kz-sketch-word kz-sketch-on-accent" : "kz-sketch-word", "middle"));
    }
  },
  lines: (s, rng, out) => {
    for (let i = 0; i < s.count; i++) {
      const last = i === s.count - 1 && s.count > 1;
      out.faint += scribble(rng, s.x, s.y + i * LINE_GAP, s.w * (last ? 0.45 + rng() * 0.2 : 0.85 + rng() * 0.15));
    }
  },
  text: (s, _rng, out, key) => {
    const size = WORD_SIZE[s.size ?? "md"];
    out.marks.push(word(key, s.x, s.y, s.text, size));
  },
  line,
  arrow,
  icon: (s, _rng, out, key) => {
    const glyph = sketchGlyph(s.name);
    if (!glyph) throw new SketchIconError(s.name);
    const size = s.size ?? 24;
    out.marks.push(
      <g key={key} className="kz-sketch-ink" transform={`translate(${s.x} ${s.y}) scale(${size / 24})`}>
        {glyph.p?.map((d) => <path key={d} d={d} />)}
        {glyph.c?.map(([cx, cy, r]) => <circle key={`${cx},${cy},${r}`} cx={cx} cy={cy} r={r} />)}
        {glyph.n?.map(([cx, cy]) => <circle key={`n${cx},${cy}`} className="kz-sketch-node" cx={cx} cy={cy} r={glyphs.NODE_RADIUS} />)}
      </g>,
    );
  },
  hatch: (s, rng, out) => {
    out.ink += box(rng, s.x, s.y, s.w, s.h);
    out.faint += hatch(rng, s.x, s.y, s.w, s.h);
  },
};

function drawFrame(spec: SketchSpec, rng: Rng): string {
  const { width: w, height: h } = spec;
  const frame = spec.frame ?? "desktop";
  if (frame === "none") return "";
  const p = FRAME_PAD[frame];
  if (frame === "desktop") return box(rng, -p, -p, w + 2 * p, h + 2 * p);
  // A phone: the outline with its round corners, the speaker above, the bar below.
  const r = 22;
  const [x0, y0, x1, y1] = [-p, -p - 8, w + p, h + p + 8];
  const arc = (x: number, y: number) => `A${r} ${r} 0 0 1 ${x} ${y}`;
  const outline =
    `M${x0 + r} ${y0}` + bend(rng, [x0 + r, y0], [x1 - r, y0]) + arc(x1, y0 + r) +
    bend(rng, [x1, y0 + r], [x1, y1 - r]) + arc(x1 - r, y1) +
    bend(rng, [x1 - r, y1], [x0 + r, y1]) + arc(x0, y1 - r) +
    bend(rng, [x0, y1 - r], [x0, y0 + r]) + arc(x0 + r, y0);
  return outline + stroke(rng, [w / 2 - 18, y0 + 9], [w / 2 + 18, y0 + 9]) + stroke(rng, [w / 2 - 28, y1 - 9], [w / 2 + 28, y1 - 9]);
}

/** A callout's lead: a pen line (an arrow with `arrow`) from its badge to the item; the badge is HTML, drawn over it. */
function drawLead(c: SketchCallout, r: number, rng: Rng, b: Bounds): string {
  grow(b, ...(c.from ?? c.at), r + 4);
  if (!c.from) return "";
  grow(b, ...c.at, 4);
  return stroke(rng, c.from, c.at) + (c.arrow ? head(rng, c.from, c.at, Math.max(8, r * 0.6)) : "");
}

/** The drawing alone: the SVG of a spec, the same markup for the same spec and seed. */
function SketchDrawing({ spec, title }: Readonly<{ spec: SketchSpec; title: string }>) {
  const seed = spec.seed ?? 1;
  const frame = spec.frame ?? "desktop";
  const pad = FRAME_PAD[frame] + (frame === "phone" ? 8 : 0);
  const b: Bounds = { x0: -pad, y0: -pad, x1: spec.width + pad, y1: spec.height + pad };
  const out: Drawn = { ink: drawFrame(spec, rngFor(seed, -1)), faint: "", washes: [], marks: [] };
  spec.shapes.forEach((s, i) => (DRAW[s.kind] as Drawer<typeof s.kind>)(s, rngFor(seed, i), out, `s${i}`));
  // The room kept around a badge in the margin: about a 48th of the screen's width.
  const r = Math.min(24, Math.max(11, Math.round(spec.width / 48)));
  const callouts = spec.callouts ?? [];
  const leads = callouts.map((c, i) => drawLead(c, r, rngFor(seed, 1000 + i), b)).join("");
  const [vx, vy, vw, vh] = [b.x0 - 4, b.y0 - 4, b.x1 - b.x0 + 8, b.y1 - b.y0 + 8].map((v) => Math.round(v));
  const at = (v: number, o: number, l: number) => `${Math.round(((v - o) / l) * 1e4) / 100}%`;
  // The numbers are HTML over the drawing, a fixed size at any width: on a phone the drawing shrinks, they stay legible.
  return (
    <div className="kz-sketch-canvas" style={{ maxInlineSize: `${vw}px` }}>
      <svg className="kz-sketch-svg" viewBox={`${vx} ${vy} ${vw} ${vh}`} role="img" aria-label={title}>
        <title>{title}</title>
        {out.washes}
        {out.faint && <path className="kz-sketch-faint" d={out.faint} />}
        {out.ink && <path className="kz-sketch-ink" d={out.ink} />}
        {out.marks}
        {leads && <path className="kz-sketch-lead" d={leads} />}
      </svg>
      {callouts.map((c, i) => {
        const [x, y] = c.from ?? c.at;
        return (
          <span key={c.n} className="kz-sketch-badge" aria-hidden style={{ left: at(x, vx, vw), top: at(y, vy, vh) }}>
            <svg viewBox="0 0 24 24">
              <path d={circle(rngFor(seed, 2000 + i), [12, 12], 10.5)} />
            </svg>
            {c.n}
          </span>
        );
      })}
    </div>
  );
}

/**
 * A screen drawn as with a pen in a notebook: boxes, buttons, scribbled lines, a few words, icons, hatched areas and
 * numbered callouts, then the legend that says what each number is for. Server-rendered, no client JavaScript.
 * @throws {SketchIconError} when an `icon` shape names a glyph `@krizaka/icons` does not have.
 */
export function Sketch({ title, spec, legend = [], caption, className, ...props }: Readonly<SketchProps>) {
  warnProblems(title, sketchProblems(spec, legend));
  return (
    <figure className={classes("kz-sketch", className)} data-frame={spec.frame ?? "desktop"} {...props}>
      <div className="kz-sketch-plate" data-paper="ruled">
        <SketchDrawing spec={spec} title={title} />
      </div>
      {legend.length > 0 && (
        <ol className="kz-sketch-legend">
          {legend.map((l) => (
            <li key={l.n} value={l.n} className="kz-sketch-item">
              <span className="kz-sketch-item-n">{l.n}</span>
              <span>
                <b>{l.label}</b> {l.text}
              </span>
            </li>
          ))}
        </ol>
      )}
      {caption && <figcaption className="kz-sketch-caption">{caption}</figcaption>}
    </figure>
  );
}

/** Two sketches, before and after a change: side by side from 48rem of room, one above the other below. */
export function SketchPair({ before, after, beforeLabel, afterLabel, className, ...props }: Readonly<SketchPairProps>) {
  return (
    <div className={classes("kz-sketch-pair", className)} {...props}>
      <div className="kz-sketch-pair-grid">
        <div className="kz-sketch-side">
          <p className="kz-sketch-side-label">{beforeLabel}</p>
          <Sketch {...before} />
        </div>
        <div className="kz-sketch-side">
          <p className="kz-sketch-side-label">{afterLabel}</p>
          <Sketch {...after} />
        </div>
      </div>
    </div>
  );
}
