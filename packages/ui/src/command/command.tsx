// Client. A command palette on cmdk: the combobox / listbox roles, the active option (aria-activedescendant), the
// arrows, Home / End, Enter, and the filtering (turn it off with `shouldFilter={false}` when the server searches).
// `CommandDialog` puts it in the platform's Dialog. Words arrive as props.
import { Command as CommandPrimitive } from "cmdk";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { DialogContent, type DialogContentProps } from "../dialog/dialog";

export const command = tv({
  slots: {
    root: "flex h-full w-full flex-col overflow-hidden bg-surface-1 text-fg",
    inputWrap: "flex items-center gap-3 border-b border-border-default px-4",
    icon: "h-5 w-5 shrink-0 text-fg-secondary",
    input:
      "h-13 w-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-hidden placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:text-base",
    list: "max-h-[min(60dvh,26rem)] scroll-py-2 overflow-y-auto overscroll-contain p-2 [&:not(:has([cmdk-item]))]:p-0",
    empty: "px-3 py-8 text-center text-sm text-fg-secondary",
    loading: "px-3 py-6 text-center text-sm text-fg-secondary",
    group:
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs " +
      "[&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-secondary",
    item:
      "relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg outline-hidden transition-colors " +
      "before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent " +
      "data-[selected=true]:bg-surface-2 data-[selected=true]:before:bg-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40",
    separator: "-mx-2 my-1 h-px bg-border-subtle",
    shortcut: "ml-auto text-xs tracking-widest text-fg-secondary",
  },
});
const s = command();

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export type CommandRootProps = React.ComponentProps<typeof CommandPrimitive> & {
  /** The accessible name of the palette — passed translated ("Search", "Commands"). */
  label: string;
};

/** The palette: `value` / `onValueChange` (the active item), `shouldFilter`, `filter`, `loop`. */
export function CommandRoot({ className, ...props }: CommandRootProps) {
  return <CommandPrimitive className={s.root({ className })} {...props} />;
}

export type CommandInputProps = Omit<React.ComponentProps<typeof CommandPrimitive.Input>, "placeholder"> & {
  /** What to type — passed translated. The input is named by the palette's `label`. */
  placeholder: string;
  /** After the input, inside the bar: a spinner, a clear button. */
  trailing?: React.ReactNode;
};

/** The search field (`value` / `onValueChange` for the query), with a magnifier. */
export function CommandInput({ className, placeholder, trailing, ...props }: CommandInputProps) {
  return (
    <div className={s.inputWrap()} cmdk-input-wrapper="">
      <SearchIcon className={s.icon()} />
      <CommandPrimitive.Input placeholder={placeholder} className={s.input({ className })} {...props} />
      {trailing}
    </div>
  );
}

// Set inside `Command.List`: a listbox may only hold options and groups (axe `aria-required-children`), so the empty
// message must live beside it, not in it.
const InsideList = React.createContext(false);

export type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List> & {
  /** The accessible name of the list of results — passed translated ("Suggestions", "Results"). */
  label: string;
  /**
   * Shown when nothing matches — passed translated. Rendered after the listbox, never inside it: an empty listbox is
   * valid, a listbox holding text is not.
   */
  emptyLabel?: React.ReactNode;
};

export function CommandList({ className, emptyLabel, children, ...props }: CommandListProps) {
  return (
    <>
      <CommandPrimitive.List className={s.list({ className })} {...props}>
        <InsideList.Provider value>{children}</InsideList.Provider>
      </CommandPrimitive.List>
      {emptyLabel === undefined ? null : <CommandEmpty emptyLabel={emptyLabel} />}
    </>
  );
}

export type CommandEmptyProps = Omit<React.ComponentProps<typeof CommandPrimitive.Empty>, "children"> & {
  /** Shown when nothing matches — passed translated. */
  emptyLabel: React.ReactNode;
};

/**
 * Shown by cmdk only when no item matches. Place it beside `Command.List` (or pass `emptyLabel` to the list), never
 * inside it: inside, it is rendered as before but warns in development — the listbox then holds text, which axe
 * refuses (`aria-required-children`).
 */
export function CommandEmpty({ className, emptyLabel, ...props }: CommandEmptyProps) {
  const inside = React.useContext(InsideList);
  React.useEffect(() => {
    if (inside && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      console.warn("@krizaka/ui/command: <Command.Empty> inside <Command.List> breaks the listbox (axe aria-required-children). Pass `emptyLabel` to <Command.List> instead.");
    }
  }, [inside]);
  return (
    <CommandPrimitive.Empty className={s.empty({ className })} {...props}>
      {emptyLabel}
    </CommandPrimitive.Empty>
  );
}

/** While results load (`label` is announced). */
export function CommandLoading({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Loading>) {
  return <CommandPrimitive.Loading className={s.loading({ className })} {...props} />;
}

/** A group of items under a `heading`. */
export function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandPrimitive.Group className={s.group({ className })} {...props} />;
}

/** An option: `onSelect` on Enter or click, `value` and `keywords` for the filter, `disabled`. */
export function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return <CommandPrimitive.Item className={s.item({ className })} {...props} />;
}

/** A line between groups. Decorative (`role="none"`): cmdk's own separator is a role a listbox may not hold (axe). */
export function CommandSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="none" className={s.separator({ className })} {...props} />;
}

/** A keyboard hint at the end of an item. */
export function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={s.shortcut({ className })} {...props} />;
}

/** `Command.Root/Input/List/Empty/Loading/Group/Item/Separator/Shortcut`. */
export const Command = {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Loading: CommandLoading,
  Group: CommandGroup,
  Item: CommandItem,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
};

export type CommandDialogProps = Omit<CommandRootProps, "title"> & {
  /** Open or closed (controlled), with `onOpenChange`. */
  open?: boolean;
  /** Open at first, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes (Escape, a click outside, a shortcut of the product). */
  onOpenChange?: (open: boolean) => void;
  /** Under the palette, inside the dialog: shortcuts, a "see all results" link. */
  footer?: React.ReactNode;
  /** Passed to `Dialog.Content`: `size`, `container`, `className` of the dialog. */
  contentProps?: Omit<Extract<DialogContentProps, { hideClose: true }>, "hideClose" | "children" | "placement">;
};

/**
 * The palette in a dialog (Radix: focus trap, Escape, focus return). The dialog is named by `label`; it has no close
 * button — Escape and a click outside close it — and the input takes the focus when it opens.
 */
export function CommandDialog({ open, defaultOpen, onOpenChange, footer, contentProps, label, className, children, ...props }: CommandDialogProps) {
  const { className: contentClassName, ...content } = contentProps ?? {};
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        size="lg"
        aria-describedby={undefined}
        className={cn("top-[12dvh] translate-y-0 sm:top-[14dvh]", contentClassName)}
        {...content}
      >
        <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
        <CommandRoot label={label} className={className} {...props}>
          {children}
        </CommandRoot>
        {footer}
      </DialogContent>
    </DialogPrimitive.Root>
  );
}
