// Client (the expand state, the arrow keys, the tooltip). The compact navigation of an application, read from Orazaka's
// web client: a vertical rail of icons on a desktop — the product's mark on top, a tooltip on each icon, the current one
// marked by an accent bar on its left edge, a footer for settings and the account — that becomes a bottom tab bar on a
// phone. The same nodes in both: only the layout changes, so the items, their order and their words are written once.
// The mark lives in the rail on a desktop; on a phone, where the rail has no room for it, `AppHeader` shows it (the rule
// « one mark visible at every width »). Brand-aware through the tokens: `accent` scopes `.brand-<id>`.
import { Tooltip } from "@krizaka/ui/tooltip";
import { Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { ChevronGlyph } from "../glyphs";
import type { BrandId } from "../marks/ProductLogo";

export const railNav = tv({
  slots: {
    shell: "flex min-h-dvh w-full bg-surface-0 text-fg",
    root:
      // Phone: a bottom tab bar, clear of the home indicator. Desktop: a sticky column that is only as wide as its icons.
      "fixed inset-x-0 bottom-0 z-40 flex h-[calc(3.5rem+env(safe-area-inset-bottom))] flex-row border-t border-border-subtle bg-surface-1 pb-[env(safe-area-inset-bottom)] " +
      "md:sticky md:overflow-x-clip md:inset-auto md:top-0 md:bottom-auto md:z-auto md:h-dvh md:w-14 md:shrink-0 md:flex-col md:border-t-0 md:border-r md:bg-surface-1 md:pb-0 " +
      "md:transition-[width] md:duration-300 motion-reduce:md:transition-none md:data-expanded:w-56",
    // The mark is the rail's on a desktop; hidden on a phone (the header carries it there).
    mark: "hidden h-14 w-full shrink-0 items-center overflow-hidden justify-center md:flex md:group-data-expanded/rail:justify-start md:group-data-expanded/rail:px-4",
    group: "flex min-w-0 flex-row items-stretch md:flex-col md:items-center md:gap-1 md:px-1.5 md:group-data-expanded/rail:items-stretch",
    main: "max-md:grow-(--rail-n) md:flex-1 md:py-2",
    foot: "max-md:grow-(--rail-n) md:border-t md:border-border-subtle md:py-2",
    // The shortcuts: the product's quick ways in (a saved view, a client, « new invoice »), desktop only — a phone's tab bar
    // keeps its five destinations. Their heading shows once the rail is expanded; collapsed, it names the group.
    shortcuts: "hidden md:flex md:border-t md:border-border-subtle md:py-2",
    shortcutsHeading: "sr-only md:group-data-expanded/rail:not-sr-only md:group-data-expanded/rail:px-3.5 md:group-data-expanded/rail:pb-1 md:group-data-expanded/rail:pt-1 text-[11px] font-semibold text-fg-secondary",
    item:
      "group/item relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium text-fg-secondary no-underline transition-colors " +
      "hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring-inset " +
      "aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg-accent " +
      // The accent bar: on the top edge of a tab, on the left edge of a rail item.
      "before:absolute before:inset-x-3 before:top-0 before:h-[3px] before:rounded-b-full before:bg-accent before:opacity-0 before:transition-opacity aria-[current=page]:before:opacity-100 " +
      "md:h-10 md:w-full md:flex-none md:flex-row md:justify-center md:gap-3 md:rounded-none md:px-0 md:text-sm " +
      "md:before:inset-x-auto md:before:inset-y-2 md:before:left-0 md:before:top-2 md:before:h-auto md:before:w-[3px] md:before:rounded-r-full md:before:rounded-b-none " +
      "md:group-data-expanded/rail:justify-start md:group-data-expanded/rail:px-3.5 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0",
    icon: "relative inline-flex shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5",
    label: "max-w-full truncate leading-none md:sr-only md:text-sm md:leading-normal md:group-data-expanded/rail:not-sr-only",
    badge:
      "absolute -right-2 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-sm bg-accent px-1 text-[10px] font-bold leading-4 text-on-accent after:content-[attr(data-count)]",
    toggle:
      "hidden h-10 w-full items-center justify-center gap-3 text-xs font-medium text-fg-secondary hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring-inset md:flex " +
      "md:group-data-expanded/rail:justify-start md:group-data-expanded/rail:px-3.5",
    body: "flex min-w-0 flex-1 flex-col max-md:pb-[calc(3.5rem+env(safe-area-inset-bottom))]",
  },
});
const s = railNav();

interface RailState {
  expanded: boolean;
}
const RailContext = React.createContext<RailState | null>(null);
const useRail = () => {
  const ctx = React.useContext(RailContext);
  if (!ctx) throw new Error("RailNav parts must be inside <RailNav.Root>");
  return ctx;
};

/** The frame of the page: the rail, then `RailNav.Body` (the header and the content). A row on a desktop. */
export function RailNavShell({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.shell({ className })} {...props} />;
}

/** The column beside the rail: the `AppHeader`, then the content. On a phone it keeps clear of the tab bar. */
export function RailNavBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.body({ className })} {...props} />;
}

