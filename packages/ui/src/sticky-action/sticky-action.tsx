// Server-safe: pure CSS. The main action of a page, stuck to the bottom of a phone's screen while the page scrolls: put it
// as the last child of the page's `main` (a sticky element holds the viewport's edge inside its container). From `md` up it
// is not drawn — the page's own buttons are within reach.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const stickyAction = tv({
  base: "sticky bottom-0 z-30 border-t border-border-subtle bg-surface-1/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden",
});

export type StickyActionProps = React.ComponentProps<"div"> & {
  /** The action: one `ButtonLink` (full width is added). */
  children: React.ReactNode;
};

/** The one action of a page, held at the bottom edge of a phone. */
export function StickyAction({ className, children, ...props }: StickyActionProps) {
  return (
    <div className={stickyAction({ className })} {...props}>
      <div className="mx-auto flex max-w-md flex-col [&>*]:w-full">{children}</div>
    </div>
  );
}
