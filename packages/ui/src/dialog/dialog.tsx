// Client (a portal). Radix does the focus trap, the scroll lock, Escape, the outside click, aria-modal, the
// aria-labelledby / aria-describedby wiring and the focus return: this file only holds the shape.
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { IconButton } from "../button/button";

export const dialog = tv({
  slots: {
    overlay: "kz-overlay fixed inset-0 z-50 bg-overlay backdrop-blur-xs",
    content:
      "kz-dialog fixed z-50 flex flex-col overflow-hidden border border-border-default bg-surface-1 text-fg shadow-lg focus:outline-hidden",
    close: "absolute right-3 top-3 h-9 w-9",
    header: "flex flex-col gap-1 px-5 pb-2 pr-14 pt-5",
    title: "text-base font-bold text-fg",
    description: "text-sm text-fg-secondary",
    body: "min-h-0 flex-1 overflow-y-auto px-5 pb-5",
    footer:
      "flex flex-wrap items-center justify-end gap-2 border-t border-border-subtle px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
  },
  variants: {
    placement: {
      center: { content: "left-1/2 top-1/2 max-h-[85dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl" },
      /* A sheet: anchored at the bottom on a phone, centred from `sm` up. */
      bottom: {
        content:
          "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[1.75rem] sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full " +
          "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem]",
      },
      right: { content: "inset-y-0 right-0 h-full w-full max-w-md rounded-none border-y-0 border-r-0" },
    },
    size: { sm: { content: "sm:max-w-sm" }, md: { content: "sm:max-w-md" }, lg: { content: "sm:max-w-2xl" } },
  },
  defaultVariants: { placement: "center", size: "md" },
});
const s = dialog();

export type DialogVariants = VariantProps<typeof dialog>;

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  DialogVariants & {
    /** The accessible name of the close button — passed translated. */
    closeLabel: string;
    /** The element the portal renders into (default: document.body). */
    container?: HTMLElement | null;
  };

/** The dialog itself, portalled over a dimmed overlay, with a close button. Give it a `Dialog.Title`. */
export function DialogContent({ placement, size, closeLabel, container, className, children, ...props }: DialogContentProps) {
  const v = dialog({ placement, size });
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className={v.overlay()} />
      <DialogPrimitive.Content data-placement={placement ?? "center"} className={v.content({ className })} {...props}>
        {children}
        <DialogPrimitive.Close asChild>
          <IconButton label={closeLabel} variant="ghost" shape="pill" className={v.close()}>
            <CloseIcon />
          </IconButton>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.header({ className })} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={s.title({ className })} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={s.description({ className })} {...props} />;
}

export function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.body({ className })} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.footer({ className })} {...props} />;
}

/** `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close`. `open`/`defaultOpen` + `onOpenChange`. */
export const Dialog = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Close: DialogPrimitive.Close,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
};

export type SheetProps = Omit<DialogContentProps, "placement">;

/** A sheet is a dialog anchored at the bottom (centred from `sm` up): `Dialog.Content placement="bottom"`. */
export function Sheet(props: SheetProps) {
  return <DialogContent placement="bottom" {...props} />;
}
