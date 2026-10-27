// Server-safe: no hook, no context. A service a shop sells, as a card that argues: icon or photo, name, duration, price
// (« from » when it varies), what is included, the capacity, a « Popular » tag — and one way in: a link (the booking page
// with this service chosen) or a button (`onSelect`, from a client parent). The whole card takes the press.
import * as React from "react";
import { tv } from "tailwind-variants";

import { BlockLink, type LinkComponent } from "../block-link";
import { buttonVariants } from "../button/button";
import { cn } from "../cn";
import { CheckGlyph } from "../glyphs";
import { Stamp } from "../specimen-tag/specimen-tag";

export const serviceCard = tv({
  slots: {
    root:
      "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-surface-1 text-fg transition-colors duration-150 hover:border-border-strong hover:bg-surface-2 " +
      "hover:border-accent/50 focus-within:ring-2 focus-within:ring-ring data-[selected]:border-accent data-[selected]:bg-accent-soft",
    media: "relative aspect-[16/9] w-full overflow-hidden bg-media [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
    body: "flex flex-1 flex-col gap-3 p-4 sm:p-5",
    head: "flex items-start gap-3",
    icon: "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-fg-accent [&>svg]:h-5 [&>svg]:w-5",
    titles: "flex min-w-0 flex-1 flex-col gap-1",
    name: "m-0 font-display text-lg font-bold leading-tight tracking-tight text-fg",
    facts: "m-0 flex list-none flex-wrap gap-x-2 gap-y-0.5 p-0 text-xs text-fg-secondary",
    tag: "shrink-0 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-extrabold text-on-accent",
    description: "m-0 text-sm leading-relaxed text-fg-secondary",
    included: "m-0 flex list-none flex-col gap-1.5 p-0 text-sm text-fg-secondary",
    includedItem: "flex items-start gap-2 [&>svg]:mt-0.5 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-fg-accent",
    foot: "mt-auto flex items-end justify-between gap-3 border-t border-border-subtle pt-3",
    priceBlock: "flex flex-col leading-none",
    from: "mb-1 text-[11px] font-semibold text-fg-secondary",
    price: "font-display text-2xl font-black tabular-nums text-fg",
    action:
      "inline-flex min-h-9 items-center gap-1 rounded-sm text-sm font-bold text-fg-accent no-underline " +
      "after:absolute after:inset-0 after:content-[''] focus-visible:outline-hidden group-data-[selected]:text-fg",
  },
  variants: {
    // The Cahier's stamped index card (krizaka-ui#603): ruled, straight, a punched hole, the facts stamped, a secondary Button.
    // Same elements and same accessible output as the default card; only the drawing changes. The card is not the link, so
    // the name stays selectable.
    variant: {
      default: {},
      index: {
        root:
          "rounded-none border-border-default bg-surface-1 shadow-[4px_5px_0_-2px_var(--kz-border-default)] " +
          "transition-[transform,box-shadow,border-color] duration-120 hover:border-border-strong hover:bg-surface-1 hover:-translate-y-0.5 " +
          "hover:shadow-[6px_7px_0_-2px_var(--kz-border-default)] focus-within:-translate-y-0.5 focus-within:shadow-[6px_7px_0_-2px_var(--kz-border-default)] " +
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0",
        body: "relative pt-8 sm:pt-9",
        head: "border-b border-(--kz-paper-rule-major) pb-3",
        name: "font-display font-normal",
        facts: "gap-2 text-fg",
        foot: "border-t-0 pt-1",
      },
    },
    // `density="list"` is deprecated (ADR-007): a list of services is `ServicesSection variant="menu"` of `@krizaka/ui/shop/services`.
    density: { grid: {}, list: {} },
    // The photo's box: the wide 16:9 band, or the 4:3 of `services · cards` (ADR-007 §6).
    mediaRatio: { wide: {}, photo: { media: "aspect-[4/3]" } },
  },
  compoundVariants: [
    { variant: "index", density: "list", class: { root: "sm:flex-row", media: "sm:aspect-auto sm:w-1/3 sm:shrink-0", body: "sm:flex-1" } },
  ],
  defaultVariants: { variant: "default", density: "grid", mediaRatio: "wide" },
});

