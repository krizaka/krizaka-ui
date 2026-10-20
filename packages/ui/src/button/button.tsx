// Server-safe: no hook, no context. `buttonVariants` styles a <Link> or a Server Component without the component.
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../cn";
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
     * `rounded` (an 8 px radius, the radius of a field) · `pill`. `cut` is deprecated (krizaka-ui#393: the chamfer is
     * retired) — it draws `rounded` and warns in development; it will be removed in 4.0.
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
    /** @deprecated Since 3.31 (krizaka-ui#393): does nothing — the hover is quiet. Removed in 4.0. */
    shimmer?: boolean;
    /** @deprecated Since 3.31 (krizaka-ui#393): does nothing — a button never moves under the pointer. Removed in 4.0. */
    magnetic?: boolean;
  };

const STATUS_TEXT = { success: "text-fg-success", error: "text-fg-danger" } as const;

let warnedCut = false;
/** `shape="cut"` (the chamfer) is retired: one warning per page in development, never in production. */
function warnCut() {
  if (warnedCut || typeof process === "undefined" || process.env.NODE_ENV === "production") return;
  warnedCut = true;
  console.warn('@krizaka/ui/button: shape="cut" is deprecated (krizaka-ui#393) and now draws the default rounded shape. Remove the prop.');
}

export function Button({
  asChild,
  loading,
  progress,
  status,
  announce,
  indicator = true,
  shimmer: _shimmer,
  magnetic: _magnetic,
  variant,
  size,
  shape,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  if (shape === "cut") warnCut();
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
      disabled={asChild ? undefined : disabled || loading}
      aria-disabled={asChild && (disabled || loading) ? true : undefined}
      className={buttonVariants({
        variant,
        size,
        shape,
        className: cn(known && "relative isolate overflow-hidden", className),
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
                <LoaderGlyph state={glyph} value={known ? ratio : null} className={cn("h-4 w-4", glyph !== "loading" && !filled && STATUS_TEXT[glyph])} />
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
