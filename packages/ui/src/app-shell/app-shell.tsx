// Client (the collapse, the drawer, the shortcuts). The shell of an application screen, read from the products' consoles
// (Orochia admin and studio, Orazaka web-admin and web-client): a sidebar of sections that collapses to its icons on a
// desktop, a header with the screen's title, a search that opens the app's command palette and its actions, the content —
// and below `md` the sidebar becomes a drawer opened from the header (Radix Dialog: focus trap, Escape, focus return).
// Keyboard: ⌘/Ctrl+B folds the sidebar, ⌘/Ctrl+K opens the search, `g` then a letter goes to a section (`shortcut` of an
// item). Words arrive as props; links through `asChild`.
import { SkipLink } from "@krizaka/ui/skip-link";
import { Dialog as DialogPrimitive, Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { ChevronGlyph, CloseGlyph, SearchGlyph } from "../glyphs";
import { Kbd } from "../kbd";
import { ariaKeyShortcuts, formatShortcut, useApple, useShortcuts } from "./shortcuts";

export const appShell = tv({
  slots: {
    root: "flex min-h-dvh w-full bg-surface-0 text-fg",
    sidebar:
      "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border-subtle bg-surface-1 transition-[width] duration-300 motion-reduce:transition-none md:flex " +
      "w-64 data-collapsed:w-[4.25rem]",
    drawer:
      "kz-dialog fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-border-default bg-surface-1 pl-[env(safe-area-inset-left)] shadow-lg focus:outline-hidden",
    overlay: "kz-overlay fixed inset-0 z-50 bg-overlay backdrop-blur-xs",
    brand: "flex h-14 shrink-0 items-center gap-2.5 px-4 font-display text-[15px] font-bold tracking-tight [[data-collapsed]_&]:justify-center [[data-collapsed]_&]:px-0",
    nav: "flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2",
    group: "mt-3 mb-1 px-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg-secondary [[data-collapsed]_&]:sr-only",
    item:
      "group/item relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-fg-secondary no-underline transition-colors " +
      "hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg " +
      "aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:-left-2 aria-[current=page]:before:w-1 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-accent " +
      "[[data-collapsed]_&]:justify-center [[data-collapsed]_&]:px-0 [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:shrink-0",
    itemLabel: "min-w-0 flex-1 truncate [[data-collapsed]_&]:sr-only",
    itemHint: "ml-auto hidden items-center gap-0.5 text-fg-secondary group-hover/item:flex group-focus-visible/item:flex [[data-collapsed]_&]:!hidden",
    itemBadge:
      "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-on-accent " +
      "[[data-collapsed]_&]:absolute [[data-collapsed]_&]:right-1.5 [[data-collapsed]_&]:top-1 [[data-collapsed]_&]:min-w-4 [[data-collapsed]_&]:px-1 [[data-collapsed]_&]:text-[10px]",
    footer: "shrink-0 border-t border-border-subtle p-2",
    collapse:
      "hidden h-9 w-full items-center gap-2 rounded-lg px-3 text-xs font-medium text-fg-secondary hover:bg-surface-2 hover:text-fg md:flex " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring [[data-collapsed]_&]:justify-center [[data-collapsed]_&]:px-0",
    body: "flex min-w-0 flex-1 flex-col",
    header:
      "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-0/85 px-4 backdrop-blur-xl md:px-6",
    menuButton:
      "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-1 text-fg md:hidden " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    title: "min-w-0 flex-1 truncate font-display text-base font-bold tracking-tight",
    search:
      "inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-1 px-2.5 text-sm text-fg-secondary transition-colors " +
      "hover:border-border-default hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring md:w-56 md:justify-start [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
    searchLabel: "sr-only md:not-sr-only md:flex-1 md:truncate md:text-left",
    searchKeys: "hidden items-center gap-0.5 md:flex",
    actions: "ml-auto flex shrink-0 items-center gap-2",
    main: "min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8",
  },
});
const s = appShell();

interface ShellState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inDrawer: boolean;
}
const ShellContext = React.createContext<ShellState | null>(null);
const useShell = () => {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("AppShell parts must be inside <AppShell.Root>");
  return ctx;
};

export type AppShellRootProps = React.ComponentProps<"div"> & {
  /** The sidebar starts collapsed to its icons (desktop). */
  defaultCollapsed?: boolean;
  /** Controlled collapse (desktop): pair with `onCollapsedChange` to persist the choice. */
  collapsed?: boolean;
  /** Called when the sidebar collapses or expands. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The words of the "skip to content" link (`Skip to content`), the first tab stop; it lands on `AppShell.Main`. Without it, no link. */
  skipLabel?: string;
  /**
   * The shortcut that folds and unfolds the sidebar (a combination: `mod+b` is ⌘B on a Mac, Ctrl+B elsewhere), or `false`
   * for none.
   * @default "mod+b"
   */
  collapseShortcut?: string | false;
};

