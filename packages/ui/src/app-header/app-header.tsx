// Server-safe: no hook, no context. The family's top bar (#640): the product's NAME as text (the mark is the rail's), optional
// chips, then the session's controls in a fixed order — search, language, the host's actions (a theme toggle), messages,
// notifications, the primary action, the account. Every slot is the host's; a slot left empty draws nothing. Where the
// rail is a bottom tab bar (a phone) it has no room for the mark, so the header shows it there and only there: exactly
// one brand mark is visible at every width. At 360 px the name truncates first; the controls never clip.
import * as React from "react";
import { tv } from "tailwind-variants";

export const appHeader = tv({
  slots: {
    root: "sticky top-0 z-30 flex h-14 w-full min-w-0 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-1 px-4 md:bg-surface-1 md:pl-3 md:pr-5",
    // The rail's mark is 56 px tall and so is this bar: the word shares the mark's line, right after the rail.
    brand: "flex min-w-0 items-center gap-2 font-display text-sm font-bold tracking-tight text-fg no-underline",
    mark: "inline-flex shrink-0 md:hidden",
    name: "truncate",
    chips: "flex shrink-0 items-center gap-2",
    // The controls: one row at the right, in the order of the slots. They keep their size; the name gives way.
    actions: "ml-auto flex shrink-0 items-center gap-1 sm:gap-2",
    search: "flex min-w-0 shrink-0",
  },
});
const s = appHeader();

export type AppHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  /** The product's name, as text (`Orazaka`): the only brand element on a desktop. */
  name: string;
  /** The product's mark (`<ProductLogo id="orazaka" size={22} />`): shown below `md` only, where the rail (which carries it) is a bottom bar. */
  mark?: React.ReactNode;
  /** Makes the name (and the mark) a link home: pass your router's link as `homeLink` or give a `href`. */
  href?: string;
  /** Your router's link element for the home link; it receives the name and the mark as children. */
  homeLink?: React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  /** Status chips beside the name (`Badge`): « Local · Sovereign », « Dev », a version. */
  chips?: React.ReactNode;
  /** The search trigger, first of the controls: `AppHeaderSearch` (`@krizaka/ui/app-header/search`) — a field from `md`, an icon below, ⌘K. */
  search?: React.ReactNode;
  /** The language: `LanguageSwitch` (`@krizaka/ui/language-switch`) — a globe and « FR », labelled. */
  language?: React.ReactNode;
  /** The host's own controls, after the language (a theme toggle). Alone, it is the whole right side, as before. */
  actions?: React.ReactNode;
  /** Messages: an `AppHeaderCount` (an icon button or link with its unread count). Empty: hidden. */
  messages?: React.ReactNode;
  /** Notifications: an `AppHeaderCount` (or the trigger of the host's popover). Empty: hidden. */
  notifications?: React.ReactNode;
  /** The one primary action of the app (« New check », #588), before the account. */
  primary?: React.ReactNode;
  /** The account, last: `AccountMenu` with `showName` (the name from `sm`), or the visitor's Sign in. */
  account?: React.ReactNode;
};

/** The app's top bar: the name next to the rail, the mark on a phone, chips, then search · language · actions · messages · notifications · primary · account. */
export function AppHeader({ name, mark, href, homeLink, chips, search, language, actions, messages, notifications, primary, account, className, ...props }: AppHeaderProps) {
  const brand = (
    <>
      {mark && <span data-brand-mark className={s.mark()}>{mark}</span>}
      <span className={s.name()}>{name}</span>
    </>
  );
  const hasControls = [search, language, actions, messages, notifications, primary, account].some(Boolean);
  return (
    <header className={s.root({ className })} {...props}>
      {homeLink ? (
        React.cloneElement(homeLink, { className: s.brand() }, brand)
      ) : href ? (
        <a href={href} className={s.brand()}>{brand}</a>
      ) : (
        <div className={s.brand()}>{brand}</div>
      )}
      {chips && <div className={s.chips()}>{chips}</div>}
      {/* The order is the family's, not the host's: the same bar in every product. */}
      {hasControls && (
        <div className={s.actions()}>
          {search && <div data-slot="search" className={s.search()}>{search}</div>}
          {language}
          {actions}
          {messages}
          {notifications}
          {primary}
          {account}
        </div>
      )}
    </header>
  );
}
