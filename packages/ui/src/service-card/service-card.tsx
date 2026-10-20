// Server-safe: no hook, no context. A service a shop sells, as a card that argues: icon or photo, name, duration, price
// (« from » when it varies), what is included, the capacity, a « Popular » tag — and one way in: a link (the booking page
// with this service chosen) or a button (`onSelect`, from a client parent). The whole card takes the press.
import * as React from "react";
import { tv } from "tailwind-variants";

import { BlockLink, type LinkComponent } from "../block-link";
import { CheckGlyph } from "../glyphs";

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
    tag: "shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold text-on-accent",
    description: "m-0 text-sm leading-relaxed text-fg-secondary",
    included: "m-0 flex list-none flex-col gap-1.5 p-0 text-sm text-fg-secondary",
    includedItem: "flex items-start gap-2 [&>svg]:mt-0.5 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-fg-accent",
    foot: "mt-auto flex items-end justify-between gap-3 border-t border-border-subtle pt-3",
    priceBlock: "flex flex-col leading-none",
    from: "mb-1 text-[11px] font-semibold text-fg-secondary",
    price: "font-display text-2xl font-black tabular-nums text-fg",
    action:
      "inline-flex min-h-9 items-center gap-1 rounded-full text-sm font-bold text-fg-accent no-underline " +
      "after:absolute after:inset-0 after:content-[''] focus-visible:outline-hidden group-data-[selected]:text-fg",
  },
});
const s = serviceCard();

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
   * The heading level of the name.
   * @default "h3"
   */
  titleAs?: "h2" | "h3" | "h4";
  /** Enters on scroll (MotionObserver): the index in the grid becomes the delay. */
  reveal?: number;
};

/** A service as a card: icon or photo, duration, price, what is included, the capacity, a tag — one way in. */
export function ServiceCard({
  name, price, priceFrom, duration, capacity, description, included, tag, icon, media, selected, actionLabel, href, linkAs, onSelect, titleAs: Title = "h3", reveal, className, style, ...props
}: ServiceCardProps) {
  const id = React.useId();
  const facts = [duration, capacity].filter(Boolean);
  const arrow = <span aria-hidden>→</span>;
  const revealStyle = reveal === undefined ? style : ({ ...style, "--kz-delay": `${Math.min(Math.max(reveal, 0), 8) * 50}ms` } as React.CSSProperties);
  return (
    <article
      aria-labelledby={id}
      data-selected={selected ? "" : undefined}
      data-reveal={reveal === undefined ? undefined : ""}
      style={revealStyle}
      className={s.root({ className })}
      {...props}
    >
      {media && <div className={s.media()}>{media}</div>}
      <div className={s.body()}>
        <div className={s.head()}>
          {icon && <span aria-hidden className={s.icon()}>{icon}</span>}
          <div className={s.titles()}>
            <Title id={id} className={s.name()}>{name}</Title>
            {facts.length > 0 && (
              <ul className={s.facts()}>
                {facts.map((fact, i) => (
                  <li key={i}>{i > 0 && <span aria-hidden>· </span>}{fact}</li>
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
            <span className={s.price()}>{price}</span>
          </p>
          {href ? (
            <BlockLink href={href} linkAs={linkAs} className={s.action()} aria-describedby={id}>
              {actionLabel} {arrow}
            </BlockLink>
          ) : onSelect ? (
            <button type="button" onClick={onSelect} aria-pressed={selected ?? false} aria-describedby={id} className={s.action()}>
              {actionLabel} {arrow}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
