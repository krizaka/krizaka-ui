// Client (the birds hold an id). The arcade « character select » card of the Krizaka style (blocks.css): two subjects face to
// face — a component and its alternative, two releases — each a bird as the fighter, with stat bars, and a « VS » mark between
// them. Every bar is a real figure passed in by the host (`value` of `max`, and its text), read as a definition list: the bars
// repeat the numbers, they never replace them. No winner is computed: the reader compares.
import type * as React from "react";

import { cn } from "../cn";
import type { MascotBird } from "../mascots/geometry";
import { Mascot } from "../mascots/mascot";

export interface FighterStat {
  /** What is measured (`Bundle size`, `Coverage`). */
  label: string;
  /** The measured value, from 0 to `max`. Real data: a stat that is not a finite number is left out. */
  value: number;
  /** The top of the bar. @default 100 */
  max?: number;
  /** The value as the reader reads it (`4.1 kB`, `92 %`); `value` when omitted. */
  display?: React.ReactNode;
}

export interface Fighter {
  /** The subject's name (`@krizaka/ui 2.7`, `Radix Dialog`). */
  name: React.ReactNode;
  /** The bird that fights for it. */
  bird: MascotBird;
  /** One line under the name. */
  caption?: React.ReactNode;
  /** Its stat bars, from real data. */
  stats: readonly FighterStat[];
}

export type VersusCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The accessible name of the match: `Krizaka UI 2.7 versus 2.6`. */
  label: string;
  /** The subject on the left. */
  left: Fighter;
  /** The subject on the right (its bird faces left). */
  right: Fighter;
  /** The mark between them. @default "VS" */
  vs?: React.ReactNode;
  /** Where the figures come from, under the card. */
  source?: React.ReactNode;
};

function FighterPane({ fighter, side }: { fighter: Fighter; side: "left" | "right" }) {
  const stats = fighter.stats.filter((s) => Number.isFinite(s.value) && Number.isFinite(s.max ?? 100) && (s.max ?? 100) > 0);
  return (
    <div className="kz-versus-fighter" data-side={side}>
      <div className="kz-versus-bird" aria-hidden="true">
        <Mascot bird={fighter.bird} tone="own" size={104} animated={false} />
      </div>
      <p className="kz-versus-name">{fighter.name}</p>
      {fighter.caption && <p className="kz-versus-caption">{fighter.caption}</p>}
      <dl className="kz-versus-stats">
        {stats.map((s) => {
          const fill = Math.min(100, Math.max(0, (s.value / (s.max ?? 100)) * 100));
          return (
            <div key={s.label} className="kz-versus-stat">
              <dt>{s.label}</dt>
              <dd>
                <span className="kz-versus-value">{s.display ?? s.value}</span>
                <span className="kz-versus-bar" aria-hidden="true" style={{ ["--kz-versus-fill" as string]: `${Math.round(fill * 10) / 10}%` }} />
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/** An arcade versus card: two subjects face to face, a bird each, stat bars from real data, a « VS » between them. */
export function VersusCard({ label, left, right, vs = "VS", source, className, ...props }: VersusCardProps) {
  return (
    <section className={cn("kz-versus", className)} aria-label={label} {...props}>
      <FighterPane fighter={left} side="left" />
      <span className="kz-versus-mark">{vs}</span>
      <FighterPane fighter={right} side="right" />
      {source && <p className="kz-versus-source">{source}</p>}
    </section>
  );
}
