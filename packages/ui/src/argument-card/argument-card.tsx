// Server-safe. A card that argues (blocks.css), compact: who (icon, name, facts) → the trap in one line → the way in.
// The long version — what it does, the rule a bird stands for, the reasons — waits in a panel the reader opens (a
// native <details>: keyboard, screen readers, no script). Cards of a row share their height; the panel and the foot
// sit at the bottom, at the same place on every card.
import type * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import { ArrowGlyph, ChevronGlyph } from "../glyphs";
import { type CardHover, cardHoverClass } from "../link-card/link-card";
import { type Fact, Facts } from "../page/page";

export type ArgumentCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The id of the title: the card's accessible name. */
  id: string;
  /** The title: the subject (a building block, a feature, a plan). */
  title: React.ReactNode;
  /** The icon tile (a signature icon): decorative. */
  icon?: React.ReactNode;
  /** A mono line under the title (a repository, a package). */
  meta?: React.ReactNode;
  /** Small, in the top corner: the bird whose rule it is (a `Mascot` of 40 px, still). Decorative. */
  mark?: React.ReactNode;
  /** Compact facts under the line: registry and version, a status said honestly. */
  facts?: readonly Fact[];
  /**
   * The problem in ONE line (≤ 90 characters): what a reader keeps if they read nothing else. `label` (`The trap`) is
   * read by assistive technology before it, not shown.
   */
  hook: { label: React.ReactNode; text: React.ReactNode };
  /** Unfolded only: what it does, as a few short points, with their label (`What it does`). */
  points?: { label: React.ReactNode; items: readonly React.ReactNode[] };
  /** Unfolded only: the rule told by a bird (a `MascotQuote`, `variant="inline"`). */
  rule?: React.ReactNode;
  /** Unfolded only: the long version, as labelled paragraphs. */
  details?: readonly { label: React.ReactNode; text: React.ReactNode }[];
  /**
   * Without a detail page: the words that unfold the card in place (`Details`) — a native `<details>` holding the
   * points, the rule and the long version. Ignored with `more`: the detail page holds them.
   */
  panelLabel?: React.ReactNode;
  /** The way in: a detail page — one short action at the foot (`Details`). With it, the card is only its face. */
  more?: { href: string; label: React.ReactNode };
  /** Discreet secondary actions at the foot, on the right (an `ActionBar` with `variant="icons"`). */
  actions?: React.ReactNode;
  /**
   * The title's level.
   * @default 3
   */
  level?: 2 | 3 | 4;
  /** The app's link component for internal addresses (Next's `Link`); an `<a>` otherwise. */
  linkAs?: LinkComponent;
  /** The hover of the card: `light` (the pointer's light, the default) or `quiet` (no glow, a lift, a ring on focus). */
  hover?: CardHover;
};

/**
 * A card that argues, compact (about a third of a full card): who (icon, name, meta; the bird small in the corner) →
 * the problem in one line → compact facts → one short action. What it does, the bird's rule and the long version are
 * never on the face: they live on the detail page (`more`) or in the card unfolded in place (`panelLabel`).
 */
export function ArgumentCard({ id, title, icon, meta, mark, facts, hook, points, rule, details, panelLabel, more, actions, level = 3, linkAs, hover, className, ...props }: ArgumentCardProps) {
  const H = `h${level}` as "h2" | "h3" | "h4";
  const fold = !more && panelLabel && (points || rule || (details && details.length > 0));
  return (
    <article className={cn("kz-block-card kz-arg", cardHoverClass(hover), className)} data-kz-light="" aria-labelledby={id} {...props}>
      <div className="kz-arg-head">
        {icon && (
          <span className="kz-block-icon" aria-hidden>
            {icon}
          </span>
        )}
        <div className="kz-arg-id">
          <H id={id} className="kz-arg-title">
            {title}
          </H>
          {meta && <p className="kz-arg-meta">{meta}</p>}
        </div>
        {mark && (
          <span className="kz-arg-mark" aria-hidden>
            {mark}
          </span>
        )}
      </div>
      <p className="kz-arg-line">
        <span className="kz-sr-only">{hook.label} — </span>
        {hook.text}
      </p>
      {facts && facts.length > 0 && <Facts items={facts} />}
      {fold && (
        <details className="kz-arg-panel">
          <summary>
            {panelLabel} <ChevronGlyph className="h-3.5 w-3.5" />
          </summary>
          <div className="kz-arg-panel-body">
            {points && (
              <div>
                <p className="kz-label">{points.label}</p>
                <ul className="kz-list">
                  {points.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {details && details.length > 0 && (
              <dl>
                {details.map((d, i) => (
                  <div key={i}>
                    <dt className="kz-label">{d.label}</dt>
                    <dd>{d.text}</dd>
                  </div>
                ))}
              </dl>
            )}
            {rule}
          </div>
        </details>
      )}
      {(more || actions) && (
        <div className="kz-arg-foot">
          {more ? (
            <BlockLink href={more.href} linkAs={linkAs} className="kz-arg-more" aria-describedby={id}>
              {more.label} <ArrowGlyph className="h-3.5 w-3.5" />
            </BlockLink>
          ) : (
            <span />
          )}
          {actions}
        </div>
      )}
    </article>
  );
}
