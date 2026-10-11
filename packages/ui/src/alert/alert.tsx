// Server-safe. A message in the flow of the page (not a toast): a tone, an icon, a title, a text, an action.
// danger and warning are announced at once (role="alert"); info and success politely (role="status").
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { tv } from "../tv";

// Soft tones (a tint, a tinted border, a coloured icon): the text stays a text role — the invariant status tokens are
// too light for small text on a light surface (WCAG AA).
export const alertVariants = tv({
  slots: {
    // A tint of the status, its edge light, and a rail of the status colour that glows along the left edge.
    root:
      "relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pl-5 text-sm text-fg inset-shadow-edge " +
      "before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r-full before:shadow-[0_0_10px_var(--kz-rail)]",
    icon: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5",
    content: "flex min-w-0 flex-1 flex-col gap-1",
    title: "font-semibold text-fg",
    description: "text-fg-secondary",
    action: "flex shrink-0 items-center gap-2 self-center",
  },
  variants: {
    tone: {
      info: { root: "border-info/35 bg-info/10 [--kz-rail:var(--kz-info)] before:bg-info", icon: "text-info" },
      success: { root: "border-success/35 bg-success-soft [--kz-rail:var(--kz-success)] before:bg-success", icon: "text-success" },
      warning: { root: "border-warning/45 bg-warning-soft [--kz-rail:var(--kz-warning)] before:bg-warning", icon: "text-warning" },
      danger: { root: "border-danger/45 bg-danger-soft [--kz-rail:var(--kz-danger)] before:bg-danger", icon: "text-danger" },
    },
  },
  defaultVariants: { tone: "info" },
});

export type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;

export type AlertProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The tone: `danger` and `warning` are announced at once (`role="alert"`), `info` and `success` politely. */
  tone?: AlertTone;
  /** A decorative icon (hidden from assistive technology). */
  icon?: React.ReactNode;
  /** The headline, in bold above the text. */
  title?: React.ReactNode;
  /** What to do: a Button, a link. */
  action?: React.ReactNode;
};

export function Alert({ tone = "info", icon, title, action, className, children, ...props }: AlertProps) {
  const s = alertVariants({ tone });
  return (
    <div role={tone === "danger" || tone === "warning" ? "alert" : "status"} data-tone={tone} className={s.root({ className })} {...props}>
      {icon && (
        <span aria-hidden className={s.icon()}>
          {icon}
        </span>
      )}
      <div className={s.content()}>
        {title && <p className={s.title()}>{title}</p>}
        {children && <div className={s.description()}>{children}</div>}
      </div>
      {action && <div className={s.action()}>{action}</div>}
    </div>
  );
}
