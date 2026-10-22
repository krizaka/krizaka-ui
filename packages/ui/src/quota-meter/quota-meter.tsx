// Server-safe. Space or time used against a plan: what is used in words, a Meter that turns amber then red, the sentence
// that says what to do before the limit (and a status role once it matters), the small figures and the way out.
import * as React from "react";
import { tv } from "tailwind-variants";

import { Meter } from "../meter";

export const quotaMeter = tv({
  slots: {
    root: "flex flex-col gap-2 rounded-2xl border border-border-default bg-surface-1 p-5",
    head: "flex items-center justify-between gap-3",
    title: "flex items-center gap-2 font-mono text-xs text-fg-secondary [&>svg]:h-3.5 [&>svg]:w-3.5",
    plan: "text-xs text-fg-secondary",
    used: "font-mono text-lg font-black text-fg",
    status: "flex items-start gap-1.5 text-xs leading-relaxed",
    details: "flex flex-wrap items-center justify-between gap-2 text-xs text-fg-secondary",
  },
  variants: {
    level: {
      ok: { status: "text-fg-secondary" },
      warning: { status: "text-fg-warning" },
      critical: { status: "text-fg-danger" },
      full: { status: "text-fg-danger" },
    },
  },
  defaultVariants: { level: "ok" },
});

export type QuotaLevel = "ok" | "warning" | "critical" | "full";

/** Where the meter turns amber and red, as shares of the limit. */
export const QUOTA_THRESHOLDS = { low: 0.8, high: 0.95 } as const;

export type QuotaMeterProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** What is measured (`Storage`), with an optional icon before it. */
  title: React.ReactNode;
  icon?: React.ReactNode;
  /** The plan's name, on the right of the title. */
  plan?: React.ReactNode;
  /** Used so far, in the unit of `max`. */
  value: number;
  /** The limit; `null` for no limit (no meter is drawn). */
  max: number | null;
  /** « 3.2 GB of 10 GB », said once for the eye and once for the meter's value. */
  usedText: string;
  /** The meter's accessible name. */
  meterLabel: string;
  /** Where the level stands: tones the sentence and gives an alarming one a status role. */
  level?: QuotaLevel;
  /** The sentence for that level (« You are close to your limit »). */
  statusText?: React.ReactNode;
  /** More sentences that matter (« 2 uploads on hold », « uploads are paused »), each a status. */
  notices?: readonly React.ReactNode[];
  /** Small figures under the meter (minutes, today's uploads). Left out when the card is compact. */
  details?: readonly React.ReactNode[];
  /** The way out, shown under the figures (a link to manage). */
  action?: React.ReactNode;
  /** Only the used line, the meter and the sentence. */
  compact?: boolean;
};

export function QuotaMeter({ title, icon, plan, value, max, usedText, meterLabel, level = "ok", statusText, notices = [], details = [], action, compact = false, className, ...props }: QuotaMeterProps) {
  const s = quotaMeter({ level });
  const alarming = level !== "ok";
  const titleId = React.useId();
  return (
    <section aria-labelledby={titleId} className={s.root({ className })} {...props}>
      <div className={s.head()}>
        <h3 id={titleId} className={s.title()}>
          {icon}
          {title}
        </h3>
        {plan && <span className={s.plan()}>{plan}</span>}
      </div>
      <p className={s.used()}>{usedText}</p>
      {max !== null && <Meter size="sm" value={Math.min(value, max)} max={max} label={meterLabel} valueText={usedText} thresholds={QUOTA_THRESHOLDS} />}
      {statusText && (
        <p className={s.status()} role={alarming ? "status" : undefined}>
          {statusText}
        </p>
      )}
      {notices.map((n, i) => (
        <p key={i} className={quotaMeter({ level: "critical" }).status()} role="status">
          {n}
        </p>
      ))}
      {!compact && (details.length > 0 || action) && (
        <div className={s.details()}>
          {details.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          {action}
        </div>
      )}
    </section>
  );
}
