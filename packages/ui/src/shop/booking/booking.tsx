// Server-safe (the phone bar is a client island imported through its own entry). The way to book (ADR-007 §3): `strip` —
// the next free times, one tap each, in one line; `panel` — the closing call; `sticky` — the phone bar, held at the bottom
// edge and never over content. The times are resolved by the product: the section draws them, it never fetches.
import { buttonVariants } from "@krizaka/ui/button";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { StickyAction } from "@krizaka/ui/sticky-action";
import * as React from "react";

import { BlockLink, type LinkComponent } from "../../block-link";
import { cn } from "../../cn";
import { ShopSection } from "../frame";

export type BookingVariant = "strip" | "panel" | "sticky";

export type BookingTime = {
  id: string;
  /** In words, formatted by the app (`Today 4:30 pm`). */
  label: string;
  /** The booking page with this time chosen. */
  href: string;
};

export type BookingSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "strip" */
  variant?: BookingVariant;
  /** `strip`: the next free times, in order (the first `count`). */
  times?: readonly BookingTime[];
  /** `strip`: the group's name (`Next free times`). */
  label: string;
  /** `strip`: said when no time is free. */
  emptyLabel?: string;
  /** The booking page (`All times →`, `Book`). */
  href: string;
  /** The words of that link / button. */
  actionLabel: string;
  /** `panel`: the invitation (`Ready when you are`), and why. */
  title?: React.ReactNode;
  body?: React.ReactNode;
  linkAs?: LinkComponent;
  /** `sticky`: the selector of the page's own action (`#hero-book`): while it is on screen the bar hides. */
  hideWhileVisible?: string;
};

/** The way to book: the next free times, a closing call, or the phone bar. */
export function BookingSection({ variant = "strip", times = [], label, emptyLabel, href, actionLabel, title, body, linkAs, hideWhileVisible, className, ...props }: BookingSectionProps) {
  const action = (size: "md" | "lg") => (
    <BlockLink href={href} linkAs={linkAs} className={cn(buttonVariants({ variant: "primary", size }), "no-underline")}>
      {actionLabel}
    </BlockLink>
  );
  if (variant === "sticky") {
    return (
      <StickyAction hideWhileVisible={hideWhileVisible} data-variant="sticky" className={className} {...(props as object)}>
        <BlockLink href={href} linkAs={linkAs} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full justify-center no-underline")}>
          {actionLabel}
        </BlockLink>
      </StickyAction>
    );
  }
  if (variant === "panel") {
    return (
      <ShopSection aria-label={typeof title === "string" ? title : label} data-variant="panel" className={className} {...props}>
        <CtaPanel title={title ?? label} body={body}>
          {action("lg")}
        </CtaPanel>
      </ShopSection>
    );
  }
  return (
    <ShopSection aria-label={label} data-variant="strip" className={className} {...props}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border-default bg-surface-1 p-3 sm:px-4">
        <p className="m-0 order-1 text-sm font-semibold text-fg">{label}</p>
        {times.length > 0 ? (
          <ul className="m-0 order-3 grid w-full list-none grid-cols-2 gap-2 p-0 sm:order-2 sm:flex sm:w-auto sm:min-w-0 sm:flex-1 sm:flex-wrap">
            {times.map((t) => (
              <li key={t.id}>
                <BlockLink href={t.href} linkAs={linkAs} className="inline-flex min-h-11 items-center rounded-md border border-border-control bg-surface-2 px-3 text-[13px] font-semibold tabular-nums text-fg no-underline hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  {t.label}
                </BlockLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 order-3 w-full text-sm text-fg-secondary sm:order-2 sm:w-auto sm:flex-1">{emptyLabel}</p>
        )}
        <BlockLink href={href} linkAs={linkAs} className="order-2 ml-auto inline-flex min-h-11 items-center gap-1 text-[13px] sm:order-3 font-semibold text-fg-accent no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {actionLabel} <span aria-hidden>→</span>
        </BlockLink>
      </div>
    </ShopSection>
  );
}
