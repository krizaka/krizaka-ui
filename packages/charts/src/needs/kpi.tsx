// The key figure of a ready-made chart, written under its title: the value, what it is, and the change in words with
// a decorative arrow in the direction's tone (the words carry the meaning: colour is never alone). Spans only — it
// sits in the chart's description paragraph.
import type { ReactNode } from "react";

import type { Tone } from "../core/types";

const ARROW = { up: "M7 17 17 7M8 7h9v9", down: "M7 7l10 10M17 8v9H8", flat: "M5 12h14M13 6l6 6-6 6" } as const;

export interface KpiProps {
  readonly value: ReactNode;
  readonly label?: ReactNode;
  /** The change, in words (`+12 % vs September`). */
  readonly delta?: ReactNode;
  readonly direction?: "up" | "down" | "flat" | null;
  /** The arrow's tone: a rise of earnings is good (`success`), a rise of latency is not (`danger`). */
  readonly tone?: Tone;
}

export function Kpi({ value, label, delta, direction, tone = "neutral" }: KpiProps) {
  return (
    <span className="kzc-kpi">
      <span className="kzc-kpi-value">{value}</span>
      {label ? <span className="kzc-kpi-label">{label}</span> : null}
      {delta ? (
        <span className="kzc-kpi-delta" data-tone={tone}>
          {direction ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={ARROW[direction]} />
            </svg>
          ) : null}
          {delta}
        </span>
      ) : null}
    </span>
  );
}

/** The tone of a change: `good` says which direction is good news (earnings up, latency down). */
export function toneOf(direction: "up" | "down" | "flat" | null, good: "up" | "down"): Tone {
  if (!direction || direction === "flat") return "neutral";
  return direction === good ? "success" : "danger";
}
