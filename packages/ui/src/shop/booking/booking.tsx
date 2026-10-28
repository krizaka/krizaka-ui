// Server-safe (the phone bar is a client island imported through its own entry). The way to book (ADR-007 §3): `strip` —
// the next free times, one tap each, in one line; `panel` — the closing call in a box; `closing` — the closing call of a look (the shop's photo or mark, the next free time, Book); `sticky` — the phone bar, held at the bottom
// edge and never over content. The times are resolved by the product: the section draws them, it never fetches.
import { buttonVariants } from "@krizaka/ui/button";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { StickyAction } from "@krizaka/ui/sticky-action";
import * as React from "react";

import { BlockLink, type LinkComponent } from "../../block-link";
import { cn } from "../../cn";
import { Page } from "../../page/page";
import { type ShopPhoto, ShopSection } from "../frame";
import { Photo } from "../photo";

export type BookingVariant = "strip" | "panel" | "closing" | "sticky";

/** `closing`: the second action beside « Book » (`Call`, `Directions`): the host chooses it from the shop's settings. */
export type BookingSecondary = { label: string; href: string };

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
  /** `closing`: the shop's photo, one the page does not already show (the host plans it). Wins over `mark`. */
  photo?: ShopPhoto;
  /** `closing`: the shop's mark, when there is no photo. Decorative (hidden from assistive technology). */
  mark?: React.ReactNode;
  /**
   * `closing`: the next free time (`Tomorrow 9 am`). On a closed day it is the next opening's. Absent, the call is the
   * title and the primary action alone: never an empty box.
   */
  nextTime?: BookingTime;
  /** `closing`: the words before the time (`Next free time`). */
  nextTimeLabel?: string;
  /** `closing`: « Call » or « Directions ». */
  secondary?: BookingSecondary;
  linkAs?: LinkComponent;
  /** `sticky`: the selector of the page's own action (`#hero-book`): while it is on screen the bar hides. */
  hideWhileVisible?: string;
};

type ClosingCallProps = Omit<React.ComponentProps<"section">, "title"> &
  Pick<BookingSectionProps, "body" | "photo" | "mark" | "nextTime" | "nextTimeLabel" | "secondary" | "href" | "actionLabel" | "linkAs"> & { title: React.ReactNode };

/** The photo, or the mark when there is none, or nothing: the call then reads on one column. */
function ClosingMedia({ photo, mark }: Pick<BookingSectionProps, "photo" | "mark">) {
  if (photo) return <Photo photo={photo} ratio="4/3" sizes="(min-width: 64rem) 36rem, calc(100vw - 2rem)" />;
  if (!mark) return null;
  return (
    <div aria-hidden className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-accent-soft text-fg-accent [&>svg]:h-1/2 [&>svg]:w-auto">
      {mark}
    </div>
  );
}

function ClosingCall({ title, body, photo, mark, nextTime, nextTimeLabel, secondary, href, actionLabel, linkAs, className, ...props }: ClosingCallProps) {
  const headingId = React.useId();
  const hasMedia = Boolean(photo ?? mark);
  return (
    <ShopSection aria-labelledby={headingId} data-variant="closing" bleed className={className} {...props}>
      <Page>
        <div className={cn("grid items-center gap-6 rounded-2xl bg-surface-1 p-4 sm:p-6 lg:gap-10 lg:p-8", hasMedia && "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]")}>
          <ClosingMedia photo={photo} mark={mark} />
          <div className="flex min-w-0 flex-col items-start gap-4">
            <h2 id={headingId} className="m-0 text-2xl font-bold leading-tight text-fg sm:text-3xl">
              {title}
            </h2>
            {body ? <p className="m-0 max-w-prose text-[15px] leading-relaxed text-fg-secondary">{body}</p> : null}
            {nextTime ? (
              <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-secondary">
                {nextTimeLabel ? <span>{nextTimeLabel}</span> : null}
                <BlockLink href={nextTime.href} linkAs={linkAs} className="inline-flex min-h-11 items-center rounded-md border border-border-control bg-surface-2 px-3 text-sm font-semibold tabular-nums text-fg no-underline hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  {nextTime.label}
                </BlockLink>
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <BlockLink href={href} linkAs={linkAs} className={cn(buttonVariants({ variant: "primary", size: "lg" }), "no-underline")}>
                {actionLabel}
              </BlockLink>
              {secondary ? (
                <BlockLink href={secondary.href} linkAs={linkAs} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "no-underline")}>
                  {secondary.label}
                </BlockLink>
              ) : null}
            </div>
          </div>
        </div>
      </Page>
    </ShopSection>
  );
}

/** The way to book: the next free times, a closing call, or the phone bar. */
export function BookingSection({ variant = "strip", times = [], label, emptyLabel, href, actionLabel, title, body, linkAs, hideWhileVisible, photo, mark, nextTime, nextTimeLabel, secondary, className, ...props }: BookingSectionProps) {
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
  if (variant === "closing") {
    return <ClosingCall title={title ?? label} body={body} photo={photo} mark={mark} nextTime={nextTime} nextTimeLabel={nextTimeLabel} secondary={secondary} href={href} actionLabel={actionLabel} linkAs={linkAs} className={className} {...props} />;
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
