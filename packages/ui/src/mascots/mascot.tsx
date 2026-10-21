// The Krizaka flock on the web: one bird, one mood, drawn from ./geometry in the host's brand colours.
import type * as React from "react";
import { useId } from "react";

import { archEye, BIRDS, brow, lidEye, LIGHT, type MascotBird, type MascotMood, type MascotPalette, type MascotTone, MOOD_PARTS, OWN_PALETTES, PARCEL, SHADE, upperLid } from "./geometry";
import { type MascotLook, phaseOf } from "./life";

const CSS = `
.kzb-bird { transform-box: view-box; transform-origin: 60px 108px; }
.kzb-eye { transform-box: fill-box; transform-origin: center; }
.kzb-wing { transform-box: view-box; }
[data-animated] .kzb-bird { animation: kzb-bob 3.6s ease-in-out infinite; }
[data-animated] .kzb-blink { animation: kzb-blink 5.2s ease-in-out infinite; }
[data-animated][data-mood="welcome"] .kzb-wing-r { animation: kzb-wave 1.1s ease-in-out infinite alternate; }
[data-animated][data-mood="thinking"] .kzb-dot { animation: kzb-dot 1.5s ease-in-out infinite; }
[data-animated][data-mood="thinking"] .kzb-dot:nth-child(2) { animation-delay: .2s; }
[data-animated][data-mood="thinking"] .kzb-dot:nth-child(3) { animation-delay: .4s; }
[data-animated][data-mood="success"] .kzb-bird { animation: kzb-hop 1.6s cubic-bezier(.3,1.6,.5,1) 1, kzb-bob 3.6s ease-in-out 1.6s infinite; }
[data-animated][data-mood="success"] .kzb-badge { animation: kzb-pop .5s cubic-bezier(.3,1.6,.5,1) .3s both; }
[data-animated][data-mood="success"] .kzb-sparkle { animation: kzb-twinkle 2.4s ease-in-out infinite; }
[data-animated][data-mood="error"] .kzb-bird { animation: kzb-shake .5s ease-in-out .2s 2, kzb-bob 3.6s ease-in-out 1.2s infinite; }
[data-animated][data-mood="empty"] .kzb-bird { animation: kzb-sway 5s ease-in-out infinite; }
.kzb-badge, .kzb-sparkle, .kzb-dot { transform-box: fill-box; transform-origin: center; }
@keyframes kzb-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
@keyframes kzb-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
@keyframes kzb-wave { from { transform: rotate(-8deg); } to { transform: rotate(-38deg); } }
@keyframes kzb-dot { 0%, 100% { opacity: .35; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
@keyframes kzb-hop { 0% { transform: translateY(0); } 30% { transform: translateY(-9px); } 60% { transform: translateY(0); } 100% { transform: translateY(0); } }
@keyframes kzb-pop { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes kzb-twinkle { 0%, 100% { opacity: .25; transform: scale(.7); } 50% { opacity: 1; transform: scale(1); } }
@keyframes kzb-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
@keyframes kzb-sway { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-2deg); } }
@media (prefers-reduced-motion: reduce) {
  .kzb-bird, .kzb-blink, .kzb-wing, .kzb-wing-r, .kzb-hop, .kzb-head, .kzb-parcel, .kzb-dot, .kzb-badge, .kzb-sparkle { animation: none !important; }
  .kzb-look, .kzb-pupil { transition: none !important; transform: none !important; }
}
`;

/** The host's roles (`tone="brand"`): the accent paints the bird, so it wears the product it is shown in. */
const BRAND: MascotPalette = {
  from: "var(--kz-accent-2, var(--kz-accent))",
  to: "var(--kz-accent)",
  wing: "var(--kz-accent)",
  detail: "var(--kz-accent-2, var(--kz-accent))",
  beak: "var(--kz-warning)",
  eye: "var(--kz-text-primary)",
};
const OUTLINE = "var(--kz-border-strong, color-mix(in srgb, currentColor 35%, transparent))";
const SURFACE = "var(--kz-surface-0)";

