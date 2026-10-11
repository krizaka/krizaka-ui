// Client (a context). Radix RadioGroup: role="radiogroup" / "radio", one tab stop, the arrows move and select, a
// hidden input inside a form. Two looks: `RadioGroup.Item` (a dot and its words) and `RadioGroup.Card` (a whole card
// is the radio: an amount, a pack, a payment method, a plan).
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";

import { tv } from "../tv";

export const radioGroup = tv({
  slots: {
    root: "grid gap-2 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap",
    item:
      // A small well; chosen, its node lights — the core of the Krizaka marks, a diamond in the accent.
      "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-1 inset-shadow-well " +
      "transition-[border-color,box-shadow,scale] duration-(--kz-duration-fast) ease-spring active:scale-90 data-[state=checked]:shadow-glow " +
      "focus-visible:focus-ring " +
      "hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-accent aria-invalid:border-danger",
    dot: "size-2 rotate-45 rounded-[2px] bg-accent shadow-[0_0_0_3px_var(--kz-accent-soft),0_0_8px_var(--kz-accent)] motion-safe:animate-[kz-check-in_var(--kz-duration-base)_var(--kz-ease-spring)]",
    label: "flex cursor-pointer items-start gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-60",
    card:
      "relative flex min-w-0 flex-col items-start gap-1 rounded-xl border border-border-default bg-surface-1 bg-sheen p-3 text-left text-sm text-fg shadow-raised inset-shadow-edge " +
      "transition-[border-color,box-shadow,background-color,scale] duration-(--kz-duration-fast) ease-spring active:scale-[0.99] " +
      // Chosen: the accent's tint and glow, and the node lit in its top-right corner.
      "after:absolute after:right-3 after:top-3 after:size-1.5 after:rotate-45 after:rounded-[1.5px] after:bg-border-strong after:transition-[background-color,box-shadow] " +
      "data-[state=checked]:after:bg-accent data-[state=checked]:after:shadow-[0_0_8px_var(--kz-accent)] " +
      "hover:border-border-strong focus-visible:focus-ring " +
      "disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-accent data-[state=checked]:bg-accent-soft " +
      "data-[state=checked]:shadow-glow",
  },
});
const s = radioGroup();

export type RadioGroupRootProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** The group's accessible name — passed translated (or `aria-labelledby` a visible heading). */
  label?: string;
  /** Marks every radio invalid: aria-invalid (pair it with a `Field.Error`). */
  invalid?: boolean;
};

/** `value`/`defaultValue` + `onValueChange`, `orientation`, `required`, `name` for a form. */
export function RadioGroupRoot({ label, invalid, className, ...props }: RadioGroupRootProps) {
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      aria-invalid={invalid || undefined}
      data-invalid={invalid ? "" : undefined}
      className={s.root({ className })}
      {...props}
    />
  );
}

export type RadioGroupItemProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
  /** The words next to the dot, clickable. Otherwise name it with `Field.Label htmlFor` or `aria-label`. */
  children?: React.ReactNode;
};

/** A radio: a dot, and its words when given. */
export function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  const item = (
    <RadioGroupPrimitive.Item className={s.item({ className: children ? "mt-0.5" : className })} {...props}>
      <RadioGroupPrimitive.Indicator className={s.dot()} />
    </RadioGroupPrimitive.Item>
  );
  if (!children) return item;
  return (
    <label className={s.label({ className })}>
      {item}
      <span className="min-w-0">{children}</span>
    </label>
  );
}

/** A whole card as the radio: its content is the radio's name. `data-state="checked"` styles the chosen one. */
export function RadioGroupCard({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return <RadioGroupPrimitive.Item className={s.card({ className })} {...props} />;
}

/** `RadioGroup.Root/Item/Card`. */
export const RadioGroup = { Root: RadioGroupRoot, Item: RadioGroupItem, Card: RadioGroupCard };
