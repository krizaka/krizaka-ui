// Server-safe: pure CSS. The main action of a page, stuck to the bottom of a phone's screen while the page scrolls: put it
// as the last child of the page's `main` (a sticky element holds the viewport's edge inside its container). From `md` up it
// is not drawn — the page's own buttons are within reach. In `task` mode (a form to finish: a new invoice) it stays on every
// width, with the `summary` (the total) at its left, so the action and what it commits are always in view.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const stickyAction = tv({
  base: "sticky bottom-0 z-30 border-t border-border-subtle bg-surface-1 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
  variants: { mode: { phone: "md:hidden", task: "" } },
  defaultVariants: { mode: "phone" },
});

export type StickyActionProps = React.ComponentProps<"div"> & {
  /**
   * `phone`: the bar of a phone only. `task`: on every width, for a form the person is finishing.
   * @default "phone"
   */
  mode?: "phone" | "task";
  /** `task` only: what the action commits (`Total 1 250,00 $`), at the left of the action; stacked above it on a phone. */
  summary?: React.ReactNode;
  /** The action: one `ButtonLink` (full width is added on a phone). */
  children: React.ReactNode;
};

/** The one action of a page, held at the bottom edge of a phone — or, in `task` mode, of the form on every width. */
export function StickyAction({ mode = "phone", summary, className, children, ...props }: StickyActionProps) {
  const task = mode === "task";
  return (
    <div className={stickyAction({ mode, className })} {...props}>
      {task ? (
        <div className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-6 [&>*:last-child]:w-full md:[&>*:last-child]:w-auto">
          {summary && <p className="m-0 text-sm font-semibold tabular-nums text-fg">{summary}</p>}
          {children}
        </div>
      ) : (
        <div className="mx-auto flex max-w-md flex-col [&>*]:w-full">{children}</div>
      )}
    </div>
  );
}
