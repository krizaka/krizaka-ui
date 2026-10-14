// Server-safe: no hook, no context. `buttonVariants` styles a <Link> or a Server Component without the component.
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { LoaderGlyph } from "../spinner/glyph";
import { buttonRecipe } from "./recipe";

export const buttonVariants = tv(buttonRecipe);

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