/** The shell: holds the collapse (desktop) and the drawer (phone) state. Children: Sidebar, then Body. */
export function AppShellRoot({ defaultCollapsed = false, collapsed: controlled, onCollapsedChange, skipLabel, collapseShortcut = "mod+b", className, children, ...props }: AppShellRootProps) {
  const [own, setOwn] = React.useState(defaultCollapsed);
  const [open, setOpen] = React.useState(false);
  const collapsed = controlled ?? own;
  const setCollapsed = React.useCallback(
    (value: boolean) => {
      if (controlled === undefined) setOwn(value);
      onCollapsedChange?.(value);
    },
    [controlled, onCollapsedChange],
  );
  const value = React.useMemo(() => ({ collapsed, setCollapsed, open, setOpen, inDrawer: false }), [collapsed, setCollapsed, open]);
  useShortcuts(collapseShortcut ? { [collapseShortcut]: () => setCollapsed(!collapsed) } : {});
  return (
    <ShellContext.Provider value={value}>
      <div className={s.root({ className })} {...props}>
        {skipLabel && <SkipLink href="#content">{skipLabel}</SkipLink>}
        {children}
      </div>
    </ShellContext.Provider>
  );
}

export type AppShellSidebarProps = Omit<React.ComponentProps<"nav">, "children"> & {
  /** The navigation's accessible name (`Studio`, `Administration`). */
  label: string;
  /** The brand at the top: the product's mark and name (a link home through `asChild` of your router, or plain). */
  brand?: React.ReactNode;
  /** The sections: `AppShell.Group` and `AppShell.Item`. */
  children: React.ReactNode;
  /** At the bottom, above the collapse button: the account, a plan, the version. */
  footer?: React.ReactNode;
  /** The collapse button's words, `[collapse, expand]` (desktop only). Without it the sidebar cannot collapse. */
  collapseLabels?: readonly [string, string];
  /** The drawer's close button words (phone). */
  closeLabel: string;
};

