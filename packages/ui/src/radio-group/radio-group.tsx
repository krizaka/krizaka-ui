// Client (a context). Radix RadioGroup: role="radiogroup" / "radio", one tab stop, the arrows move and select, a
// hidden input inside a form. Two looks: `RadioGroup.Item` (a dot and its words) and `RadioGroup.Card` (a whole card
// is the radio: an amount, a pack, a payment method, a plan).
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";
import { tv } from "tailwind-variants";

export const radioGroup = tv({
  slots: {
    root: "grid gap-2 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap",
    item:
      "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-1 transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
      "hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-accent aria-invalid:border-danger",
    dot: "h-2.5 w-2.5 rounded-full bg-accent",
    label: "flex cursor-pointer items-start gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-60",
    card:
      "relative flex min-w-0 flex-col items-start gap-1 rounded-xl border border-border-default bg-surface-1 p-3 text-left text-sm text-fg transition-colors " +
      "hover:border-border-strong focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-accent data-[state=checked]:bg-accent-soft " +
      "data-[state=checked]:shadow-sm",
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
