// Server-safe. The page of a site (krizaka.com, a product's public pages): a link to skip to the content, the site's
// bar, the page — its PageHero and Sections (@krizaka/ui/page) — and the footer. The bar floats over the hero
// (`--kz-hero-top` clears it); everything shares the page frame (`--kz-page-max`, `--kz-page-gutter`).
import type * as React from "react";
import { tv } from "tailwind-variants";

export const marketingLayout = tv({
  slots: {
    root: "flex min-h-dvh w-full flex-col bg-surface-0 text-fg",
    skip:
      "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface-1 focus:px-4 focus:py-2 " +
      "focus:text-sm focus:font-semibold focus:text-fg focus:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-ring",
    header: "fixed inset-x-0 top-3 z-50 px-(--kz-page-gutter,16px) pointer-events-none *:pointer-events-auto",
    main: "flex-1 outline-hidden",
  },
});
const s = marketingLayout();

export type MarketingLayoutProps = React.ComponentProps<"div"> & {
  /** The site's bar (a floating NavBar of @krizaka/ui/nav-bar). */
  header: React.ReactNode;
  /** The site's footer. */
  footer?: React.ReactNode;
  /** The words of the link that skips to the content (`Skip to content`). */
  skipLabel: string;
  /** The page: a PageHero, then Sections. */
  children: React.ReactNode;
};

/** A site's page: skip link, floating bar, the page, the footer. */
export function MarketingLayout({ header, footer, skipLabel, className, children, ...props }: MarketingLayoutProps) {
  return (
    <div className={s.root({ className })} {...props}>
      <a href="#content" className={s.skip()}>
        {skipLabel}
      </a>
      <div className={s.header()}>{header}</div>
      <main id="content" tabIndex={-1} className={s.main()}>
        {children}
      </main>
      {footer}
    </div>
  );
}
