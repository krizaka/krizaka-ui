// Server-safe. What a list, a search or a panel says when it has nothing to show — every word is a prop.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const emptyState = tv({
  slots: {
    root: "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-default px-6 py-10 text-center",
    icon: "flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-fg-secondary [&>svg]:h-6 [&>svg]:w-6",
    title: "text-sm font-semibold text-fg",
    description: "max-w-sm text-sm text-fg-secondary",
    action: "mt-1 flex flex-wrap items-center justify-center gap-2",
  },
});
const s = emptyState();

export type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** A decorative icon (hidden from assistive technology). */
  icon?: React.ReactNode;
  /** What is empty, in a few words ("No videos yet"). */
  title: React.ReactNode;
  /** Why, or what will fill it. */
  description?: React.ReactNode;
  /** What to do next: a Button, a link. */
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div role="status" className={s.root({ className })} {...props}>
      {icon && (
        <div aria-hidden className={s.icon()}>
          {icon}
        </div>
      )}
      <p className={s.title()}>{title}</p>
      {description && <p className={s.description()}>{description}</p>}
      {action && <div className={s.action()}>{action}</div>}
    </div>
  );
}
