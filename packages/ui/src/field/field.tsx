// Server-safe. The label ↔ control wiring is HTML (htmlFor / id, aria-describedby): no context.
import type * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";

export const field = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "text-xs font-semibold text-fg-secondary",
    control:
      "flex h-11 w-full rounded-lg border border-border-default bg-surface-2 px-3 text-sm text-fg placeholder:text-fg-muted " +
      "transition-[border-color,box-shadow] focus-visible:border-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/30",
    hint: "text-xs text-fg-secondary",
    // The message reads in the danger text role (≥ 4.5:1 on every surface, both themes); the dot is the danger fill.
    error: "flex items-center gap-1.5 text-xs font-medium text-fg-danger before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-danger",
    selectWrap: "relative flex w-full",
    chevron: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-secondary",
  },
});
const s = field();

export const Field = {
  Root: ({ className, ...props }: React.ComponentProps<"div">) => <div className={s.root({ className })} {...props} />,
  Label: ({ className, ...props }: React.ComponentProps<"label">) => <label className={s.label({ className })} {...props} />,
  Hint: ({ className, ...props }: React.ComponentProps<"p">) => <p className={s.hint({ className })} {...props} />,
  Error: ({ className, ...props }: React.ComponentProps<"p">) => <p role="alert" className={s.error({ className })} {...props} />,
};

type ControlProps = {
  /** Marks the control invalid: aria-invalid and data-invalid (pair it with a `Field.Error` in aria-describedby). */
  invalid?: boolean;
};

const invalidProps = (invalid?: boolean) => (invalid ? { "aria-invalid": true as const, "data-invalid": "" } : {});

export function Input({ invalid, className, ...props }: React.ComponentProps<"input"> & ControlProps) {
  return <input {...invalidProps(invalid)} className={s.control({ className })} {...props} />;
}

export function Textarea({ invalid, className, ...props }: React.ComponentProps<"textarea"> & ControlProps) {
  return <textarea {...invalidProps(invalid)} className={s.control({ className: cn("h-auto min-h-24 py-2", className) })} {...props} />;
}

/** A native <select>, styled like the other controls (the platform's menu: accessible and right on phones). */
export function Select({ invalid, className, ...props }: React.ComponentProps<"select"> & ControlProps) {
  return (
    <span className={s.selectWrap()}>
      <select {...invalidProps(invalid)} className={s.control({ className: cn("appearance-none pr-9", className) })} {...props} />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={s.chevron()}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
