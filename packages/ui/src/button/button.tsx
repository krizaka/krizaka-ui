// Server-safe: no hook, no context. `buttonVariants` styles a <Link> or a Server Component without the component.
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base:
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
    "disabled:pointer-events-none disabled:opacity-40 data-loading:cursor-progress active:scale-[0.98]",
  variants: {
    variant: {
      primary: "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
      secondary: "border border-border-default bg-surface-2 text-fg hover:border-border-strong hover:bg-surface-3",
      outline: "border border-border-default bg-transparent text-fg hover:border-accent hover:text-accent",
      ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
      // The danger token is invariant and too light for small text on a light surface (3.6:1): the label stays a
      // text role, the border and the tint carry the danger.
      danger: "border border-danger/50 bg-danger/10 text-fg hover:border-danger hover:bg-danger/20",
    },
    size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-sm", icon: "h-10 w-10" },
    shape: { rounded: "rounded-lg", pill: "rounded-full" },
  },
  defaultVariants: { variant: "secondary", size: "md", shape: "rounded" },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariants & {
    /** Renders the child (e.g. a <Link>) instead of the <button>, with props, classes and ref merged. */
    asChild?: boolean;
    /** Disables and signals the wait (aria-busy, data-loading) — the product adds a spinner if it wants one. */
    loading?: boolean;
  };

export function Button({ asChild, loading, variant, size, shape, className, disabled, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      data-variant={variant ?? "secondary"}
      disabled={asChild ? undefined : disabled || loading}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      className={buttonVariants({ variant, size, shape, className })}
      {...props}
    />
  );
}

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  /** The accessible name (and tooltip) of the button — required, passed translated. */
  label: string;
  size?: ButtonProps["size"];
};

/** An icon-only button: `label` is required, it is its accessible name. */
export function IconButton({ label, size = "icon", ...props }: IconButtonProps) {
  return <Button aria-label={label} title={label} size={size} {...props} />;
}
