// Client (a context). Radix Tabs does the roles (tablist, tab, tabpanel), the aria-selected / aria-controls wiring,
// the roving focus (arrows, Home, End) and automatic activation: this file only holds the three looks.
import { Slot, Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../cn";
import { useRouteBinding } from "../router";
import { useSlidingIndicator } from "../sliding-indicator";

export const tabs = tv({
  slots: {
    root: "flex gap-4 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
    // One light glides from the active tab to the next (`before:`, placed by useSlidingIndicator); until it is placed
    // (server render), each trigger carries its own active style.
    list:
      "group/tabs relative isolate flex shrink-0 data-[orientation=vertical]:flex-col " +
      "before:pointer-events-none before:absolute before:-z-10 before:opacity-0 before:transition-[translate,width,height,opacity] before:duration-300 " +
      "motion-reduce:before:transition-none data-[indicator=on]:before:opacity-100",
    trigger:
      "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
    content: "kz-tabs-panel min-w-0 flex-1 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring data-[state=inactive]:hidden",
  },
  variants: {
    variant: {
      /* The section of a page: a line under the list, the active tab underlined in the accent. */
      underline: {
        list:
          "gap-1 border-border-default data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-r before:rounded-sm before:bg-accent " +
          "data-[orientation=horizontal]:before:-bottom-px data-[orientation=horizontal]:before:left-0 data-[orientation=horizontal]:before:h-0.5 " +
          "data-[orientation=horizontal]:before:w-(--kz-ind-w) data-[orientation=horizontal]:before:translate-x-(--kz-ind-x) " +
          "data-[orientation=vertical]:before:-right-px data-[orientation=vertical]:before:top-0 data-[orientation=vertical]:before:w-0.5 " +
          "data-[orientation=vertical]:before:h-(--kz-ind-h) data-[orientation=vertical]:before:translate-y-(--kz-ind-y)",
        trigger:
          "relative rounded-md px-3 py-2.5 text-sm text-fg-secondary hover:text-fg data-[state=active]:text-fg " +
          "after:absolute after:rounded-sm after:bg-transparent data-[state=active]:after:bg-accent " +
          "data-[orientation=horizontal]:after:inset-x-2 data-[orientation=horizontal]:after:-bottom-px data-[orientation=horizontal]:after:h-0.5 " +
          "data-[orientation=vertical]:justify-start data-[orientation=vertical]:after:inset-y-1.5 data-[orientation=vertical]:after:-right-px data-[orientation=vertical]:after:w-0.5 " +
          "group-data-[indicator=on]/tabs:data-[state=active]:after:bg-transparent",
      },
      /* A view switch: equal segments in a track, the active one filled. */
      segmented: {
        list:
          "inline-grid auto-cols-fr grid-flow-col gap-1 self-start rounded-xl border border-border-default bg-surface-1 p-1 data-[orientation=vertical]:grid-flow-row " +
          "before:left-0 before:top-0 before:h-(--kz-ind-h) before:w-(--kz-ind-w) before:translate-x-(--kz-ind-x) before:translate-y-(--kz-ind-y) before:rounded-lg before:bg-accent before:shadow-sm",
        trigger:
          "min-h-8 rounded-lg px-3 py-1.5 text-xs text-fg-secondary hover:bg-surface-2 hover:text-fg " +
          "data-[state=active]:bg-accent data-[state=active]:text-on-accent data-[state=active]:shadow-sm data-[state=active]:hover:bg-accent " +
          "transition-colors group-data-[indicator=on]/tabs:data-[state=active]:bg-transparent group-data-[indicator=on]/tabs:data-[state=active]:shadow-none",
      },
      /* Pills that scroll sideways on a phone: a feed's sections. */
      pills: {
        list:
          "gap-1.5 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-1 -mt-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
          "before:left-0 before:top-0 before:h-(--kz-ind-h) before:w-(--kz-ind-w) before:translate-x-(--kz-ind-x) before:translate-y-(--kz-ind-y) " +
          "before:rounded-sm before:border before:border-accent before:bg-accent-soft",
        trigger:
          "h-9 rounded-sm border border-border-default bg-surface-1 px-4 text-xs text-fg-secondary hover:border-border-strong hover:text-fg " +
          "data-[state=active]:border-accent data-[state=active]:bg-accent-soft data-[state=active]:text-fg " +
          "group-data-[indicator=on]/tabs:data-[state=active]:border-transparent group-data-[indicator=on]/tabs:data-[state=active]:bg-transparent",
      },
      /*
       * Binder dividers (intercalaires, #648): organise collections, tags and statuses. Each tab is a divider with a
       * coloured top edge (`hue`), its words and a count; the active one is the page's colour and joins the content
       * under the list's line. Too many dividers scroll sideways, the edges fading. No paper texture: organisation only.
       */
      binder: {
        list:
          "items-end gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain border-b border-border-default px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
          "[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]",
        trigger:
          "relative -mb-px min-h-10 rounded-t-lg border border-b-0 border-border-default bg-surface-2 px-3.5 pb-2 pt-2.5 text-sm text-fg-secondary " +
          "before:absolute before:inset-x-0 before:-top-px before:h-1 before:rounded-t-lg before:bg-(--kz-hue,var(--kz-accent)) " +
          "hover:bg-surface-3 hover:text-fg data-[state=active]:z-[1] data-[state=active]:bg-surface-1 data-[state=active]:pb-2.5 data-[state=active]:text-fg " +
          "data-[state=active]:shadow-[0_1px_0_0_var(--kz-surface-1)] motion-reduce:transition-none",
      },
    },
  },
  defaultVariants: { variant: "underline" },
});

/**
 * A divider's colour (`variant="binder"`): the brand's accent by default, or a role of the theme — every one reads at 3:1 or
 * more on both themes. The colour is never the only signal: the words and the count say it.
 */
export type TabsHue = "accent" | "success" | "warning" | "danger" | "neutral";
// The text roles where the fill role is too light on a light page (success, warning: 2:1): every edge reaches 3:1, tested.
const HUE: Record<TabsHue, string> = {
  accent: "var(--kz-accent)",
  success: "var(--kz-success-text)",
  warning: "var(--kz-warning-text)",
  danger: "var(--kz-danger-text)",
  neutral: "var(--kz-text-muted)",
};
/** The style that paints a divider's edge (`--kz-hue`), merged with the host's. */
const hueStyle = (hue: TabsHue | undefined, style: React.CSSProperties | undefined) =>
  hue ? { ...style, ["--kz-hue" as string]: HUE[hue] } : style;

/** The count after a tab's words: part of its name (« Clients 12 »), muted, tabular. */
function TabCount({ count }: { count: number | undefined }) {
  if (count === undefined) return null;
  return <span data-tab-count="" className="font-mono text-xs font-medium tabular-nums text-fg-secondary">{count}</span>;
}

/** « + Intercalaire »: a button after the dividers (outside the tab list: a tablist holds only tabs). */
function AddButton({ add }: { add: TabsAdd }) {
  return (
    <button
      type="button"
      onClick={add.onAdd}
      className="mb-1 ml-1 inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-fg-secondary hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden focusable="false">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {add.label}
    </button>
  );
}

export type TabsAdd = {
  /** Its words (« Intercalaire », « New tag ») — passed translated. */
  label: string;
  /** Adds a divider (opens the host's form). */
  onAdd: () => void;
};

export type TabsVariants = VariantProps<typeof tabs>;
type Variant = NonNullable<TabsVariants["variant"]>;

const VariantContext = React.createContext<Variant>("underline");

export type TabsRootProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /** underline (the sections of a page) · segmented (a view switch) · pills (a feed's sections) · binder (dividers that organise collections, tags, statuses). */
  variant?: TabsVariants["variant"];
  /** Binds the active tab to this search parameter of the URL (`?tab=…`): the URL is the state. Without it the state is local — only for an ephemeral choice. */
  routeKey?: string;
  /** The values the parameter may hold (the tabs' `value`s); the first is the default unless `defaultValue` says otherwise. */
  routeValues?: readonly string[];
};

