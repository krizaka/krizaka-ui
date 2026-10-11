// Client. Radix Switch: role="switch", aria-checked, Space and Enter toggle, a hidden input inside a form.
import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";

export const switchVariants = tv({
  slots: {
    root:
      // A well (its inner shade), the accent with its glow when on; the thumb is a raised bead that carries the node, lit when on.
      "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-fg-muted inset-shadow-well " +
      "transition-[background-color,box-shadow] duration-(--kz-duration-fast) data-[state=checked]:shadow-glow " +
      "focus-visible:focus-ring " +
      "disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-accent aria-invalid:border-danger",
    thumb:
      "pointer-events-none grid place-items-center rounded-full bg-fg-on-media shadow-raised transition-transform duration-(--kz-duration-base) ease-spring " +
      "data-[state=unchecked]:translate-x-0.5 motion-reduce:transition-none " +
      "after:size-1.5 after:rotate-45 after:rounded-[1.5px] after:bg-transparent after:transition-colors data-[state=checked]:after:bg-accent",
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
