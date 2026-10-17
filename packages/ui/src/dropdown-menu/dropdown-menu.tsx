// Client (a portal). Radix does the roving focus, the arrows, Home/End, typeahead, Escape and the focus return.
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { floating } from "../floating";

export const menu = tv({
  slots: {
    content: cn(floating, "min-w-48 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto overflow-x-hidden overscroll-contain p-1 origin-(--radix-dropdown-menu-content-transform-origin)"),
    item:
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm text-fg outline-hidden transition-colors " +
      "data-highlighted:bg-surface-3 data-disabled:pointer-events-none data-disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 " +
      "[&>svg]:text-fg-secondary",
    indicator: "ml-auto flex h-4 w-4 items-center justify-center text-fg-accent",
    label: "px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-fg-secondary",
    separator: "-mx-1 my-1 h-px bg-border-subtle",
  },
  variants: {
    // The label reads in the danger text role (≥ 4.5:1 on the menu surface, both themes); the icon and the highlight
    // carry the danger fill.
    tone: { default: {}, danger: { item: "text-fg-danger data-highlighted:bg-danger/15 [&>svg]:text-danger" } },
  },
  defaultVariants: { tone: "default" },
});
const s = menu();

export type DropdownMenuContentProps = React.ComponentProps<typeof MenuPrimitive.Content> & {
  /** The element the portal renders into (default: document.body). */
  container?: HTMLElement | null;
};

export function DropdownMenuContent({ sideOffset = 6, align = "end", collisionPadding = 8, container, className, ...props }: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Content sideOffset={sideOffset} align={align} collisionPadding={collisionPadding} className={s.content({ className })} {...props} />
    </MenuPrimitive.Portal>
  );
}

export type DropdownMenuItemProps = React.ComponentProps<typeof MenuPrimitive.Item> & {
  /** `danger` for a destructive action: the icon and the highlight carry the danger, the label stays legible. */
  tone?: "default" | "danger";
};

/** An action. `tone="danger"` for a destructive one; `onSelect` runs it (the menu closes). */
export function DropdownMenuItem({ tone, className, ...props }: DropdownMenuItemProps) {
  return <MenuPrimitive.Item data-tone={tone ?? "default"} className={menu({ tone }).item({ className })} {...props} />;
}

/** A toggled option: `checked` + `onCheckedChange`. */
export function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={s.item({ className })} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className={s.indicator()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

/** A submenu's trigger: an item that opens `DropdownMenu.SubContent`, with a chevron. */
export function DropdownMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return (
    <MenuPrimitive.SubTrigger className={s.item({ className: cn("data-[state=open]:bg-surface-3", className) })} {...props}>
      {children}
      <svg className="ml-auto !h-4 !w-4 text-fg-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m9 18 6-6-6-6" />
      </svg>
    </MenuPrimitive.SubTrigger>
  );
}

/** The submenu's panel (same material as the menu). */
export function DropdownMenuSubContent({ sideOffset = 4, collisionPadding = 8, className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent sideOffset={sideOffset} collisionPadding={collisionPadding} className={s.content({ className: cn("max-h-(--radix-dropdown-menu-content-available-height)", className) })} {...props} />
    </MenuPrimitive.Portal>
  );
}

/** One choice among several (`DropdownMenu.RadioGroup` holds the value): a language, a sort order. */
export function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={s.item({ className })} {...props}>
      {children}
      <MenuPrimitive.ItemIndicator className={s.indicator()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={s.label({ className })} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={s.separator({ className })} {...props} />;
}

/** `DropdownMenu.Root/Trigger/Content/Item/CheckboxItem/Label/Separator/Group`. `open`/`defaultOpen` + `onOpenChange`. */
export const DropdownMenu = {
  Root: MenuPrimitive.Root,
  Trigger: MenuPrimitive.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Group: MenuPrimitive.Group,
  Sub: MenuPrimitive.Sub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  RadioGroup: MenuPrimitive.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
};
