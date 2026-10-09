// Client. A confirmation that interrupts: Radix AlertDialog (role="alertdialog", no outside click, focus on Cancel).
// `onConfirm` may be async: the dialog stays open with the confirm button loading until it settles, closes when it
// resolves, and stays open when it rejects (the product shows the error).
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import * as React from "react";

import { Button } from "../button/button";
import { dialog } from "./dialog";

const s = dialog({ placement: "center", size: "sm" });

export type AlertDialogProps = {
  /** Open or closed (controlled), with `onOpenChange`. */
  open?: boolean;
  /** Open at first, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes (never while `onConfirm` is pending). */
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the dialog (rendered as is, `asChild`): a Button, an IconButton. */
  trigger?: React.ReactNode;
  /** The question asked ("Delete this video?"): the dialog's accessible name. */
  title: React.ReactNode;
  /** What the action does and what it costs: the dialog's description. */
  description?: React.ReactNode;
  /** More content between the description and the actions. */
  children?: React.ReactNode;
  /** The words of the confirm button — passed translated. */
  confirmLabel: string;
  /** The words of the cancel button (it takes the focus at open) — passed translated. */
  cancelLabel: string;
  /** `danger` for a destructive action (delete, leave, cancel a payment). */
  tone?: "danger" | "primary";
  /** Runs on confirm. A promise keeps the dialog open and the button loading until it settles. */
  onConfirm: () => void | Promise<unknown>;
  /** The element the portal renders into (default: document.body). */
  container?: HTMLElement | null;
  /** Classes of the dialog's content, merged last. */
  className?: string;
};

export function AlertDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  tone = "primary",
  onConfirm,
  container,
  className,
}: AlertDialogProps) {
  const [openState, setOpenState] = React.useState(defaultOpen);
  const [pending, setPending] = React.useState(false);
  const open = openProp ?? openState;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // Stays open: the product reports the failure (a toast, an inline error) and the person may retry.
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={(next) => (pending ? undefined : setOpen(next))}>
      {trigger && <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal container={container}>
        <AlertDialogPrimitive.Overlay className={s.overlay()} />
        <AlertDialogPrimitive.Content
          data-tone={tone}
          aria-busy={pending || undefined}
          className={s.content({ className })}
          onEscapeKeyDown={(event) => pending && event.preventDefault()}
        >
          <div className={s.header({ className: "pr-5" })}>
            <AlertDialogPrimitive.Title className={s.title()}>{title}</AlertDialogPrimitive.Title>
            {description && <AlertDialogPrimitive.Description className={s.description()}>{description}</AlertDialogPrimitive.Description>}
          </div>
          {children && <div className={s.body()}>{children}</div>}
          <div className={s.footer()}>
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="ghost" disabled={pending}>
                {cancelLabel}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <Button variant={tone === "danger" ? "danger" : "primary"} loading={pending} onClick={confirm}>
              {confirmLabel}
            </Button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