/** `value`/`defaultValue` + `onValueChange`, `orientation` (horizontal by default), `variant` for the list. */
export function TabsRoot({ variant = "underline", className, routeKey, routeValues, ...rest }: TabsRootProps) {
  const props = useRouteBinding(routeKey, routeValues, rest);
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root data-variant={variant} className={tabs({ variant }).root({ className })} {...props} />
    </VariantContext.Provider>
  );
}

export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /** A « + » button after the tabs (`variant="binder"`: « + Intercalaire »): its words and what it does. */
  add?: TabsAdd;
};

/** The tabs. Name it (`aria-label`) when no heading says what it switches. One light glides to the active tab. */
export function TabsList({ className, add, ...props }: TabsListProps) {
  const variant = React.useContext(VariantContext);
  const { ref } = useSlidingIndicator<HTMLDivElement>({ item: "[role=tab]", active: "[role=tab][data-state=active]" });
  const list = <TabsPrimitive.List ref={ref} data-variant={variant} className={tabs({ variant }).list({ className: cn(add && "min-w-0 flex-1 border-b-0", className) })} {...props} />;
  if (!add) return list;
  return (
    <div data-tabs-row="" className={cn("flex min-w-0 items-end", variant === "binder" && "border-b border-border-default")}>
      {list}
      <AddButton add={add} />
    </div>
  );
}

export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** A count after the words (clients in a collection, unread): part of the tab's name. */
  count?: number;
  /** `variant="binder"`: the divider's colour (the accent by default). */
  hue?: TabsHue;
};

export function TabsTrigger({ className, count, hue, style, children, ...props }: TabsTriggerProps) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Trigger className={tabs({ variant }).trigger({ className })} style={hueStyle(hue, style)} data-hue={hue} {...props}>
      {children}
      <TabCount count={count} />
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={tabs().content({ className })} {...props} />;
}

