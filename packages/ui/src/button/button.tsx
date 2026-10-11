// Server-safe: no hook, no context. `buttonVariants` styles a <Link> or a Server Component without the component.
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { LoaderGlyph } from "../spinner/glyph";

export const buttonVariants = tv({
  base:
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
    "disabled:pointer-events-none disabled:opacity-40 data-loading:cursor-progress active:scale-[0.98] " +
    // Busy is not unavailable: a loading button keeps its colour (it is disabled only so it is not pressed twice).
    "[&[data-loading]]:opacity-100",
  variants: {
    variant: {
      primary: "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
      // The brand's signature: accent → accent-2 (on-accent reads on both stops, tested in @krizaka/tokens).
      gradient: "bg-linear-to-r from-accent to-accent-2 text-on-accent shadow-sm hover:brightness-110",
      secondary: "border border-border-default bg-surface-2 text-fg hover:border-border-strong hover:bg-surface-3",
      outline: "border border-border-default bg-transparent text-fg hover:border-accent hover:text-fg-accent",
      ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
      // The border and the tint carry the danger; the label stays the primary text role, legible on the tint at rest
      // and hovered over every surface (`text-fg-danger` is for text set directly on a surface).
      danger: "border border-danger/50 bg-danger/10 text-fg hover:border-danger hover:bg-danger/20",
    },
    size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-sm", icon: "h-10 w-10" },
    // `cut`: the Krizaka chamfer — 45° corners (CSS corner-shape, where supported; rounded elsewhere). The border, the
    // focus ring and the hover follow the cut, unlike a clip-path.
    shape: { rounded: "rounded-lg", pill: "rounded-full", cut: "rounded-[10px] [corner-shape:bevel]" },
  },
  defaultVariants: { variant: "secondary", size: "md", shape: "rounded" },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariants & {
    /**
     * The look: `primary` (the accent), `gradient` (accent → accent-2), `secondary` (a raised surface), `outline`,
     * `ghost`, `danger`.
     * @default "secondary"
     */
    variant?: ButtonVariants["variant"];
    /**
     * sm · md · lg, or `icon` (a square).
     * @default "md"
     */
    size?: ButtonVariants["size"];
    /**
     * rounded · pill · cut (45° corners, the Krizaka chamfer).
     * @default "rounded"
     */
    shape?: ButtonVariants["shape"];
    /** Renders the child (e.g. a <Link>) instead of the <button>, with props, classes and ref merged. */
    asChild?: boolean;
    /**
     * Disables and signals the wait (aria-busy, data-loading) and shows the Krizaka loader glyph before the label; the
     * button keeps its colour.
     */
    loading?: boolean;
    /**
     * Between 0 and 1, while `loading`: the glyph's trace and a light fill across the button grow to the value (an
     * upload, an export).
     */
    progress?: number | null;
    /**
     * How the action ended: `success` draws a check, `error` a cross (and the button shakes its head once); a ring of
     * the status colour opens around it. Clear it to return to rest.
     */
    status?: "success" | "error" | null;
    /** A message announced politely by assistive technology when it changes (“Saved”, “Upload failed”) — passed translated. */
    announce?: string;
    /**
     * Shows the glyph while `loading` / with a `status`. `false`: you draw your own.
     * @default true
     */
    indicator?: boolean;
    /** A sheen of light crosses the button on hover — for the one action a page is about. */
    shimmer?: boolean;
    /** The button leans a few pixels toward a fine pointer (driven by `MotionObserver`; never under reduced motion or on touch). */
    magnetic?: boolean;
  };

const STATUS_TEXT = { success: "text-fg-success", error: "text-fg-danger" } as const;

export function Button({
  asChild,
  loading,
  progress,
  status,
  announce,
  indicator = true,
  shimmer,
  magnetic,
  variant,
  size,
  shape,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const known = loading && typeof progress === "number" && Number.isFinite(progress);
  const ratio = known ? Math.min(1, Math.max(0, progress)) : 0;
  const glyph = indicator && !asChild && (loading || status) ? (status ?? "loading") : null;
  // On a filled variant the glyph stays in the label's colour; on the others it takes the status colour.
  const filled = variant === "primary" || variant === "gradient";
  const button = (
    <Comp
      type={asChild ? undefined : "button"}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      data-variant={variant ?? "secondary"}
      data-kz-status={status ?? undefined}
      data-kz-magnetic={magnetic ? "" : undefined}
      disabled={asChild ? undefined : disabled || loading}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      className={buttonVariants({
        variant,
        size,
        shape,
        className: [known && "relative isolate overflow-hidden", shimmer && "kz-sheen", className].filter(Boolean).join(" ") || undefined,
      })}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {known && (
            <span aria-hidden className="absolute inset-y-0 left-0 -z-10 bg-current opacity-15 transition-[width] duration-500" style={{ width: `${ratio * 100}%` }} />
          )}
          {glyph && (
            <span
              aria-hidden
              data-slot="indicator"
              className="-my-1 grid grid-cols-[1fr] transition-[grid-template-columns,margin,opacity] duration-300 starting:-mr-2 starting:grid-cols-[0fr] starting:opacity-0"
            >
              <span className="overflow-hidden">
                <LoaderGlyph state={glyph} value={known ? ratio : null} className={["h-4 w-4", glyph !== "loading" && !filled && STATUS_TEXT[glyph]].filter(Boolean).join(" ")} />
              </span>
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  );
  if (announce === undefined || asChild) return button;
  return (
    <>
      {button}
      <span role="status" className="sr-only">
        {announce}
      </span>
    </>
  );
}

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  /** The accessible name (and tooltip) of the button — required, passed translated. */
  label: string;
  /**
   * sm · md · lg, or `icon` (a square).
   * @default "icon"
   */
  size?: ButtonProps["size"];
};

/** An icon-only button: `label` is required, it is its accessible name. Loading or with a status, the glyph takes the icon's place. */
export function IconButton({ label, size = "icon", children, ...props }: IconButtonProps) {
  const swap = props.indicator !== false && !props.asChild && (props.loading || props.status);
  return (
    <Button aria-label={label} title={label} size={size} {...props}>
      {swap ? null : children}
    </Button>
  );
}
