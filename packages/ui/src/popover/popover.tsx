// Client (a portal). Radix places the content, traps nothing, closes on Escape and on an outside click, and returns
// the focus to the trigger.
import { Popover as PopoverPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "../cn";
import { floating } from "../floating";

export type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  /** The element the portal renders into (default: document.body). */
  container?: HTMLElement | null;
};

export function PopoverContent({ sideOffset = 8, collisionPadding = 8, container, className, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(floating, "w-72 max-w-(--radix-popover-content-available-width) p-4 origin-(--radix-popover-content-transform-origin)", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/** `Popover.Root/Trigger/Anchor/Content/Close`. `open`/`defaultOpen` + `onOpenChange`. */
export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Anchor: PopoverPrimitive.Anchor,
  Close: PopoverPrimitive.Close,
  Content: PopoverContent,
};
