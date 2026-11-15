// Server-safe, no hook and no client code. The strip above a page that a platform hosts for its customer (a shop on
// Folioviv, a shared Verikora report): the platform's mark on the left, the host's controls (the language switch) on the
// right, and — when given — one line that says what this page is (a development version, a demonstration). It is the
// dev band and the demo line merged into one bar. Static: it scrolls away with the page and never covers its header.
// It draws only what it is given: no navigation, no « sign in ».
import type * as React from "react";
import { tv } from "tailwind-variants";

export const platformBar = tv({
  slots: {
    root: "w-full border-b border-border-subtle bg-surface-1 text-fg",
    inner:
      "mx-auto flex min-h-12 w-full max-w-[calc(var(--kz-page-max,72rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))] flex-wrap items-center gap-x-4 gap-y-1 px-[var(--kz-page-gutter,clamp(16px,3.2vw,32px))] py-1.5",
    brand: "order-1 flex min-h-6 min-w-0 items-center gap-2 text-sm font-semibold text-fg",
    notice: "order-3 flex min-w-0 basis-full items-start gap-2 pb-1 text-xs leading-snug sm:order-2 sm:basis-0 sm:flex-1 sm:items-center sm:pb-0",
    dot: "mt-1 size-2 shrink-0 rounded-full bg-warning sm:mt-0",
    text: "min-w-0 text-fg-secondary",
    title: "font-semibold text-fg",
    link: "font-semibold text-fg-accent underline-offset-2 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
    end: "order-2 ml-auto flex items-center gap-2 sm:order-3",
  },
});

export type PlatformBarNotice = {
  /** The short headline (« Boutique de démonstration »). Passed translated. */
  title?: string;
  /** The line (« Les données sont fictives. Aucune réservation n'est réelle. »). Passed translated. */
  message: string;
  /** A way to learn more; it is the only link the notice can carry. */
  link?: { label: string; href: string };
};

export type PlatformBarProps = Omit<React.ComponentProps<"section">, "children" | "title"> & {
  /** The platform's name, the region's accessible name (« Folioviv »). Passed translated. */
  label: string;
  /** The platform's mark and name, usually one link home. */
  brand: React.ReactNode;
  /** The one line for what this page is (a development version, a demonstration). Omit it on a real, live page. */
  notice?: PlatformBarNotice;
  /** The host's control at the end: `LanguageSwitch` of `@krizaka/ui/language-switch`. */
  end?: React.ReactNode;
};

/** The platform's bar above a hosted page: its mark, one line about the page, the language switch. Not sticky, no client JS. */
export function PlatformBar({ label, brand, notice, end, className, ...props }: Readonly<PlatformBarProps>) {
  const s = platformBar();
  return (
    <section aria-label={label} className={s.root({ className })} {...props}>
      <div className={s.inner()}>
        <div className={s.brand()}>{brand}</div>
        {notice && (
          <p className={s.notice()}>
            <span aria-hidden className={s.dot()} />
            <span className={s.text()}>
              {notice.title && <span className={s.title()}>{notice.title} </span>}
              {notice.message}
              {notice.link && (
                <>
                  {" "}
                  <a href={notice.link.href} className={s.link()}>
                    {notice.link.label}
                  </a>
                </>
              )}
            </span>
          </p>
        )}
        {end && <div className={s.end()}>{end}</div>}
      </div>
    </section>
  );
}
