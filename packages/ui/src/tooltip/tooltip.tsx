// Client (a portal). A short label for a control, on hover after `delayDuration` and on keyboard focus at once;
// Escape dismisses it. It names nothing: the control keeps its own accessible name (an IconButton's `label`).
import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "../cn";
import { floating } from "../floating";
import { Kbd } from "../kbd";

/** Optional, once near the root: shares `delayDuration` and the skip delay between tooltips. */
export const TooltipProvider = TooltipPrimitive.Provider;

export type TooltipProps = Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content" | "children"> & {
  /** What the tooltip says — passed translated. With a `title`, the line under it. */
  content: React.ReactNode;
  /** A rich tooltip: a bold first line above `content` (the name of a tool, of a figure) — passed translated. */
  title?: React.ReactNode;
  /** The keyboard shortcut of the action, one key per entry (`["⌘", "K"]`), shown as keys at the end. */
  shortcut?: readonly string[];
  /** The trigger, rendered as is (`asChild`): a focusable element. */
  children: React.ReactNode;
  /** Open or closed (controlled), with `onOpenChange`. */
  open?: boolean;
  /** Open at first, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms before it opens (300 by default). */
  delayDuration?: number;
  /** The element the portal renders into (default: document.body). */
  container?: HTMLElement | null;
};

export function Tooltip({
  content,
  title,
  shortcut,
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
            data-rich={title !== undefined ? "" : undefined}
            className={cn(
              floating,
              "flex max-w-xs items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs font-medium origin-(--radix-tooltip-content-transform-origin) data-rich:max-w-sm data-rich:px-3 data-rich:py-2.5",
              className,
            )}
            {...props}
          >
            {title !== undefined ? (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-semibold text-fg">{title}</span>
                <span className="font-normal text-fg-secondary">{content}</span>
              </span>
            ) : (
              <span className="min-w-0">{content}</span>
            )}
            {shortcut && shortcut.length > 0 && (
              <span className="ml-auto flex shrink-0 gap-0.5 self-start">
                {shortcut.map((key, i) => (
                  <Kbd key={`${key}-${i}`} size="sm">
                    {key}
                  </Kbd>
                ))}
              </span>
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