export type ServiceCardProps = Omit<React.ComponentProps<"article">, "title" | "children"> & {
  /** The service's name (the heading). */
  name: string;
  /** Its price, formatted by the app (`22,00 $`): the card never formats money. */
  price: string;
  /** The words before the price when it varies (`From`, `À partir de`), passed translated. */
  priceFrom?: string;
  /** How long it takes (`30 min`) — the first fact. */
  duration?: string;
  /** How many it takes (`Up to 5 dogs`, `1 person`) — the second fact. */
  capacity?: string;
  /** One or two sentences: what it is. */
  description?: string;
  /** What is included, one short line each (a check precedes it). */
  included?: readonly string[];
  /** A tag on the top right (`Popular`): only from real data, never decoration. */
  tag?: string;
  /** An icon tile before the name (a signature icon): decorative. */
  icon?: React.ReactNode;
  /** A photo or a loop above the card (an `img`, a `video`): fills a 16:9 band. */
  media?: React.ReactNode;
  /** This service is the chosen one (the accent, `data-selected`). */
  selected?: boolean;
  /** The words of the way in (`Book`, `Choose`): the accessible name of the press. */
  actionLabel: string;
  /** The way in, as an address (the booking page with this service preselected). */
  href?: string;
  /** The app's link component for internal addresses (Next's `Link`). */
  linkAs?: LinkComponent;
  /** The way in, as a press (a client parent). Ignored when `href` is set. */
  onSelect?: () => void;
  /**
   * `index` — the Cahier's stamped index card: a ruled card with a punched hole, straight, the duration and the price as
   * stamps, a secondary button. The same props and the same accessible output; only the drawing changes.
   * @default "default"
   */
  variant?: "default" | "index";
  /**
   * `variant="index"`: `list` lays the card out as a row for a single column (the media on the left from `sm`).
   * @deprecated Since 3.64: use `ServicesSection variant="menu"` of `@krizaka/ui/shop/services` (the compact price board). Removed in 4.0.0.
   * @default "grid"
   */
  density?: "grid" | "list";
  /**
   * The photo's box: `wide` (16:9) or `photo` (4:3).
   * @default "wide"
   */
  mediaRatio?: "wide" | "photo";
  /**
   * The heading level of the name.
   * @default "h3"
   */
  titleAs?: "h2" | "h3" | "h4";
  /** Enters on scroll (MotionObserver): the index in the grid becomes the delay. */
  reveal?: number;
};

/** A service as a card: icon or photo, duration, price, what is included, the capacity, a tag — one way in. */
export function ServiceCard({
  name, price, priceFrom, duration, capacity, description, included, tag, icon, media, selected, actionLabel, href, linkAs, onSelect, titleAs: Title = "h3", reveal, variant = "default", density = "grid", mediaRatio = "wide", className, style, ...props
}: ServiceCardProps) {
  const s = serviceCard({ variant, density, mediaRatio });
  const index = variant === "index";
  const id = React.useId();
  const facts = [duration, capacity].filter(Boolean);
  const actionClass = index ? cn(buttonVariants({ variant: "secondary", size: "md" }), "min-h-11 rounded-none no-underline") : s.action();
  const arrow = <span aria-hidden>→</span>;
  const revealStyle = reveal === undefined ? style : ({ ...style, "--kz-delay": `${Math.min(Math.max(reveal, 0), 8) * 50}ms` } as React.CSSProperties);
  return (
    <article
      aria-labelledby={id}
      data-selected={selected ? "" : undefined}
      data-variant={variant}
      data-density={index ? density : undefined}
      data-reveal={reveal === undefined ? undefined : ""}
      style={revealStyle}
      className={s.root({ className })}
      {...props}
    >
      {media && <div className={s.media()}>{media}</div>}
      <div className={s.body()}>
        {index && (
          <svg data-hole aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="absolute start-3 top-3 h-4 w-4">
            <circle cx="8" cy="8" r="5.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
          </svg>
        )}
        <div className={s.head()}>
          {icon && <span aria-hidden className={s.icon()}>{icon}</span>}
          <div className={s.titles()}>
            <Title id={id} className={s.name()}>{name}</Title>
            {facts.length > 0 && (
              <ul className={s.facts()}>
                {facts.map((fact, i) => (
                  <li key={i}>
                    {index ? <Stamp tone="ink" size="sm">{fact}</Stamp> : <>{i > 0 && <span aria-hidden>· </span>}{fact}</>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {tag && <span className={s.tag()}>{tag}</span>}
        </div>
        {description && <p className={s.description()}>{description}</p>}
        {included && included.length > 0 && (
          <ul className={s.included()}>
            {included.map((line) => (
              <li key={line} className={s.includedItem()}>
                <CheckGlyph />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
        <div className={s.foot()}>
          <p className={s.priceBlock()}>
            {priceFrom && <span className={s.from()}>{priceFrom}</span>}
            {index ? <Stamp tone="ink" size="sm" data-figure="" className="tabular-nums">{price}</Stamp> : <span className={s.price()}>{price}</span>}
          </p>
          {href ? (
            <BlockLink href={href} linkAs={linkAs} className={actionClass} aria-describedby={id}>
              {actionLabel} {arrow}
            </BlockLink>
          ) : onSelect ? (
            <button type="button" onClick={onSelect} aria-pressed={selected ?? false} aria-describedby={id} className={actionClass}>
              {actionLabel} {arrow}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
