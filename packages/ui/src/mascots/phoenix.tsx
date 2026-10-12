// The phoenix of the Krizaka landscape, on its own: two wings — two rival flames — around one bright core. The sixth
// figure of the flock: it does no job, it stands for the comeback (a relaunch, a recovered account, a second chance).
import type * as React from "react";
import { useId } from "react";

import { PHOENIX, PHOENIX_PALETTES,type PhoenixPalette } from "./phoenix-geometry";

const CSS = `
@keyframes kzp-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes kzp-core { 0%, 100% { opacity: .8; } 50% { opacity: 1; } }
.kzp[data-animated] { animation: kzp-float 5s ease-in-out infinite; }
.kzp[data-animated] .kzp-core { animation: kzp-core 2.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .kzp, .kzp .kzp-core { animation: none !important; } }
`;

export type PhoenixProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /** `own` (default): the violet wing and the gold wing of the Krizaka story. `brand`: the host's accent and accent-2. */
  tone?: "own" | "brand";
  /** Width and height in pixels. */
  size?: number;
  /** A slow float and a breathing core. Off with `false`; always off under `prefers-reduced-motion`. */
  animated?: boolean;
  /** An accessible name (the phoenix becomes an image); without it, it is decorative. */
  title?: string;
};

const BRAND: PhoenixPalette = {
  left: ["var(--kz-accent-2, var(--kz-accent))", "var(--kz-accent)"],
  right: ["var(--kz-accent)", "var(--kz-accent-2, var(--kz-accent))"],
  core: ["#ffffff", "var(--kz-accent)"],
  body: "var(--kz-surface-3)",
  edge: "var(--kz-border-strong)",
  crest: "var(--kz-accent)",
};

/** The phoenix: the comeback, beside the five birds of the flock (`Mascot`). Decorative unless titled. */
export function Phoenix({ tone = "own", size = 120, animated = true, title, className, ...props }: PhoenixProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const p = tone === "brand" ? BRAND : PHOENIX_PALETTES.own;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      data-animated={animated ? "" : undefined}
      className={["kzp", className].filter(Boolean).join(" ")}
      {...a11y}
      {...props}
    >
      <style>{CSS}</style>
      <defs>
        <linearGradient id={`kzp-l-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.left[0]} />
          <stop offset="100%" stopColor={p.left[1]} />
        </linearGradient>
        <linearGradient id={`kzp-r-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.right[0]} />
          <stop offset="100%" stopColor={p.right[1]} />
        </linearGradient>
        <radialGradient id={`kzp-c-${id}`}>
          <stop offset="0%" stopColor={p.core[0]} />
          <stop offset="100%" stopColor={p.core[1]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={PHOENIX.wingL} fill={`url(#kzp-l-${id})`} />
      <path d={PHOENIX.wingR} fill={`url(#kzp-r-${id})`} />
      <path d={PHOENIX.tailL} fill={`url(#kzp-l-${id})`} opacity=".7" />
      <path d={PHOENIX.tailR} fill={`url(#kzp-r-${id})`} opacity=".7" />
      <path d={PHOENIX.body} fill={p.body} stroke={p.edge} strokeOpacity=".5" />
      <circle cx="60" cy="58" r="12" fill={`url(#kzp-c-${id})`} className="kzp-core" />
      <circle cx="60" cy="58" r="3.5" fill="#fff" />
      <path d={PHOENIX.crest} stroke={p.crest} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
