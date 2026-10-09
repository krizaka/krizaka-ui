// Client. Radix Checkbox: role="checkbox", aria-checked (true · false · mixed), Space toggles, a hidden input inside a
// form. It sits in a `Field` like the other controls: `<Field.Label htmlFor={id}>`, `invalid`, aria-describedby.
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type * as React from "react";
import { tv } from "tailwind-variants";

export const checkbox = tv({
  slots: {
    root:
      "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface-1 text-on-accent transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
      "hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 " +
      "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent " +
      "aria-invalid:border-danger aria-invalid:ring-danger/30",
    indicator: "flex items-center justify-center",
    label: "flex cursor-pointer items-start gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-60",
  },
});

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Dash() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M5 12h14" />
    </svg>
  );
}

export type CheckboxProps = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "children"> & {
  /** Marks it invalid: aria-invalid and data-invalid (pair it with a `Field.Error` in aria-describedby). */
  invalid?: boolean;
  /** The text next to the box, clickable: the box and its words in one `<label>`. Otherwise name it with
   * `Field.Label htmlFor` or `aria-label`. */
  children?: React.ReactNode;
};

/** A checkbox: `checked`/`defaultChecked` (`true` · `false` · `"indeterminate"`) + `onCheckedChange`. */
export function Checkbox({ invalid, className, children, ...props }: CheckboxProps) {
  const s = checkbox();
  const box = (
    <CheckboxPrimitive.Root
      aria-invalid={invalid || undefined}
      data-invalid={invalid ? "" : undefined}
      className={s.root({ className: children ? "mt-0.5" : className })}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={s.indicator()}>
        {props.checked === "indeterminate" ? <Dash /> : <Check />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!children) return box;
  return (
    <label className={s.label({ className })}>
      {box}
      <span className="min-w-0">{children}</span>
    </label>
  );
}
