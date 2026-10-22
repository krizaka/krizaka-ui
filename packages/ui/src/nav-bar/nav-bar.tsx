// Client (scroll, a sliding indicator, menus). Radix NavigationMenu does the menus' semantics and keyboard (Enter, Space
// and ↓ open; ↑ ↓ Home End walk; Escape closes and returns the focus; Tab out closes); this file draws the Krizaka bar:
// a floating pill that tightens once the page scrolls, one light that glides to the item under the pointer or the
// focus and rests on the current page, and a mobile panel that is a plain disclosure (no focus trap, Escape closes).
import { NavigationMenu as Nav, Slot } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

import { cn } from "../cn";
import { FamilyMark, GitHubGlyph } from "../family-mark";
import { LanguageSwitch, type LanguageSwitchProps } from "../language-switch/language-switch";
import { type FamilyLabels, familyLabels, type Site, type SiteId, sitesByGroup } from "../sites/sites";
import { useSlidingIndicator } from "../sliding-indicator";
import { placePanel } from "./placement";

export const navBar = tv({
  slots: {
    root:
      "group/nav relative z-40 mx-auto flex h-14 w-full items-center gap-2 border-border-subtle bg-surface-1 " +
      "transition-[height,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none " +
      "data-compact:h-12 data-compact:border-border-default data-compact:bg-surface-1 data-compact:shadow-lg",
    brand:
      "mr-2 inline-flex shrink-0 items-center gap-2 font-display text-[15px] font-bold tracking-tight text-fg no-underline " +
      "rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    items: "relative hidden md:block",
    list:
      "group/list relative isolate flex items-center gap-0.5 " +
      // The ink rule (Cahier, ADR-004): a pen line under the item that is pointed at or focused, resting on the current page.
      "before:absolute before:left-0 before:top-0 before:-z-10 before:h-0.5 before:w-(--kz-ind-w) before:translate-x-(--kz-ind-x) before:translate-y-[calc(var(--kz-ind-y)+var(--kz-ind-h)-6px)] " +
      "before:scale-x-[0.72] before:bg-fg before:opacity-0 before:transition-[translate,width,opacity] before:duration-300 motion-reduce:before:transition-none " +
      "data-[indicator=on]:before:opacity-100",
    item:
      "inline-flex h-9 select-none items-center gap-1 rounded-sm px-3.5 text-sm font-medium text-fg-secondary no-underline transition-colors " +
      "hover:text-fg data-active:text-fg data-[state=open]:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      // Before the light is ready (server render), the current page carries its own tint.
      "group-not-data-[indicator=on]/list:data-active:underline group-not-data-[indicator=on]/list:data-active:decoration-2 group-not-data-[indicator=on]/list:data-active:underline-offset-8",
    chevron: "h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none",
    viewport:
      // `left` is set by NavBarItems (--kz-menu-left): the panel's edge under its trigger, kept inside the page.
      "kz-pop absolute left-[var(--kz-menu-left,0px)] top-full mt-2 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden " +
      "rounded-2xl border border-border-default bg-surface-1 shadow-lg transition-[left,width,height] duration-300 motion-reduce:transition-none",
    // Icon · title · a description of two lines at most. 28 rem (40 rem in two columns), never wider than the page
    // between its gutters, and never taller than the screen.
    panel: "grid w-[min(28rem,calc(100vw-2rem))] max-h-[calc(100dvh-6rem)] gap-0.5 overflow-y-auto p-1.5",
    panelWide: "w-[min(40rem,calc(100vw-2rem))] md:grid-cols-2",
    menuLink:
      "group/link flex items-start gap-3 rounded-lg px-2.5 py-2 text-left no-underline outline-hidden transition-colors " +
      "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring data-active:bg-accent-soft",
    menuIcon:
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-2 text-fg-accent " +
      "transition-[transform,border-color] duration-300 group-hover/link:-translate-y-0.5 group-hover/link:border-accent [&>svg]:h-4 [&>svg]:w-4 motion-reduce:transform-none",
    menuTitle: "block line-clamp-2 wrap-break-word text-sm font-semibold leading-5 text-fg",
    // Two lines at most, wrapped at word boundaries — a longer one ends in an ellipsis, never cut mid-sentence.
    menuText: "mt-0.5 block line-clamp-2 wrap-break-word text-xs leading-4 text-fg-secondary",
    actions: "ml-auto flex items-center gap-2",
    toggle:
      "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border-subtle bg-surface-2 text-fg md:hidden " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    mobile: "kz-pop absolute inset-x-0 top-full mt-2 grid gap-1 rounded-2xl border border-border-default bg-surface-1 p-2 shadow-lg md:hidden",
    mobileGroup: "grid gap-0.5 [&+&]:mt-1 [&+&]:border-t [&+&]:border-border-subtle [&+&]:pt-2",
    mobileGroupTitle: "px-3 pb-1 pt-1 text-[11px] font-semibold text-fg-secondary",
    mobileLink:
      "flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-fg no-underline hover:bg-surface-2 " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-fg-accent",
    // The family switcher: a chevron attached to the brand, its panel aligned on the bar's left edge.
    family: "hidden md:block",
    familyTrigger:
      "group/trigger -ml-2 mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-fg-secondary transition-colors " +
      "hover:bg-surface-3 hover:text-fg data-[state=open]:bg-surface-3 data-[state=open]:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    familyViewport:
      "kz-pop absolute left-0 top-full mt-2 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden " +
      "rounded-2xl border border-border-default bg-surface-1 shadow-lg transition-[width,height] duration-300 motion-reduce:transition-none",
    familyPanel: "grid w-[min(92vw,42rem)] gap-x-2 gap-y-3 p-3 sm:grid-cols-2",
    familyGroupTitle: "px-3 pb-1 pt-1 text-[11px] font-semibold text-fg-secondary",
    familyLink:
      "group/link flex items-start gap-3 rounded-xl px-3 py-2.5 text-left no-underline outline-hidden transition-colors " +
      "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring data-current:bg-accent-soft",
    familyMark: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center text-fg",
    familyName: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold text-fg",
    familyText: "mt-0.5 block text-xs leading-relaxed text-fg-secondary",
    familyTag: "rounded-sm px-1.5 py-px text-[10px] font-semibold",
    mobileFamily: "mt-1 grid gap-2 border-t border-border-subtle px-1 pb-1 pt-3",
    mobileFamilyLink:
      "flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 text-[15px] font-medium text-fg no-underline hover:bg-surface-2 " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring data-current:bg-accent-soft",
    badge:
      "hidden h-6 shrink-0 items-center gap-1 rounded-sm border border-border-subtle bg-surface-2 px-2 font-mono text-[11px] font-medium text-fg-secondary sm:inline-flex",
    repo:
      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
  variants: {
    floating: {
      true: { root: "max-w-5xl rounded-sm border pl-5 pr-2 data-compact:max-w-4xl" },
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
/** The open menu of `NavBar.Items` (`""`: none), so a plain link can close it when the pointer moves on to it. */
const ItemsContext = React.createContext<{ close: () => void }>({ close: () => {} });
/** True inside `NavBar.Mobile`: the family renders as the panel's last group instead of a switcher. */
const MobileContext = React.createContext(false);
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

export type NavBarItemsProps = Omit<React.ComponentProps<typeof Nav.Root>, "orientation">;

/**
 * The desktop navigation: links and menus, with the light that glides between them. Hidden below `md` (see
 * `NavBar.Mobile`). A menu opens on click, Enter, Space or ↓ — or when the pointer rests on its trigger (hover intent,
 * `delayDuration`, 200 ms): passing over the bar opens nothing. While a menu is open the light stays on its trigger;
 * moving on to a plain link closes the menu, so the bar never shows two current items. A click outside or Escape closes.
 */
export function NavBarItems({ className, children, value: valueProp, defaultValue, onValueChange, delayDuration = 200, ...props }: NavBarItemsProps) {
  const { label } = useNavBar();
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const value = valueProp ?? inner;
  const setValue = React.useCallback(
    (next: string) => {
      setInner(next);
      onValueChange?.(next);
    },
    [onValueChange],
  );
  const items = React.useMemo(() => ({ close: () => setValue("") }), [setValue]);
  const { ref, handlers } = useSlidingIndicator<HTMLUListElement>({
    item: "[data-nav-item]",
    active: "[data-nav-item][data-active]",
    prefer: "[data-nav-item][data-state=open]",
    follow: true,
  });
  const root = React.useRef<HTMLElement>(null);
  const viewport = React.useRef<HTMLDivElement>(null);
  // The open panel sits under its trigger and stays inside the page (collision): measured when a menu opens, when
  // the panel changes size (another menu) and when the window does.
  React.useLayoutEffect(() => {
    const panel = viewport.current;
    const nav = root.current;
    if (!panel || !nav || !value) return;
    const place = () => {
      const trigger = nav.querySelector<HTMLElement>("[data-nav-item][data-state=open]");
      const width = Number.parseFloat(panel.style.getPropertyValue("--radix-navigation-menu-viewport-width"));
      if (!trigger || !Number.isFinite(width)) return;
      const left = `${placePanel({ trigger: trigger.getBoundingClientRect().left, root: nav.getBoundingClientRect().left, panel: width, window: document.documentElement.clientWidth })}px`;
      if (panel.style.getPropertyValue("--kz-menu-left") !== left) panel.style.setProperty("--kz-menu-left", left);
    };
    place();
    const watch = new MutationObserver(place);
    watch.observe(panel, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("resize", place);
    return () => {
      watch.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [value]);
  return (
    <ItemsContext.Provider value={items}>
      <Nav.Root ref={root} aria-label={label} className={s.items({ className })} value={value} onValueChange={setValue} delayDuration={delayDuration} {...props}>
        <Nav.List ref={ref} className={s.list()} {...handlers}>
          {children}
        </Nav.List>
        <Nav.Viewport ref={viewport} className={s.viewport()} />
      </Nav.Root>
    </ItemsContext.Provider>
  );
}

export type NavBarLinkProps = Omit<React.ComponentProps<typeof Nav.Link>, "active"> & {
  /** The current page: `aria-current="page"`, and the light rests on it. */
  active?: boolean;
  /** Classes on the list item around the link (to show it from a breakpoint only). */
  itemClassName?: string;
};

/** A link of the bar. `asChild` renders your router's `<Link>`. */
export function NavBarLink({ active, className, itemClassName, onPointerEnter, ...props }: NavBarLinkProps) {
  const { close } = React.useContext(ItemsContext);
  return (
    <Nav.Item className={itemClassName}>
      <Nav.Link
        data-nav-item=""
        data-active={active ? "" : undefined}
        active={active}
        aria-current={active ? "page" : undefined}
        className={s.item({ className })}
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          close();
        }}
        {...props}
      />
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
  /**
   * A section with this many links or fewer needs no hidden list: they sit in the bar as plain links (the active one
   * marked, no dropdown, `label` unused on the desktop). Above it, a dropdown. `0` always makes a dropdown.
   * @default 3
   */
  inlineUpTo?: number;
  /**
   * From which breakpoint the inline links stand in the bar. Below it (between the phone panel at `md` and this
   * breakpoint) the section is the dropdown, so long labels never overflow a tablet-width bar. `md` inlines as soon as
   * the bar is shown.
   * @default "lg"
   */
  inlineFrom?: "md" | "lg" | "xl";
};

// Static class names (Tailwind reads them at build time).
const INLINE_HIDE = { md: "", lg: "max-lg:hidden", xl: "max-xl:hidden" } as const;
const DROPDOWN_HIDE = { md: "", lg: "lg:hidden", xl: "xl:hidden" } as const;

/**
 * A menu of the bar: its trigger, and its links in a panel that opens under the bar. A menu of `inlineUpTo` links or
 * fewer (3 by default) is not a menu at all: its links stand in the bar, each with its active state — a hidden list of
 * three is one click more for nothing. The phone's panel groups them as usual (`NavBar.MobileGroup`).
 */
export function NavBarMenu({ label, active, columns = 1, inlineUpTo = 3, inlineFrom = "lg", children, className, ...props }: NavBarMenuProps) {
  const links = React.Children.toArray(children);
  const dropdown = (hide: string) => (
    <Nav.Item className={cn(hide, className)} {...props}>
      <Nav.Trigger data-nav-item="" data-active={active ? "" : undefined} className={cn(s.item(), "group/trigger")}>
        {label}
        <svg viewBox="0 0 24 24" className={s.chevron()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Nav.Trigger>
      <Nav.Content className={cn(s.panel(), columns === 2 && s.panelWide())}>{children}</Nav.Content>
    </Nav.Item>
  );
  const inline = links.length > 0 && links.length <= inlineUpTo && links.every((c) => React.isValidElement(c) && c.type === NavBarMenuLink);
  if (inline) {
    return (
      <>
        {inlineFrom !== "md" && dropdown(DROPDOWN_HIDE[inlineFrom])}
        {links.map((link) => {
          const { title, href, active: here, asChild, children: child, icon: _icon, description: _description, className: linkClass, ...rest } = (link as React.ReactElement<NavBarMenuLinkProps>).props;
          return (
            <NavBarLink key={(link as React.ReactElement).key} asChild={asChild} href={asChild ? undefined : href} active={here} className={linkClass} itemClassName={INLINE_HIDE[inlineFrom]} {...rest}>
              {asChild && React.isValidElement<{ children?: React.ReactNode }>(child) ? React.cloneElement(child, undefined, title) : title}
            </NavBarLink>
          );
        })}
      </>
    );
  }
  return dropdown("");
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
      <span className="min-w-0 flex-1">
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
 * Below `md`: a toggle, and a panel under the bar with its links (`NavBar.MobileLink`), grouped like the bar's menus
 * (`NavBar.MobileGroup`). A disclosure: Escape, a click on a link or a press outside close it; Escape returns the focus
 * to the toggle.
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
    // A press outside the panel and its toggle closes it (the page under it stays usable).
    const onPress = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target || toggle.current?.contains(target) || document.getElementById(panelId)?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open, setOpen, panelId]);
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
          <MobileContext.Provider value>{children}</MobileContext.Provider>
        </nav>
      )}
    </>
  );
}

export type NavBarMobileGroupProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The group's heading — the same words as the bar's menu (“Product”) — passed translated. */
  label: string;
};

/** A group of the mobile panel: the links of one of the bar's menus under its name, in the same order. */
export function NavBarMobileGroup({ label, className, children, ...props }: NavBarMobileGroupProps) {
  const id = React.useId();
  return (
    <div role="group" aria-labelledby={id} className={s.mobileGroup({ className })} {...props}>
      <p id={id} className={s.mobileGroupTitle()}>
        {label}
      </p>
      {children}
    </div>
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


const tagTone = {
  upcoming: "bg-accent-soft text-fg ring-1 ring-inset ring-accent/40",
  construction: "bg-warning/15 text-fg ring-1 ring-inset ring-warning/40",
  development: "bg-surface-3 text-fg ring-1 ring-inset ring-border-strong",
  current: "bg-surface-3 text-fg-secondary",
};

/** A site's name and its tags: status when not released, “You are here” on the current one. */
function FamilyName({ site, current, labels }: { site: Site; current: boolean; labels: FamilyLabels }) {
  return (
    <span className={s.familyName()}>
      {site.name}
      {site.status !== "released" && <span className={cn(s.familyTag(), tagTone[site.status])}>{labels.status[site.status]}</span>}
      {current && <span className={cn(s.familyTag(), tagTone.current)}>{labels.current}</span>}
    </span>
  );
}

export type NavBarFamilyProps = {
  /** The site this bar belongs to (`@krizaka/ui/sites`): marked in the family, `aria-current="true"`. */
  current: SiteId;
  /**
   * The family's words, passed translated: `familyLabels.fr` from `@krizaka/ui/sites`, or your own of the same shape.
   * @default familyLabels.en
   */
  labels?: FamilyLabels;
  /** Opens the panel at first render (a story, a screenshot). */
  defaultOpen?: boolean;
  /** Classes of the switcher (or, inside `NavBar.Mobile`, of the family's group). */
  className?: string;
};

/**
 * @deprecated No site carries the family switcher any more (2026-10-22): krizaka.com is the only way back between the Krizaka sites, through the footer's « A Krizaka project » line. Removed in the next minor; `krizaka/no-family-switcher` refuses it.
 *
 * The family switcher, attached to the brand (place it right after `NavBar.Brand`): a chevron that opens every site of
 * Krizaka grouped — Krizaka · Products · Open source · GitHub — the current one marked. It opens on click, Enter, Space
 * or ↓ (never on hover); ↑ ↓ walk the sites, Escape closes and returns the focus. Hidden below `md`: place a second
 * `NavBar.Family` as the last child of `NavBar.Mobile`, where it renders as the panel's last group.
 */
export function NavBarFamily({ current, labels = familyLabels.en, defaultOpen, className }: NavBarFamilyProps) {
  const inMobile = React.useContext(MobileContext);
  const id = React.useId();
  const groups = sitesByGroup();
  if (inMobile) {
    return (
      <div role="group" aria-labelledby={`${id}-family`} className={s.mobileFamily({ className })}>
        <p id={`${id}-family`} className={s.familyGroupTitle()}>
          {labels.family}
        </p>
        {groups.map(({ group, sites }) => (
          <div key={group}>
            {/* The company's own group is named like the family itself: its heading would repeat the panel's. */}
            {group !== "krizaka" && (
              <p id={`${id}-${group}`} className={s.familyGroupTitle()}>
                {labels.groups[group]}
              </p>
            )}
            <ul aria-labelledby={group !== "krizaka" ? `${id}-${group}` : `${id}-family`} className="grid gap-0.5">
              {sites.map((site) => (
                <li key={site.id}>
                  <a href={site.url} data-current={site.id === current ? "" : undefined} aria-current={site.id === current ? "true" : undefined} className={s.mobileFamilyLink()}>
                    <span className={s.familyMark()}>
                      <FamilyMark mark={site.mark} size={24} />
                    </span>
                    <FamilyName site={site} current={site.id === current} labels={labels} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  // Click only: a pointer passing over the brand never opens the family (Radix opens its menus on hover by default).
  const noHover = (e: React.PointerEvent) => e.preventDefault();
  const columns = [groups.filter((g) => g.group === "krizaka" || g.group === "products"), groups.filter((g) => g.group === "open-source" || g.group === "github")];
  return (
    <Nav.Root aria-label={labels.family} defaultValue={defaultOpen ? "family" : undefined} className={s.family({ className })}>
      <Nav.List className="flex">
        <Nav.Item value="family">
          <Nav.Trigger aria-label={labels.family} onPointerMove={noHover} onPointerLeave={noHover} className={s.familyTrigger()}>
            <svg viewBox="0 0 24 24" className={s.chevron()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Nav.Trigger>
          <Nav.Content onPointerLeave={noHover} className={s.familyPanel()}>
            {columns.map((column, i) => (
              <div key={i} className="grid content-start gap-3">
                {column.map(({ group, sites }) => (
                  <div key={group}>
                    <p id={`${id}-${group}`} className={s.familyGroupTitle()}>
                      {labels.groups[group]}
                    </p>
                    <ul aria-labelledby={`${id}-${group}`} className="grid gap-0.5">
                      {sites.map((site) => (
                        <li key={site.id}>
                          <Nav.Link href={site.url} data-current={site.id === current ? "" : undefined} aria-current={site.id === current ? "true" : undefined} className={s.familyLink()}>
                            <span className={s.familyMark()}>
                              <FamilyMark mark={site.mark} size={28} />
                            </span>
                            <span className="min-w-0">
                              <FamilyName site={site} current={site.id === current} labels={labels} />
                              <span className={s.familyText()}>{labels.descriptions[site.id]}</span>
                            </span>
                          </Nav.Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </Nav.Content>
        </Nav.Item>
      </Nav.List>
      <Nav.Viewport onPointerLeave={noHover} className={s.familyViewport()} />
    </Nav.Root>
  );
}

export type NavBarBadgeProps = React.ComponentProps<"span"> & {
  /** The environment, when it is not production (`DEV`). */
  env?: string;
  /** The version the site runs (`1.2.3`, shown `v1.2.3`). */
  version?: string;
};

/** A small mono badge beside the brand: the environment and the version (`DEV · v1.2.3`). Hidden below `sm`. */
export function NavBarBadge({ env, version, className, children, ...props }: NavBarBadgeProps) {
  const parts = [env, version && `v${version.replace(/^v/, "")}`].filter(Boolean);
  return (
    <span className={s.badge({ className })} {...props}>
      {parts.join(" · ")}
      {children}
    </span>
  );
}

export type NavBarLanguageProps = Omit<LanguageSwitchProps, "variant">;

/**
 * The language switch, the same on every site: in the bar a globe and the current code (FR) opening a short menu of
 * the languages by their own names; inside `NavBar.Mobile` the same languages as a row in the preferences.
 */
export function NavBarLanguage(props: NavBarLanguageProps) {
  const inMobile = React.useContext(MobileContext);
  return <LanguageSwitch variant={inMobile ? "inline" : "menu"} {...props} />;
}

export type NavBarMobilePreferencesProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The group's heading (“Preferences”) — passed translated. */
  label: string;
};

/** The last group of the mobile panel: the preferences (theme, `NavBar.Language`), in a row under their heading. */
export function NavBarMobilePreferences({ label, className, children, ...props }: NavBarMobilePreferencesProps) {
  const id = React.useId();
  return (
    <div role="group" aria-labelledby={id} className={s.mobileGroup({ className })} {...props}>
      <p id={id} className={s.mobileGroupTitle()}>
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2 px-3 py-1">{children}</div>
    </div>
  );
}

export type NavBarRepoProps = Omit<React.ComponentProps<"a">, "children"> & {
  /** The repository the site is built from. */
  href: string;
  /** The link's accessible name (“Source on GitHub”) — passed translated. */
  label: string;
};

/** The site's repository on GitHub, an icon link of `NavBar.Actions`. */
export function NavBarRepo({ label, className, ...props }: NavBarRepoProps) {
  return (
    <a aria-label={label} className={s.repo({ className })} {...props}>
      <GitHubGlyph size={18} />
    </a>
  );
}

/**
 * `NavBar.Root/Brand/Family/Badge/Items/Link/Menu/MenuLink/Actions/Repo/Language/Mobile/MobileGroup/MobilePreferences/MobileLink` — the Krizaka navigation bar,
 * the same on every site of the family: floating, tightening on scroll, the family switcher on the brand, one light
 * gliding between its items, accessible menus, a mobile panel.
 */
export const NavBar = {
  Root: NavBarRoot,
  Brand: NavBarBrand,
  Family: NavBarFamily,
  Badge: NavBarBadge,
  Items: NavBarItems,
  Link: NavBarLink,
  Menu: NavBarMenu,
  MenuLink: NavBarMenuLink,
  Actions: NavBarActions,
  Repo: NavBarRepo,
  Language: NavBarLanguage,
  Mobile: NavBarMobile,
  MobilePreferences: NavBarMobilePreferences,
  MobileGroup: NavBarMobileGroup,
  MobileLink: NavBarMobileLink,
};
