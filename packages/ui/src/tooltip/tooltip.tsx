// Client (a portal). A short label for a control, on hover after `delayDuration` and on keyboard focus at once;
// Escape dismisses it. It names nothing: the control keeps its own accessible name (an IconButton's `label`).
import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "../cn";
import { floating } from "../floating";

/** Optional, once near the root: shares `delayDuration` and the skip delay between tooltips. */
export const TooltipProvider = TooltipPrimitive.Provider;

export type TooltipProps = Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content" | "children"> & {
  /** What the tooltip says — passed translated. */
  content: React.ReactNode;
  /** The trigger, rendered as is (`asChild`): a focusable element. */
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms before it opens (300 by default). */
  delayDuration?: number;
  /** The element the portal renders into (default: document.body). */
  container?: HTMLElement | null;
};

export function Tooltip({
  content,
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 300,
  container,
  sideOffset = 6,
  collisionPadding = 8,
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={container}>
          <TooltipPrimitive.Content
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            className={cn(floating, "max-w-xs px-2.5 py-1.5 text-xs font-medium origin-(--radix-tooltip-content-transform-origin)", className)}
            {...props}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
