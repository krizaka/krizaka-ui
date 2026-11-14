// Client. Radix Switch: role="switch", aria-checked, Space and Enter toggle, a hidden input inside a form.
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const switchVariants = tv({
  slots: {
    row: "flex min-h-11 w-full items-center justify-between gap-4",
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
  | { label?: undefined; "aria-labelledby": string }
  /** Named by its own settings row: `children` is the visible label. */
  | { label?: undefined; children: React.ReactNode };

/** The settings row: the words at the start, the switch at the end, the whole row clickable. */
type Row =
  | { children?: undefined; description?: undefined }
  | {
      /** The visible words, at the start of the row: they name the switch and the whole row toggles it. */
      children: React.ReactNode;
      /** A line under the words, read with the switch as its hint. */
      description?: React.ReactNode;
    };

export type SwitchProps = Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children"> &
  SwitchVariants &
  Named &
  Row & {
    /**
     * sm · md.
     * @default "md"
     */
    size?: SwitchVariants["size"];
    /** Marks it invalid: aria-invalid and data-invalid. */
    invalid?: boolean;
  };

/**
 * An on/off switch: `checked`/`defaultChecked` + `onCheckedChange`. With `children` (and a `description`) it draws its
 * own settings row: the words at the start, the switch at the end (mirrored under `dir="rtl"`), the whole row
 * clickable, 44 px high or more. It stays one control with one name (`children`) and one hint (`description`).
 */
export function Switch({ label, size, invalid, className, children, description, ...props }: SwitchProps) {
  const s = switchVariants({ size });
  const id = React.useId();
  const row = children !== undefined;
  const control = (
    <SwitchPrimitive.Root
      aria-label={label}
      aria-invalid={invalid || undefined}
      data-invalid={invalid ? "" : undefined}
      aria-labelledby={row ? `${id}t` : undefined}
      aria-describedby={row && description ? `${id}h` : undefined}
      className={s.root({ className: row ? undefined : className })}
      {...props}
    >
      <SwitchPrimitive.Thumb className={s.thumb()} />
    </SwitchPrimitive.Root>
  );
  return row ? (
    <label className={s.row({ className })}>
      <span className="grid min-w-0">
        <span id={`${id}t`} className="text-sm text-fg">
          {children}
        </span>
        {description ? (
          <span id={`${id}h`} className="text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
      </span>
      {control}
    </label>
  ) : (
    control
  );
}