export type RailNavRootProps = Omit<React.ComponentProps<"nav">, "children"> & {
  /** The navigation's accessible name (`Orazaka`, `Studio`). */
  label: string;
  /** The product's mark on top of the rail, as a link home (`<Link href="/"><ProductLogo id="orazaka" /></Link>`); named by the app (its `aria-label`). Hidden on a phone: `AppHeader` shows it there. */
  mark?: React.ReactNode;
  /** The product's brand: scopes its colours (`brand-orazaka`…) over the rail, so the accent follows. Omit it inside a page that already wears the brand. */
  accent?: BrandId;
  /** The main destinations: `RailNav.Item`, the ones you work in. Five at most so that they fit a phone's tab bar. */
  children: React.ReactNode;
  /** At the foot of the rail (settings, account), after the main items; on a phone they follow them in the same bar. `RailNav.Item`s or a control with `data-rail-item`. */
  footer?: React.ReactNode;
  /** The product's shortcuts (`RailNav.Item`s: a saved view, a client, « New invoice »), a group above the footer and the expand toggle. Desktop only: a phone's tab bar keeps its destinations. */
  shortcuts?: React.ReactNode;
  /** The shortcuts' heading (« Raccourcis », « Shortcuts ») — passed translated: the group's name, shown once the rail is expanded. */
  shortcutsLabel?: string;
  /** Adds a button that widens the rail to show the words (desktop only). Needs `expandLabels`. */
  expandable?: boolean;
  /** Controlled width (pair with `onExpandedChange` to keep the choice). */
  expanded?: boolean;
  /** The starting width when uncontrolled. Unset: expanded from 1280 px (the words fit there), narrow below — until the person toggles it. */
  defaultExpanded?: boolean;
  /** Called when the toggle widens or narrows the rail. */
  onExpandedChange?: (expanded: boolean) => void;
  /** The toggle's words, `[expand, collapse]`. */
  expandLabels?: readonly [string, string];
};

const count = (node: React.ReactNode) => React.Children.toArray(node).length;

// The width from which an expandable rail shows its words by default — 80 rem (1280 px), Tailwind's `xl`.
const WIDE = "(min-width: 80rem)";
const subscribeWide = (onChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isWide = () => typeof window !== "undefined" && Boolean(window.matchMedia?.(WIDE).matches);
/** Whether the window is 1280 px wide or more; `false` on the server (the rail then widens before the first paint). */
function useWide() {
  return React.useSyncExternalStore(subscribeWide, isWide, () => false);
}

/** Moves the focus along the rail's items with the arrows (↑ ↓ on the rail, ← → on the tab bar; both always work), Home and End. */
function moveFocus(event: React.KeyboardEvent<HTMLElement>) {
  const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  const step = keys[event.key];
  if (step === undefined && event.key !== "Home" && event.key !== "End") return;
  const items = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-rail-item]")];
  if (items.length === 0) return;
  const here = items.findIndex((el) => el === document.activeElement || el.contains(document.activeElement));
  let next: number;
  if (event.key === "Home") next = 0;
  else if (event.key === "End") next = items.length - 1;
  else if (here < 0) next = step > 0 ? 0 : items.length - 1;
  else next = (here + step + items.length) % items.length;
  event.preventDefault();
  items[next]?.focus();
}

