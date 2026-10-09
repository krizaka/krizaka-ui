// Client. Radix Switch: role="switch", aria-checked, Space and Enter toggle, a hidden input inside a form.
import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const switchVariants = tv({
  slots: {
    root:
      "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-fg-muted transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
      "disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-accent aria-invalid:border-danger",
    thumb:
      "pointer-events-none block rounded-full bg-fg-on-media shadow-sm transition-transform data-[state=unchecked]:translate-x-0.5 motion-reduce:transition-none",
  },
  variants: {
    size: {
      sm: { root: "h-5 w-9", thumb: "h-4 w-4 data-[state=checked]:translate-x-[1.125rem]" },
      md: { root: "h-6 w-11", thumb: "h-5 w-5 data-[state=checked]:translate-x-[1.375rem]" },
    },
  },
  defaultVariants: { size: "md" },
});

export type SwitchVariants = VariantProps<typeof switchVariants>;

type Named =
  | {
      /** The accessible name — required when no visible label names it, passed translated. */
      label: string;
    }
  /** Named by a visible `<label htmlFor={id}>` (e.g. `Field.Label`). */
  | { label?: undefined; id: string }
  /** Named by another element. */
  | { label?: undefined; "aria-labelledby": string };

export type SwitchProps = Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children"> &
  SwitchVariants &
  Named & {
    /**
     * sm · md.
     * @default "md"
     */
    size?: SwitchVariants["size"];
    /** Marks it invalid: aria-invalid and data-invalid. */
    invalid?: boolean;
  };

/** An on/off switch: `checked`/`defaultChecked` + `onCheckedChange`. */
export function Switch({ label, size, invalid, className, ...props }: SwitchProps) {
  const s = switchVariants({ size });
  return (
    <SwitchPrimitive.Root
      aria-label={label}
      aria-invalid={invalid || undefined}
      data-invalid={invalid ? "" : undefined}
      className={s.root({ className })}
      {...props}
    >
      <SwitchPrimitive.Thumb className={s.thumb()} />
    </SwitchPrimitive.Root>
  );
}