function SidebarContent({ brand, children, footer, collapseLabels, closeLabel }: Pick<AppShellSidebarProps, "brand" | "children" | "footer" | "collapseLabels" | "closeLabel">) {
  const { collapsed, setCollapsed, inDrawer } = useShell();
  return (
    <>
      <div className={s.brand()}>
        {brand}
        {inDrawer && (
          <DialogPrimitive.Close className={cn(s.menuButton(), "ml-auto flex")} aria-label={closeLabel}>
            <CloseGlyph className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </div>
      <div className={s.nav()}>{children}</div>
      {(footer || (collapseLabels && !inDrawer)) && (
        <div className={s.footer()}>
          {footer}
          {collapseLabels && !inDrawer && (
            <button type="button" className={s.collapse()} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
              <ChevronGlyph direction={collapsed ? "right" : "left"} className="h-4 w-4" />
              <span className={collapsed ? "sr-only" : undefined}>{collapsed ? collapseLabels[1] : collapseLabels[0]}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}

/** The sidebar: on a desktop a column that collapses to its icons; on a phone the same content in a drawer. */
export function AppShellSidebar({ label, brand, children, footer, collapseLabels, closeLabel, className, ...props }: AppShellSidebarProps) {
  const shell = useShell();
  const content = { brand, children, footer, collapseLabels, closeLabel };
  return (
    <>
      <nav aria-label={label} data-collapsed={shell.collapsed ? "" : undefined} className={s.sidebar({ className })} {...props}>
        <SidebarContent {...content} />
      </nav>
      <DialogPrimitive.Root open={shell.open} onOpenChange={shell.setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className={s.overlay()} />
          <DialogPrimitive.Content className={s.drawer()} aria-describedby={undefined}>
            <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
            <ShellContext.Provider value={{ ...shell, collapsed: false, inDrawer: true }}>
              <nav aria-label={label} className="flex min-h-0 flex-1 flex-col" onClick={(e) => (e.target as Element).closest("a") && shell.setOpen(false)}>
                <SidebarContent {...content} />
              </nav>
            </ShellContext.Provider>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

export type AppShellGroupProps = React.ComponentProps<"p"> & {
  /** The group's name, above its items (hidden when the sidebar is collapsed). */
  children: React.ReactNode;
};

/** A heading between groups of items. */
export function AppShellGroup({ className, ...props }: AppShellGroupProps) {
  return <p className={s.group({ className })} {...props} />;
}

export type AppShellItemProps = Omit<React.ComponentProps<"a">, "children"> & {
  /** The item's icon (a signature icon): it stays when the sidebar collapses. */
  icon?: React.ReactNode;
  /** Its words: the accessible name, hidden visually when collapsed (the icon carries a tooltip through `title`). */
  label: string;
  /** The screen it opens is the current one: `aria-current="page"`. */
  current?: boolean;
  /** A count beside it (unread, pending): a number or a few characters. */
  badge?: React.ReactNode;
  /**
   * A keyboard shortcut that goes to it: a sequence (`g d`: G then D) or a combination (`mod+1`). It clicks the item, so a
   * router link navigates. The keys are shown on hover and focus when the sidebar is open.
   */
  shortcut?: string;
  /** Renders your link (Next's `Link`) with the item's look: pass it as the only child. */
  asChild?: boolean;
  /** Your link element when `asChild`. */
  children?: React.ReactElement;
};

/** A destination of the sidebar: icon, words, a count. */
export function AppShellItem({ icon, label, current, badge, shortcut, asChild, children, className, ...props }: AppShellItemProps) {
  const { collapsed, inDrawer } = useShell();
  const element = React.useRef<HTMLAnchorElement>(null);
  const apple = useApple();
  // Only the sidebar's own items listen: the drawer holds a copy of them, open or not.
  useShortcuts(shortcut && !inDrawer ? { [shortcut]: () => element.current?.click() } : {});
  const Comp = asChild ? Slot.Root : "a";
  const inner = (
    <>
      {icon}
      <span className={s.itemLabel()}>{label}</span>
      {badge != null && <span className={s.itemBadge()}>{badge}</span>}
      {shortcut && !inDrawer ? (
        <span className={s.itemHint()} aria-hidden>
          {formatShortcut(shortcut, apple).map((key) => (
            <Kbd key={key} size="sm">
              {key}
            </Kbd>
          ))}
        </span>
      ) : null}
    </>
  );
  return (
    <Comp ref={element} aria-current={current ? "page" : undefined} aria-keyshortcuts={shortcut ? ariaKeyShortcuts(shortcut, apple) : undefined} title={collapsed ? label : undefined} className={s.item({ className })} {...props}>
      {asChild && children ? React.cloneElement(children, undefined, inner) : inner}
    </Comp>
  );
}

/** The column right of the sidebar: Header, then Main. */
export function AppShellBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.body({ className })} {...props} />;
}

export type AppShellHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** The screen's title (an `h1`). */
  title?: React.ReactNode;
  /** The button that opens the drawer on a phone: its words. */
  menuLabel: string;
  /** The screen's actions, on the right. */
  actions?: React.ReactNode;
};

/** The top of the screen: the drawer's button (phone), the title, the actions. Sticky. */
export function AppShellHeader({ title, menuLabel, actions, className, children, ...props }: AppShellHeaderProps) {
  const { open, setOpen } = useShell();
  return (
    <header className={s.header({ className })} {...props}>
      <button type="button" className={s.menuButton()} aria-label={menuLabel} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>
      {title && <h1 className={s.title()}>{title}</h1>}
      {children}
      {actions && <div className={s.actions()}>{actions}</div>}
    </header>
  );
}

export type AppShellSearchProps = Omit<React.ComponentProps<"button">, "children" | "onClick"> & {
  /** The words ("Search", "Search creators"): the accessible name, shown beside the keys on a desktop. */
  label: string;
  /** Called when the button is pressed or the shortcut is typed: open your command palette (`CommandDialog`) here. */
  onOpen: () => void;
  /**
   * The shortcut that opens it (a combination); shown on its keys.
   * @default "mod+k"
   */
  shortcut?: string;
};

/** The header's search: a button that looks like a field (a magnifier, its words, ⌘K) and opens the app's command palette. */
export function AppShellSearch({ label, onOpen, shortcut = "mod+k", className, ...props }: AppShellSearchProps) {
  const apple = useApple();
  useShortcuts({ [shortcut]: () => onOpen() });
  return (
    <button type="button" className={s.search({ className })} aria-keyshortcuts={ariaKeyShortcuts(shortcut, apple)} onClick={onOpen} {...props}>
      <SearchGlyph />
      <span className={s.searchLabel()}>{label}</span>
      <span className={s.searchKeys()} aria-hidden>
        {formatShortcut(shortcut, apple).map((key) => (
          <Kbd key={key} size="sm">
            {key}
          </Kbd>
        ))}
      </span>
    </button>
  );
}

/** The screen's content. */
export function AppShellMain({ className, ...props }: React.ComponentProps<"main">) {
  return <main id="content" tabIndex={-1} className={s.main({ className })} {...props} />;
}

export const AppShell = {
  Root: AppShellRoot,
  Sidebar: AppShellSidebar,
  Group: AppShellGroup,
  Item: AppShellItem,
  Body: AppShellBody,
  Header: AppShellHeader,
  Search: AppShellSearch,
  Main: AppShellMain,
};
