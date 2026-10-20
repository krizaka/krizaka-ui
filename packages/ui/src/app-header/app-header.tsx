// Server-safe: no hook, no context. The top bar that sits next to a `RailNav`: the product's NAME as text (the mark is the
// rail's), then optional chips, then the actions. Where the rail is a bottom tab bar (a phone) it has no room for the mark,
// so the header shows it there and only there: exactly one brand mark is visible at every width.
import * as React from "react";
import { tv } from "tailwind-variants";

export const appHeader = tv({
  slots: {
    root: "sticky top-0 z-30 flex h-14 w-full shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-1 px-4 md:bg-surface-1 md:pl-3 md:pr-5",
    // The rail's mark is 56 px tall and so is this bar: the word shares the mark's line, right after the rail.
    brand: "flex min-w-0 items-center gap-2 font-display text-sm font-bold tracking-tight text-fg no-underline",
    mark: "inline-flex shrink-0 md:hidden",
    name: "truncate",
    chips: "flex shrink-0 items-center gap-2",
    actions: "ml-auto flex shrink-0 items-center gap-2",
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
  /** On the right: theme, notifications, the account menu. */
  actions?: React.ReactNode;
};

/** The app's top bar: the name next to the rail, the mark on a phone, chips, actions. */
export function AppHeader({ name, mark, href, homeLink, chips, actions, className, ...props }: AppHeaderProps) {
  const brand = (
    <>
      {mark && <span data-brand-mark className={s.mark()}>{mark}</span>}
      <span className={s.name()}>{name}</span>
    </>
  );
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
      {actions && <div className={s.actions()}>{actions}</div>}
    </header>
  );
}
