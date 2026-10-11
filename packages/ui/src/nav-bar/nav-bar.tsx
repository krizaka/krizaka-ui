// Client (scroll, a sliding indicator, menus). Radix NavigationMenu does the menus' semantics and keyboard (Enter, Space
// and ↓ open; ↑ ↓ Home End walk; Escape closes and returns the focus; Tab out closes); this file draws the Krizaka bar:
// a floating pill that tightens once the page scrolls, one light that glides to the item under the pointer or the
// focus and rests on the current page, and a mobile panel that is a plain disclosure (no focus trap, Escape closes).
import { NavigationMenu as Nav, Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { useSlidingIndicator } from "../sliding-indicator";

export const navBar = tv({
  slots: {
    root:
      "group/nav relative z-40 mx-auto flex h-14 w-full items-center gap-2 border-border-subtle bg-surface-1/75 backdrop-blur-xl backdrop-saturate-150 " +
      "transition-[height,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none " +
      "data-compact:h-12 data-compact:border-border-default data-compact:bg-surface-1/90 data-compact:shadow-lg",
    brand:
      "mr-2 inline-flex shrink-0 items-center gap-2 font-display text-[15px] font-bold tracking-tight text-fg no-underline " +
      "rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    items: "relative hidden md:block",
    list:
      "group/list relative isolate flex items-center gap-0.5 " +
      // The light: under the item that is pointed at or focused, resting on the current page.
      "before:absolute before:left-0 before:top-0 before:-z-10 before:h-(--kz-ind-h) before:w-(--kz-ind-w) before:translate-x-(--kz-ind-x) before:translate-y-(--kz-ind-y) " +
      "before:rounded-full before:bg-surface-3 before:opacity-0 before:transition-[translate,width,opacity] before:duration-300 motion-reduce:before:transition-none " +
      "data-[indicator=on]:before:opacity-100",
    item:
      "inline-flex h-9 select-none items-center gap-1 rounded-full px-3.5 text-sm font-medium text-fg-secondary no-underline transition-colors " +
      "hover:text-fg data-active:text-fg data-[state=open]:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      // Before the light is ready (server render), the current page carries its own tint.
      "group-not-data-[indicator=on]/list:data-active:bg-surface-3",
    chevron: "h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none",
    viewport:
      "kz-pop absolute left-0 top-full mt-2 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden " +
      "rounded-2xl border border-border-default bg-surface-1 shadow-lg transition-[width,height] duration-300 motion-reduce:transition-none",
    panel: "grid w-max max-w-[min(92vw,30rem)] gap-1 p-2",
    menuLink:
      "group/link flex items-start gap-3 rounded-xl p-3 text-left no-underline outline-hidden transition-colors " +
      "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring data-active:bg-accent-soft",
    menuIcon:
      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-default bg-surface-2 text-fg-accent " +
      "transition-[transform,border-color] duration-300 group-hover/link:-translate-y-0.5 group-hover/link:border-accent [&>svg]:h-4.5 [&>svg]:w-4.5 motion-reduce:transform-none",
    menuTitle: "block text-sm font-semibold text-fg",
    menuText: "mt-0.5 block text-xs leading-relaxed text-fg-secondary",
    actions: "ml-auto flex items-center gap-2",
    toggle:
      "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-2/60 text-fg md:hidden " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    mobile: "kz-pop absolute inset-x-0 top-full mt-2 grid gap-1 rounded-2xl border border-border-default bg-surface-1 p-2 shadow-lg md:hidden",
    mobileLink:
      "flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-fg no-underline hover:bg-surface-2 " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-fg-accent",
  },
  variants: {
    floating: {
      true: { root: "max-w-5xl rounded-full border pl-5 pr-2 data-compact:max-w-4xl" },
      false: { root: "border-b px-4 md:px-6" },
    },
  },
  defaultVariants: { floating: true },
});
const s = navBar();

interface NavBarContext {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  panelId: string;
}
const Context = React.createContext<NavBarContext | null>(null);
const useNavBar = () => {
  const ctx = React.useContext(Context);
  if (!ctx) throw new Error("NavBar parts must be inside <NavBar.Root>.");
  return ctx;
};

export type NavBarRootProps = React.ComponentProps<"header"> & {
  /** The accessible name of the navigation (“Main”) — passed translated. */
  label: string;
  /**
   * Pixels of scroll after which the bar tightens (denser, lower, lifted). `false`: never.
   * @default 24
   */
  compactAfter?: number | false;
  /**
   * A floating pill (the Krizaka bar) or a full-width bar with a hairline under it.
   * @default true
   */
  floating?: boolean;
};

/** The bar. Place it in a `sticky top-3` (floating) or `sticky top-0` wrapper — or let it scroll. */
export function NavBarRoot({ label, compactAfter = 24, floating = true, className, children, ...props }: NavBarRootProps) {
  const [compact, setCompact] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  React.useEffect(() => {
    if (compactAfter === false) return;
    const onScroll = () => setCompact(window.scrollY > compactAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compactAfter]);
  const ctx = React.useMemo(() => ({ label, open, setOpen, panelId }), [label, open, panelId]);
  return (
    <Context.Provider value={ctx}>
      <header data-compact={compact ? "" : undefined} data-floating={floating} className={navBar({ floating }).root({ className })} {...props}>
        {children}
      </header>
    </Context.Provider>
  );
}

export type NavBarBrandProps = React.ComponentProps<"a"> & {
  /** Renders your link (a router `<Link>`) with the brand's look. */
  asChild?: boolean;
};

/** The brand: a mark and a name, linking home. */
export function NavBarBrand({ asChild, className, ...props }: NavBarBrandProps) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp className={s.brand({ className })} {...props} />;
}

/** The desktop navigation: links and menus, with the light that glides between them. Hidden below `md` (see `NavBar.Mobile`). */
export function NavBarItems({ className, children, ...props }: Omit<React.ComponentProps<typeof Nav.Root>, "orientation">) {
  const { label } = useNavBar();
  const { ref, handlers } = useSlidingIndicator<HTMLUListElement>({ item: "[data-nav-item]", active: "[data-nav-item][data-active]", follow: true });
  return (
    <Nav.Root aria-label={label} className={s.items({ className })} delayDuration={80} {...props}>
      <Nav.List ref={ref} className={s.list()} {...handlers}>
        {children}
      </Nav.List>
      <Nav.Viewport className={s.viewport()} />
    </Nav.Root>
  );
}

export type NavBarLinkProps = Omit<React.ComponentProps<typeof Nav.Link>, "active"> & {
  /** The current page: `aria-current="page"`, and the light rests on it. */
  active?: boolean;
};

/** A link of the bar. `asChild` renders your router's `<Link>`. */
export function NavBarLink({ active, className, ...props }: NavBarLinkProps) {
  return (
    <Nav.Item>
      <Nav.Link data-nav-item="" data-active={active ? "" : undefined} active={active} aria-current={active ? "page" : undefined} className={s.item({ className })} {...props} />
    </Nav.Item>
  );
}

export type NavBarMenuProps = Omit<React.ComponentProps<typeof Nav.Item>, "children"> & {
  /** The trigger's words (“Products”) — passed translated. */
  label: string;
  /** The current page is inside this menu: the light rests on its trigger. */
  active?: boolean;
  /** The menu's links (`NavBar.MenuLink`), laid out in a panel; `columns` sets the grid. */
  children: React.ReactNode;
  /**
   * Columns of the panel.
   * @default 1
   */
  columns?: 1 | 2;
};

/** A menu of the bar: its trigger, and its links in a panel that opens under the bar. */
export function NavBarMenu({ label, active, columns = 1, children, className, ...props }: NavBarMenuProps) {
  return (
    <Nav.Item className={className} {...props}>
      <Nav.Trigger data-nav-item="" data-active={active ? "" : undefined} className={cn(s.item(), "group/trigger")}>
        {label}
        <svg viewBox="0 0 24 24" className={s.chevron()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Nav.Trigger>
      <Nav.Content className={cn(s.panel(), columns === 2 && "md:grid-cols-2")}>{children}</Nav.Content>
    </Nav.Item>
  );
}

export type NavBarMenuLinkProps = Omit<React.ComponentProps<typeof Nav.Link>, "title" | "active"> & {
  /** The link's name — passed translated. */
  title: string;
  /** One line under it — passed translated. */
  description?: string;
  /** An icon (a signature icon of `@krizaka/icons`: its node lights up on hover). */
  icon?: React.ReactNode;
  /** The current page. */
  active?: boolean;
};

/** A link inside a menu: an icon, a name and a line of text. */
export function NavBarMenuLink({ title, description, icon, active, href, className, asChild, children, ...props }: NavBarMenuLinkProps) {
  const body = (
    <>
      {icon && <span className={s.menuIcon()}>{icon}</span>}
      <span className="min-w-0">
        <span className={s.menuTitle()}>{title}</span>
        {description && <span className={s.menuText()}>{description}</span>}
      </span>
    </>
  );
  return (
    <Nav.Link asChild={asChild} href={asChild ? undefined : href} active={active} aria-current={active ? "page" : undefined} data-active={active ? "" : undefined} className={s.menuLink({ className })} {...props}>
      {asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? React.cloneElement(children, undefined, body) : body}
    </Nav.Link>
  );
}

/** The right side: search, theme, language, the call to action. */
export function NavBarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={s.actions({ className })} {...props} />;
}

export type NavBarMobileProps = React.ComponentProps<"nav"> & {
  /** The toggle's name when closed (“Open the menu”) — passed translated. */
  openLabel: string;
  /** The toggle's name when open (“Close the menu”) — passed translated. */
  closeLabel: string;
};

/**
 * Below `md`: a toggle, and a panel under the bar with its links (`NavBar.MobileLink`). A disclosure: Escape and a click
 * on a link close it, the focus returns to the toggle.
 */
export function NavBarMobile({ openLabel, closeLabel, className, children, ...props }: NavBarMobileProps) {
  const { label, open, setOpen, panelId } = useNavBar();
  const toggle = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  return (
    <>
      <button ref={toggle} type="button" aria-expanded={open} aria-controls={panelId} aria-label={open ? closeLabel : openLabel} onClick={() => setOpen(!open)} className={s.toggle()}>
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>
      {open && (
        <nav
          id={panelId}
          aria-label={label}
          className={s.mobile({ className })}
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setOpen(false);
          }}
          {...props}
        >
          {children}
        </nav>
      )}
    </>
  );
}

export type NavBarMobileLinkProps = React.ComponentProps<"a"> & {
  /** The current page. */
  active?: boolean;
  /** Renders your router's `<Link>`. */
  asChild?: boolean;
};

/** A link of the mobile panel. */
export function NavBarMobileLink({ active, asChild, className, ...props }: NavBarMobileLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp aria-current={active ? "page" : undefined} className={s.mobileLink({ className })} {...props} />;
}

/**
 * `NavBar.Root/Brand/Items/Link/Menu/MenuLink/Actions/Mobile/MobileLink` — the Krizaka navigation bar: floating, tightening
 * on scroll, one light gliding between its items, accessible menus, a mobile panel.
 */
export const NavBar = {
  Root: NavBarRoot,
  Brand: NavBarBrand,
  Items: NavBarItems,
  Link: NavBarLink,
  Menu: NavBarMenu,
  MenuLink: NavBarMenuLink,
  Actions: NavBarActions,
  Mobile: NavBarMobile,
  MobileLink: NavBarMobileLink,
};