// ── Route mode: tabs that are links; the URL is the state (Oussama, 2026-10-22) ──────────────────────────────────────

/**
 * Is the link `href` the tab of the route `current` (a path, with its search: `/docs/api?tab=x`)? The path must equal the
 * link's (a trailing slash, a locale-free comparison and the hash do not count); with `exact` false (the default) a deeper
 * path of the same section counts too (`/docs/api/x` is in `/docs/api`); every search parameter of the link must be in
 * `current`. The hub link (`/`) is only ever active on `/` itself.
 */
export function isTabActive(current: string, href: string, exact = false): boolean {
  const split = (value: string) => {
    const url = new URL(value.split("#")[0]!, "https://tabs.invalid");
    return { path: url.pathname.replace(/\/+$/, "") || "/", search: url.searchParams };
  };
  const here = split(current);
  const target = split(href);
  const samePath = here.path === target.path;
  const deeper = !exact && target.path !== "/" && here.path.startsWith(`${target.path}/`);
  if (!samePath && !deeper) return false;
  for (const [key, value] of target.search) if (here.search.get(key) !== value) return false;
  return true;
}

interface NavState {
  current: string;
  variant: Variant;
}
const NavContext = React.createContext<NavState | null>(null);

export type TabsNavProps = Omit<React.ComponentProps<"nav">, "children"> & {
  /** A « + » button after the tabs (`variant="binder"`: « + Intercalaire »). */
  add?: TabsAdd;
  /** The navigation's accessible name (« Sections »). */
  label: string;
  /** The current route, passed in: the path with its search (`usePathname()` + `useSearchParams()`, `/docs?tab=api`). The active tab comes from it; no local state. */
  current: string;
  /** underline (the sections of a page) · segmented (a view switch) · pills (a feed's sections) · binder (dividers). */
  variant?: TabsVariants["variant"];
  /** The tabs: `Tabs.NavLink`. */
  children: React.ReactNode;
};

/**
 * Tabs as routes: a `nav` of links, the URL is the state. Per WAI-ARIA these are links, not a tablist: each tab is an
 * anchor, the active one carries `aria-current="page"`, the keyboard is the page's own (Tab walks the links, Enter
 * follows one) and there is no panel — the page is the panel. The same looks and the same gliding light as `Tabs.List`.
 */
export function TabsNav({ label, current, variant = "underline", add, className, children, ...props }: TabsNavProps) {
  const { ref } = useSlidingIndicator<HTMLElement>({ item: "[data-tabs-link]", active: "[data-tabs-link][data-state=active]" });
  const value = React.useMemo(() => ({ current, variant }), [current, variant]);
  const nav = (
    <nav ref={ref} aria-label={label} data-variant={variant} data-orientation="horizontal" className={tabs({ variant }).list({ className: cn(add && "min-w-0 flex-1 border-b-0", className) })} {...props}>
      {children}
    </nav>
  );
  return (
    <NavContext.Provider value={value}>
      {add ? (
        <div data-tabs-row="" className={cn("flex min-w-0 items-end", variant === "binder" && "border-b border-border-default")}>
          {nav}
          <AddButton add={add} />
        </div>
      ) : (
        nav
      )}
    </NavContext.Provider>
  );
}

export type TabsNavLinkProps = React.ComponentProps<"a"> & {
  /** Where the tab goes (`/docs/api`, `/docs?tab=api`). */
  href: string;
  /** Match this path only, not the pages below it. */
  exact?: boolean;
  /** Renders your router's `<Link>` (pass it as the only child; the `href` goes on this part and on the link). */
  asChild?: boolean;
  /** A count after the words (not with `asChild`: put it in your link). */
  count?: number;
  /** `variant="binder"`: the divider's colour (the accent by default). */
  hue?: TabsHue;
};

/** One tab of `Tabs.Nav`: an anchor that is active when the current route is its `href`. */
export function TabsNavLink({ href, exact, asChild, count, hue, style, className, children, ...props }: TabsNavLinkProps) {
  const ctx = React.useContext(NavContext);
  if (!ctx) throw new Error("Tabs.NavLink must be inside <Tabs.Nav>");
  const active = isTabActive(ctx.current, href, exact);
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-tabs-link=""
      data-state={active ? "active" : "inactive"}
      data-orientation="horizontal"
      aria-current={active ? "page" : undefined}
      {...(asChild ? {} : { href })}
      data-hue={hue}
      style={hueStyle(hue, style)}
      className={cn(tabs({ variant: ctx.variant }).trigger(), "no-underline", className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          <TabCount count={count} />
        </>
      )}
    </Comp>
  );
}

/** `Tabs.Root/List/Trigger/Content` — `variant` underline · segmented · pills · binder on the root. `Tabs.Nav` + `Tabs.NavLink`: the same tabs as routes. */
export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent, Nav: TabsNav, NavLink: TabsNavLink };
