// Client (the rail's state, the account menu, the theme). THE signed-in frame of every Krizaka web product (audit F1, F2,
// F6): the rail (a bottom tab bar on a phone) and the family's top bar, composed once from data. The product keeps its
// list of sections; the frame owns the rest — the account menu's content and order, where the preferences live (always in
// the menu: a header has no room for them on a phone), which place is on the rail and which is under the avatar.
import { AccountMenu, type AccountMenuLink } from "@krizaka/ui/account-menu";
import { AppHeader } from "@krizaka/ui/app-header";
import { AppHeaderSearch } from "@krizaka/ui/app-header/search";
import { Badge } from "@krizaka/ui/badge";
import { RailNav } from "@krizaka/ui/rail-nav";
import { type Mode, useOptionalTheme } from "@krizaka/ui/theme";
import * as React from "react";

import type { BrandId } from "../marks/ProductLogo";
import { type AccountLinkId, framePlaces, type FrameSection, orderAccountLinks } from "./contract";
import { navVocabulary, type NavWords } from "./vocabulary";

export interface AppFrameAccountLink {
  href: string;
  /** Overrides the shared word (`Credits and usage` for billing where credits exist). */
  label?: string;
  icon?: React.ReactNode;
}

export interface AppFrameAccount {
  name?: string;
  email?: string;
  /** `src`, or `defaultAvatar` (`{ brand, seed }`). */
  avatar?: React.ComponentProps<typeof AccountMenu>["avatar"];
  /**
   * The places under the avatar. Pass the ones the product has: Billing only when it sells, Administration only for an
   * admin. The frame draws them in its order (Profile, Settings, Billing, Administration), Settings landing on the settings home.
   */
  links?: Partial<Record<AccountLinkId, AppFrameAccountLink>>;
  /** Called by Sign out. */
  onSignOut: () => void;
}

export interface AppFrameLanguage {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export interface AppFrameTheme {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export interface AppFrameProps {
  /** The product's name, as text in the top bar. */
  name: string;
  /** The product's mark (`<ProductLogo id="yomizaka" size={26} />`): on the rail on a desktop, in the top bar on a phone. */
  mark: React.ReactNode;
  /** The mark in the top bar below `md` (smaller). Defaults to `mark`. */
  headerMark?: React.ReactNode;
  /** Where the mark and the name lead (`/app`). */
  homeHref: string;
  /** The product's brand: scopes its colours over the rail. */
  accent?: BrandId;
  /** The destinations. `place: "foot"` puts one at the rail's foot; `gated` leaves one out for this person. */
  sections: readonly FrameSection[];
  /** The id of the section the person is in. */
  currentId?: string;
  /** Who is signed in, the places under their avatar and Sign out. */
  account: AppFrameAccount;
  /** The one primary action of the app (« Check a document »). */
  primary?: React.ReactNode;
  /** The search (⌘K): opens the app's command palette. */
  search?: { label: string; onOpen: () => void };
  /** Notifications: an `AppHeaderCount`, or the trigger of the host's popover. */
  notifications?: React.ReactNode;
  /** Chips beside the name (`Dev`, `Local · Sovereign`). */
  chips?: React.ReactNode;
  /** `admin`: the administration's frame — a chip says so, and the way into it is not offered again. */
  variant?: "app" | "admin";
  /** The language row of the account menu; absent for a product with one language. */
  language?: AppFrameLanguage;
  /** The theme row. By default the `ThemeProvider`'s; pass `false` for a product that has none. */
  theme?: AppFrameTheme | false;
  /** `en` or `fr`: the words of the shared vocabulary. @default "en" */
  locale?: string;
  /** Overrides of the shared words, for a product that needs one different (use sparingly). */
  words?: Partial<NavWords>;
  /** The router's link component (Next's `Link`) for the rail and the menu. */
  linkAs?: React.ElementType;
  /** The page, inside `RailNav.Body` under the top bar. */
  children: React.ReactNode;
  /** The rail's accessible name. Defaults to the product's name. */
  label?: string;
}

const MODES: readonly Mode[] = ["light", "dark", "system"];

function useFrameTheme(theme: AppFrameProps["theme"]): AppFrameTheme | null {
  const provided = useOptionalTheme();
  if (theme === false) return null;
  if (theme) return theme;
  return provided ? { value: provided.mode, onChange: provided.setMode } : null;
}

/** The signed-in frame: sections, account and the primary action in; the rail, the top bar and the account menu out. */
export function AppFrame({
  name, mark, headerMark, homeHref, accent, sections, currentId, account, primary, search, notifications, chips, variant = "app", language, theme, locale = "en", words, linkAs: Link, children, label,
}: AppFrameProps) {
  const w = { ...navVocabulary(locale), ...words };
  const admin = variant === "admin";
  const links = orderAccountLinks(account.links, admin);
  const places = framePlaces(sections, links.map((l) => l.id));
  const frameTheme = useFrameTheme(theme);
  const item = (section: FrameSection) => (
    <RailNav.Item
      key={section.id}
      asChild={Boolean(Link)}
      href={Link ? undefined : section.href}
      icon={section.icon}
      label={section.label}
      current={section.id === currentId}
      badge={section.badge}
      badgeLabel={section.badgeLabel}
    >
      {Link ? <Link href={section.href} /> : undefined}
    </RailNav.Item>
  );
  const menuLinks: AccountMenuLink[] = links.map(({ id, link }) => ({ id, label: link.label ?? w[id], href: link.href, icon: link.icon }));
  const modeLabels: Record<Mode, string> = { light: w.themeLight, dark: w.themeDark, system: w.themeSystem };
  return (
    <RailNav.Shell data-variant={variant}>
      <RailNav.Root
        label={label ?? name}
        accent={accent}
        mark={Link ? <Link href={homeHref} aria-label={name}>{mark}</Link> : <a href={homeHref} aria-label={name}>{mark}</a>}
        footer={places.foot.length > 0 ? places.foot.map(item) : undefined}
      >
        {places.main.map(item)}
      </RailNav.Root>
      <RailNav.Body>
        <AppHeader
          name={name}
          mark={headerMark ?? mark}
          href={Link ? undefined : homeHref}
          homeLink={Link ? <Link href={homeHref} /> : undefined}
          chips={
            <>
              {admin && <Badge tone="accent">{w.administration}</Badge>}
              {chips}
            </>
          }
          search={search && <AppHeaderSearch label={search.label} onOpen={search.onOpen} />}
          notifications={notifications}
          primary={primary}
          account={
            <AccountMenu
              label={w.account}
              name={account.name}
              email={account.email}
              avatar={account.avatar}
              showName="lg"
              links={menuLinks}
              linkAs={Link}
              language={language && { label: w.language, value: language.value, options: language.options, onChange: language.onChange }}
              theme={frameTheme ? { label: w.theme, value: frameTheme.value, options: MODES.map((value) => ({ value, label: modeLabels[value] })), onChange: (value) => frameTheme.onChange(value as Mode) } : undefined}
              signOut={{ label: w.signOut, onSelect: account.onSignOut }}
            />
          }
        />
        {children}
      </RailNav.Body>
    </RailNav.Shell>
  );
}
