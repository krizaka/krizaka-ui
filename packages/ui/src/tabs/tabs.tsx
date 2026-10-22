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
    },
  },
  defaultVariants: { variant: "underline" },
});

export type TabsVariants = VariantProps<typeof tabs>;
type Variant = NonNullable<TabsVariants["variant"]>;

const VariantContext = React.createContext<Variant>("underline");

export type TabsRootProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /** underline (the sections of a page) · segmented (a view switch) · pills (a feed's sections). */
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

/** The tabs. Name it (`aria-label`) when no heading says what it switches. One light glides to the active tab. */
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(VariantContext);
  const { ref } = useSlidingIndicator<HTMLDivElement>({ item: "[role=tab]", active: "[role=tab][data-state=active]" });
  return <TabsPrimitive.List ref={ref} data-variant={variant} className={tabs({ variant }).list({ className })} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(VariantContext);
  return <TabsPrimitive.Trigger className={tabs({ variant }).trigger({ className })} {...props} />;
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
  /** The navigation's accessible name (« Sections »). */
  label: string;
  /** The current route, passed in: the path with its search (`usePathname()` + `useSearchParams()`, `/docs?tab=api`). The active tab comes from it; no local state. */
  current: string;
  /** underline (the sections of a page) · segmented (a view switch) · pills (a feed's sections). */
  variant?: TabsVariants["variant"];
  /** The tabs: `Tabs.NavLink`. */
  children: React.ReactNode;
};

/**
 * Tabs as routes: a `nav` of links, the URL is the state. Per WAI-ARIA these are links, not a tablist: each tab is an
 * anchor, the active one carries `aria-current="page"`, the keyboard is the page's own (Tab walks the links, Enter
 * follows one) and there is no panel — the page is the panel. The same looks and the same gliding light as `Tabs.List`.
 */
export function TabsNav({ label, current, variant = "underline", className, children, ...props }: TabsNavProps) {
  const { ref } = useSlidingIndicator<HTMLElement>({ item: "[data-tabs-link]", active: "[data-tabs-link][data-state=active]" });
  const value = React.useMemo(() => ({ current, variant }), [current, variant]);
  return (
    <NavContext.Provider value={value}>
      <nav ref={ref} aria-label={label} data-variant={variant} data-orientation="horizontal" className={tabs({ variant }).list({ className })} {...props}>
        {children}
      </nav>
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
};

/** One tab of `Tabs.Nav`: an anchor that is active when the current route is its `href`. */
export function TabsNavLink({ href, exact, asChild, className, children, ...props }: TabsNavLinkProps) {
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
      className={cn(tabs({ variant: ctx.variant }).trigger(), "no-underline", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** `Tabs.Root/List/Trigger/Content` — `variant` underline · segmented · pills on the root. `Tabs.Nav` + `Tabs.NavLink`: the same tabs as routes. */
export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent, Nav: TabsNav, NavLink: TabsNavLink };
