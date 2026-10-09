// Server-safe: no hook, no context. role="progressbar" with aria-valuenow / aria-valuemax (none when indeterminate),
// named by `label`. A bar or a ring; the ring can hold content in its centre (an amount, a percentage).
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const progress = tv({
  slots: {
    root: "relative",
    track: "",
    indicator: "",
    center: "absolute inset-0 flex flex-col items-center justify-center text-center",
  },
  variants: {
    variant: {
      bar: {
        root: "w-full overflow-hidden rounded-full bg-surface-3",
        indicator:
          "kz-progress h-full rounded-full bg-linear-to-r from-accent to-accent-2 transition-[width] duration-500 motion-reduce:transition-none " +
          "data-[state=indeterminate]:w-2/5",
      },
      ring: {
        root: "inline-flex shrink-0 items-center justify-center",
        track: "stroke-border-default",
        indicator:
          "stroke-accent transition-[stroke-dashoffset] duration-1000 motion-reduce:transition-none " +
          "data-[state=indeterminate]:origin-center data-[state=indeterminate]:animate-spin motion-reduce:data-[state=indeterminate]:animate-none",
      },
    },
    size: { sm: {}, md: {}, lg: {} },
  },
  compoundVariants: [
    { variant: "bar", size: "sm", class: { root: "h-1" } },
    { variant: "bar", size: "md", class: { root: "h-2" } },
    { variant: "bar", size: "lg", class: { root: "h-3" } },
    { variant: "ring", size: "sm", class: { root: "h-10 w-10" } },
    { variant: "ring", size: "md", class: { root: "h-20 w-20" } },
    { variant: "ring", size: "lg", class: { root: "h-36 w-36" } },
  ],
  defaultVariants: { variant: "bar", size: "md" },
});

export type ProgressVariants = VariantProps<typeof progress>;

export type ProgressProps = Omit<React.ComponentProps<"div">, "children"> &
  ProgressVariants & {
    /** How far, between 0 and `max`. `null` or absent: indeterminate (a wait of unknown length). */
    value?: number | null;
    max?: number;
    /** The accessible name — passed translated ("Upload", "Raised towards the goal"). */
    label: string;
    /** The value in words for assistive technology ("$420 of $1,000") — default: the percentage. */
    valueText?: string;
    /** A ring's centre: an amount, a percentage, an icon. */
    children?: React.ReactNode;
  };

const STROKE = { sm: 12, md: 9, lg: 7 } as const;

/** A progress bar or ring: `value` / `max`, indeterminate without a value. State: `data-state` (loading · complete · indeterminate). */
export function Progress({ variant = "bar", size = "md", value, max = 100, label, valueText, className, children, ...props }: ProgressProps) {
  const s = progress({ variant, size });
  const known = typeof value === "number" && Number.isFinite(value);
  const ratio = known ? Math.min(1, Math.max(0, value / (max || 1))) : 0;
  const percent = Math.round(ratio * 100);
  const state = !known ? "indeterminate" : ratio >= 1 ? "complete" : "loading";
  const aria = {
    role: "progressbar" as const,
    "aria-label": label,
    "aria-valuemin": known ? 0 : undefined,
    "aria-valuemax": known ? max : undefined,
    "aria-valuenow": known ? Math.min(max, Math.max(0, value)) : undefined,
    "aria-valuetext": known ? (valueText ?? `${percent}%`) : valueText,
    "data-state": state,
    "data-value": known ? value : undefined,
    "data-variant": variant,
  };
  if (variant === "ring") {
    const stroke = STROKE[size];
    const r = 50 - stroke / 2;
    return (
      <div {...aria} className={s.root({ className })} {...props}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth={stroke} className={s.track()} />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={known ? 100 - percent : 75}
            data-state={state}
            className={s.indicator()}
          />
        </svg>
        {children !== undefined && <div className={s.center()}>{children}</div>}
      </div>
    );
  }
  return (
    <div {...aria} className={s.root({ className })} {...props}>
      <div data-state={state} className={s.indicator()} style={known ? { width: `${ratio * 100}%` } : undefined} />
    </div>
  );
}