export type MascotProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /** Which bird of the flock: `falcon` (watch, security), `owl` (reading, documents), `duck` (building, code), `flamingo` (answers, support), `pigeon` (delivery, notifications), `lovebird` (introductions, two people who meet), `crane` (listening, a calm moment), `magpie` (the score: points, standings, trophies), `beaver` (the shop: a small business at work). */
  bird?: MascotBird;
  /** What the moment is: `welcome` (onboarding), `thinking` (a long task running), `success` (it is done), `empty` (nothing here yet), `error` (it failed). */
  mood?: MascotMood;
  /** `brand` (default): the host's accent, so the bird wears the product it is in. `own`: the bird's signature colours of the Krizaka story. */
  tone?: MascotTone;
  /** Width and height in pixels. */
  size?: number;
  /** A light idle motion and the mood's gesture. Off with `false`; always off under `prefers-reduced-motion`. */
  animated?: boolean;
  /** An accessible name (the bird becomes an image); without it the mascot is decorative. */
  title?: string;
  /**
   * The bird at ease, in character (mood `welcome`, the default): it breathes, blinks in its own rhythm, tilts its head,
   * ruffles a wing, now and then hops — the falcon watches, the owl reads, the duck builds, the flamingo answers, the
   * pigeon delivers. CSS only, still under `prefers-reduced-motion` and with `animated={false}`.
   */
  life?: boolean;
  /** Where in its cycles the bird starts, 0 to 1 (default: from the instance's id), so two birds never move together. */
  phase?: number;
  /** Where it looks (`life`): `left` and `right` turn the head and the eyes, `up` raises them, `center` rests. */
  look?: MascotLook;
  /** In flight (`life`): the wings beat, the body leans into the trip — the pigeon of a delivery. */
  flying?: boolean;
  /** Which way it leans in flight, -1 (left) to 1 (right). */
  bank?: number;
  /** A tap or a poke just happened (`life`): a small jump. Set it for a moment, then unset. */
  poked?: boolean;
};

/**
 * One of the nine Krizaka figures in one mood — for the moments a product speaks to a person: a welcome, a long wait,
 * a success, an empty list, an error. Drawn in the host's brand colours by default (`tone="own"` for the story's).
 */