/** The rail: a vertical column of icons on a desktop, a bottom tab bar on a phone. */
export function RailNavRoot({
  label, mark, accent, children, footer, shortcuts, shortcutsLabel, expandable, expanded: controlled, defaultExpanded, onExpandedChange, expandLabels, className, onKeyDown, ...props
}: RailNavRootProps) {
  const [own, setOwn] = React.useState<boolean | undefined>(defaultExpanded);
  const wide = useWide();
  const headingId = React.useId();
  const expanded = expandable ? (controlled ?? own ?? wide) : false;
  const toggle = () => {
    if (controlled === undefined) setOwn(!expanded);
    onExpandedChange?.(!expanded);
  };
  const value = React.useMemo(() => ({ expanded }), [expanded]);
  return (
    <RailContext.Provider value={value}>
      <nav
        aria-label={label}
        data-expanded={expanded ? "" : undefined}
        className={cn("group/rail", accent && "brand-" + accent, s.root({ className }))}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) moveFocus(e);
        }}
        {...props}
      >
        {mark && (
          <div data-brand-mark className={s.mark()}>
            {mark}
          </div>
        )}
        <div className={s.group({ className: s.main() })} style={{ ["--rail-n" as string]: Math.max(count(children), 1) }}>
          {children}
        </div>
        {shortcuts && (
          <div role="group" aria-labelledby={shortcutsLabel ? headingId : undefined} data-rail-shortcuts="" className={s.group({ className: s.shortcuts() })}>
            {shortcutsLabel && (
              <p id={headingId} className={s.shortcutsHeading()}>
                {shortcutsLabel}
              </p>
            )}
            {shortcuts}
          </div>
        )}
        {(footer || expandable) && (
          <div className={s.group({ className: s.foot() })} style={{ ["--rail-n" as string]: Math.max(count(footer), 1) }}>
            {footer}
            {expandable && expandLabels && (
              <button type="button" data-rail-item className={s.toggle()} aria-expanded={expanded} onClick={toggle}>
                <ChevronGlyph direction={expanded ? "left" : "right"} className="h-4 w-4 shrink-0" />
                <span className={expanded ? undefined : "sr-only"}>{expanded ? expandLabels[1] : expandLabels[0]}</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </RailContext.Provider>
  );
}

export type RailNavItemProps = Omit<React.ComponentProps<"a">, "children"> & {
  /** The item's icon (a signature icon of `@krizaka/icons`): all that shows on a desktop rail. */
  icon: React.ReactNode;
  /** Its words: the accessible name, the tooltip, the tab's caption on a phone, the row's text when the rail is expanded. */
  label: string;
  /** This is the section the user is in: `aria-current="page"`, the accent bar and the accent colour. */
  current?: boolean;
  /** A count (unread, pending) on the icon. Say it in words with `badgeLabel`. */
  badge?: React.ReactNode;
  /** The count in words (« 3 unread »), appended to the accessible name. */
  badgeLabel?: string;
  /** Renders your router's link with the item's look: pass it as the only child. */
  asChild?: boolean;
  children?: React.ReactElement;
};

/** A destination of the rail. */
export function RailNavItem({ icon, label, current, badge, badgeLabel, asChild, children, className, ...props }: RailNavItemProps) {
  const { expanded } = useRail();
  const Comp = asChild ? Slot.Root : "a";
  const inner = (
    <>
      <span className={s.icon()}>
        {icon}
        {badge != null && (typeof badge === "string" || typeof badge === "number") ? (
          // Drawn by CSS, so the count is no text of the link: the visible text stays the label, which the name `Chat, 2 unread` contains.
          <span className={s.badge()} data-count={badge} aria-hidden />
        ) : (
          badge != null && <span className={s.badge()} aria-hidden>{badge}</span>
        )}
      </span>
      <span className={s.label()}>{label}</span>
    </>
  );
  const link = (
    <Comp data-rail-item aria-label={badgeLabel ? `${label}, ${badgeLabel}` : label} aria-current={current ? "page" : undefined} className={s.item({ className })} {...props}>
      {asChild && children ? React.cloneElement(children, undefined, inner) : inner}
    </Comp>
  );
  // Expanded, the words are on the row; collapsed, the tooltip says them (Escape dismisses it, the keyboard focus shows it).
  return expanded ? link : <Tooltip content={label} side="right">{link}</Tooltip>;
}

export const RailNav = {
  Shell: RailNavShell,
  Root: RailNavRoot,
  Item: RailNavItem,
  Body: RailNavBody,
};
