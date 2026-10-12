// Server-safe. A documentation page in the site's frame (--kz-page-max-docs): the sidebar of pages, the article, the
// table of contents — the three columns of the frame on a wide screen, the sidebar folded into a disclosure above the
// article on a phone, the contents under the title as chips (a `Toc`). Its edges are the bar's: no column runs to the
// window's edge.
import type * as React from "react";
import { tv } from "tailwind-variants";

import { ChevronGlyph } from "../glyphs";

export const docsLayout = tv({
  slots: {
    root:
      "mx-auto grid w-full max-w-[calc(var(--kz-page-max-docs,88rem)+2*var(--kz-page-gutter,24px))] grid-cols-1 gap-8 px-(--kz-page-gutter,16px) " +
      "pt-(--kz-hero-top,6rem) pb-16 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]",
    sidebar: "hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto",
    mobileNav: "rounded-xl border border-border-default bg-surface-1 lg:hidden",
    mobileSummary:
      "flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden " +
      "rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring [[open]>&>svg]:rotate-180",
    mobileBody: "border-t border-border-subtle px-2 py-2",
    article: "min-w-0 max-w-3xl",
    toc: "hidden xl:block xl:sticky xl:top-24 xl:self-start",
  },
});
const s = docsLayout();

export type DocsLayoutProps = React.ComponentProps<"div"> & {
  /** The pages of the documentation (a nav of links, grouped). */
  sidebar: React.ReactNode;
  /** On a phone the sidebar is folded: the words that open it (`Pages of the documentation`). */
  sidebarLabel: string;
  /** The page's table of contents (a `Toc` of @krizaka/ui/toc): beside the article from `xl`. */
  toc?: React.ReactNode;
  /** The article: its title, its body. */
  children: React.ReactNode;
};

/** A documentation page: pages · article · contents, in the site's frame. */
export function DocsLayout({ sidebar, sidebarLabel, toc, className, children, ...props }: DocsLayoutProps) {
  return (
    <div className={s.root({ className })} {...props}>
      <div className={s.sidebar()}>{sidebar}</div>
      <div className="flex min-w-0 flex-col gap-6">
        <details className={s.mobileNav()}>
          <summary className={s.mobileSummary()}>
            {sidebarLabel} <ChevronGlyph className="h-4 w-4 transition-transform motion-reduce:transition-none" />
          </summary>
          <div className={s.mobileBody()}>{sidebar}</div>
        </details>
        <article className={s.article()}>{children}</article>
      </div>
      {toc && <div className={s.toc()}>{toc}</div>}
    </div>
  );
}