export function Mascot({ bird = "owl", mood = "welcome", tone = "brand", size = 96, animated = true, title, life = false, phase, look, flying, bank, poked, className, style, ...props }: MascotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = BIRDS[bird];
  const alive = life && mood === "welcome";
  const ph = phase ?? phaseOf(uid);
  const p = tone === "own" ? OWN_PALETTES[bird] : BRAND;
  const body = `url(#kzb-${uid})`;
  const line = { stroke: OUTLINE, strokeWidth: 1.4, strokeLinejoin: "round" as const };
  const eyeR = g.eyes.white || g.eyes.pupil * 1.2;
  const eyes = g.eyes.at.map((at, i) => {
    const glance = mood === "thinking" ? 1.4 : 0;
    if (mood === "success") return <path key={i} d={archEye(at, eyeR * 0.85)} stroke={g.visor ? p.eye : OUTLINE} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
    if (mood === "empty" && g.eyes.white > 0)
      return (
        <g key={i}>
          <circle cx={at[0]} cy={at[1]} r={g.eyes.white} fill={LIGHT} {...line} />
          <circle cx={at[0]} cy={at[1] + g.eyes.pupil * 0.7} r={g.eyes.pupil} fill={SHADE} />
          <path d={upperLid(at, g.eyes.white)} fill={p.detail} {...line} />
        </g>
      );
    if (mood === "empty") return <path key={i} d={lidEye(at, eyeR * 0.8)} stroke={g.visor ? p.eye : OUTLINE} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
    return (
      <g key={i} className="kzb-eye kzb-blink">
        {g.eyes.white > 0 && <circle cx={at[0]} cy={at[1]} r={g.eyes.white} fill={LIGHT} {...line} />}
        <g className="kzb-pupil">
          <circle cx={at[0] + glance} cy={at[1] - glance} r={g.eyes.pupil} fill={g.visor ? p.eye : SHADE} />
          {g.eyes.white > 0 && <circle cx={at[0] + glance - g.eyes.pupil * 0.35} cy={at[1] - glance - g.eyes.pupil * 0.35} r={g.eyes.pupil * 0.35} fill={LIGHT} />}
        </g>
      </g>
    );
  });
  const [wl, wr] = g.wings;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-bird={bird}
      data-mood={mood}
      data-animated={animated ? "" : undefined}
      data-life={alive ? "" : undefined}
      data-look={alive && look && look !== "center" ? look : undefined}
      data-flying={alive && flying ? "" : undefined}
      data-poked={alive && poked ? "" : undefined}
      className={className}
      style={alive ? ({ "--kzb-ph": ph, "--kzb-bank": bank ?? 0, ...style } as React.CSSProperties) : style}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      {...props}
    >
      <style>{CSS}</style>
      <defs>
        <linearGradient id={`kzb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: p.from }} />
          <stop offset="100%" style={{ stopColor: p.to }} />
        </linearGradient>
      </defs>
      <ellipse cx={g.shadow[0]} cy={g.shadow[1]} rx={g.shadow[2]} ry={g.shadow[3]} fill={SHADE} opacity={0.14} />
      {mood === "empty" && <path d={MOOD_PARTS.tray} stroke={OUTLINE} strokeWidth={1.6} strokeDasharray="3 3" strokeLinejoin="round" />}
      <g className="kzb-hop">
        <g className="kzb-bird">
          {g.legs.map((d) => (
            <path key={d} d={d} stroke={p.beak} strokeWidth={2.6} strokeLinecap="round" />
          ))}
          {g.back?.map((d) => (d.endsWith("Z") ? <path key={d} d={d} fill={p.detail} {...line} /> : <path key={d} d={d} stroke={OUTLINE} strokeWidth={1.4} />))}
          {g.parcel && (
            <g className="kzb-parcel" {...line}>
              {g.parcel.map((d, i) => (
                <path key={d} d={d} fill={PARCEL[i]} />
              ))}
            </g>
          )}
          <path d={g.body} fill={body} {...line} />
          <path d={g.belly} fill={LIGHT} opacity={0.28} />
          {[wl, wr].map((w, i) => {
            const turn = mood === "success" ? (i === 0 ? 28 : -28) : mood === "welcome" && i === 1 && !alive ? -20 : 0;
            return (
              <g key={i} className={i === 1 ? "kzb-wing kzb-wing-r" : "kzb-wing kzb-wing-l"} style={{ transformOrigin: `${w.pivot[0]}px ${w.pivot[1]}px`, transform: turn ? `rotate(${turn}deg)` : undefined }}>
                <path d={w.d} fill={p.wing} {...line} />
                <path d={w.d} fill={SHADE} opacity={0.16} />
              </g>
            );
          })}
          <g className="kzb-look">
            <g className="kzb-head">
              {g.neck && <path d={g.neck.d} stroke={body} strokeWidth={g.neck.width} strokeLinecap="round" />}
              {g.head.r > 0 && <circle cx={g.head.cx} cy={g.head.cy} r={g.head.r} fill={body} {...line} />}
              {g.details.map((d) => (
                <path key={d} d={d} fill={p.detail} {...line} />
              ))}
              {g.visor && <rect x={g.visor.x} y={g.visor.y} width={g.visor.w} height={g.visor.h} rx={4} fill={SURFACE} {...line} />}
              {eyes}
              {g.glasses && (
                <g stroke={OUTLINE} strokeWidth={1.3}>
                  {g.eyes.at.map(([x, y]) => (
                    <circle key={x} cx={x} cy={y} r={6.5} fill={LIGHT} fillOpacity={0.12} />
                  ))}
                  <path d={`M${g.eyes.at[0][0] + 6.5} ${g.eyes.at[0][1]} L${g.eyes.at[1][0] - 6.5} ${g.eyes.at[1][1]}`} />
                </g>
              )}
              {mood === "error" &&
                g.eyes.at.map((at, i) => <path key={i} d={brow(at, eyeR, g.eyes.at.length === 1 ? 1 : i === 0 ? -1 : 1)} stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" />)}
              <path d={g.beak} fill={p.beak} {...line} />
            </g>
          </g>
        </g>
      </g>
      {mood === "thinking" && (
        <g>
          {MOOD_PARTS.dots.map(([cx, cy, r]) => (
            <circle key={cx} className="kzb-dot" cx={cx} cy={cy} r={r} fill="var(--kz-text-secondary)" />
          ))}
        </g>
      )}
      {mood === "success" && (
        <>
          {MOOD_PARTS.sparkles.map((d) => (
            <path key={d} className="kzb-sparkle" d={d} fill={p.from} />
          ))}
          <g className="kzb-badge">
            <circle cx={MOOD_PARTS.badge.cx} cy={MOOD_PARTS.badge.cy} r={MOOD_PARTS.badge.r} fill="var(--kz-success)" />
            <path d={MOOD_PARTS.check} stroke={SURFACE} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </>
      )}
      {mood === "error" && (
        <g className="kzb-badge">
          <circle cx={MOOD_PARTS.badge.cx} cy={MOOD_PARTS.badge.cy} r={MOOD_PARTS.badge.r} fill="var(--kz-danger)" />
          <path d={MOOD_PARTS.bang.line} stroke={SURFACE} strokeWidth={2.8} strokeLinecap="round" />
          <circle cx={MOOD_PARTS.bang.dot[0]} cy={MOOD_PARTS.bang.dot[1]} r={1.6} fill={SURFACE} />
        </g>
      )}
    </svg>
  );
}
