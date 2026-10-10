// Client: the clock is a hook.
import { tv } from "tailwind-variants";

import { countdownParts, type CountdownUnits, useCountdown } from "./core";

const countdown = tv({
  slots: {
    root: "inline-flex items-baseline gap-1.5 font-display font-black tabular-nums tracking-tight text-fg",
    segment: "inline-flex items-baseline",
    unit: "ml-0.5 text-[0.5em] font-bold uppercase text-fg-secondary",
    label: "mr-0.5 self-center font-sans text-[0.6em] font-semibold tracking-normal text-fg-secondary",
  },
  variants: {
    size: { sm: { root: "text-sm" }, md: { root: "text-xl" }, lg: { root: "text-3xl sm:text-4xl" } },
    urgent: { true: { root: "text-fg-danger" } },
  },
  defaultVariants: { size: "md" },
});

export type CountdownProps = {
  /** The moment it counts down to: a Date, an ISO string or epoch milliseconds. */
  target: Date | string | number;
  /** Server clock − this clock, in milliseconds. */
  skewMs?: number;
  /** The short unit labels, passed translated. */
  units: CountdownUnits;
  /** Below this many milliseconds it turns urgent (`text-fg-danger`, the last segment pulses). Default 60 s. */
  urgentBelowMs?: number;
  /** sm · md · lg — the danger text role reads at 4.5:1 at every size, in both themes. */
  size?: "sm" | "md" | "lg";
  /** Accessible name, e.g. "Ends in". */
  label: string;
  /** Also show `label` before the segments, in the secondary text role (default: only read by screen readers). */
  showLabel?: boolean;
  /** Classes merged last, over the primitive's. */
  className?: string;
};

/**
 * Time left until a moment, as segments (2d 04h 13m 09s — days only when there are some) in tabular figures. Under
 * `urgentBelowMs` it turns to the danger text role and its last segment pulses (no motion under prefers-reduced-motion).
 * Words come from the app: `units` are the short unit labels. `role="timer"` without live announcements — the app
 * announces what matters. State: `data-urgent`, `data-ended`.
 *
 * The urgent colour is `--kz-danger-text` (≥ 4.5:1 on every surface in both themes), so `size="sm"` is safe too.
 */
export function Countdown({ target, skewMs = 0, units, urgentBelowMs = 60_000, size = "md", label, showLabel = false, className }: CountdownProps) {
  const ms = useCountdown(target, skewMs);
  const urgent = ms > 0 && ms < urgentBelowMs;
  const parts = countdownParts(ms, units);
  const s = countdown({ size, urgent });
  return (
    <span
      role="timer"
      aria-label={label}
      data-urgent={urgent ? "" : undefined}
      data-ended={ms === 0 ? "" : undefined}
      suppressHydrationWarning
      className={s.root({ className })}
    >
      {showLabel ? (
        <span aria-hidden className={s.label()}>
          {label}
        </span>
      ) : null}
      {parts.map(([value, unit], i) => (
        <span key={unit} className={s.segment({ className: urgent && i === parts.length - 1 ? "motion-safe:animate-pulse" : undefined })}>
          {String(value).padStart(2, "0")}
          <span className={s.unit()}>{unit}</span>
        </span>
      ))}
    </span>
  );
}
