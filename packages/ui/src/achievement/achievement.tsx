// Server-safe. Something done, and what it replaced (story.css): a milestone reached, a dare completed, a problem out of
// the way. A list of them shares one grid of hairlines; in a `Scene` of a `ScrollStage` their badges arrive one by one.
import * as React from "react";

import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type AchievementProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** What was achieved: the outcome, in a few words. */
  title: React.ReactNode;
  /** A small line above: its number, its kind (“Milestone 03”). */
  eyebrow?: React.ReactNode;
  /** A glyph before the eyebrow (an `Emblem`, an icon). Decorative. */
  icon?: React.ReactNode;
  /** The badge in the corner (“Done”, “Unlocked”, arcade “Sealed”). */
  badge?: React.ReactNode;
  /** What it replaced or overcame, struck through above the title (“Paying 30 % to a platform”). */
  replaced?: React.ReactNode;
  /** Not reached yet: muted, its badge neutral. Say it in the badge too (“Locked”). */
  locked?: boolean;
  /**
   * `default`: a calm badge. `arcade`: a mono stamp that slams onto the card.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`). */
  brand?: string;
};

/** Something done: an eyebrow, a badge, what it replaced (struck through) and the outcome. */
export function Achievement({ title, eyebrow, icon, badge, replaced, locked, variant, brand, className, ...props }: AchievementProps) {
  return (
    <div data-locked={locked ? "" : undefined} className={cn("kzs-achievement", storyVariantClass(variant), brandClass(brand), className)} {...props}>
      {(eyebrow || badge || icon) && (
        <div className="kzs-achievement-head">
          <span className="kzs-achievement-eyebrow">
            {icon && <span aria-hidden>{icon}</span>}
            {eyebrow}
          </span>
          {badge && <span className="kzs-achievement-badge">{badge}</span>}
        </div>
      )}
      {replaced && (
        <del className="kzs-achievement-replaced" style={{ textDecorationLine: "line-through" }}>
          {replaced}
        </del>
      )}
      <p className="kzs-achievement-title">{title}</p>
    </div>
  );
}

export type AchievementListProps = React.OlHTMLAttributes<HTMLOListElement> & {
  /** The `Achievement`s, in order: each one becomes an item of the list (its badge arrives after the previous one's). */
  children: React.ReactNode;
  /**
   * The narrowest a card gets before the grid drops a column.
   * @default "220px"
   */
  minWidth?: string;
  /** The look of every card: `default` or `arcade`. */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`). */
  brand?: string;
};

/** An ordered list of `Achievement`s on one grid of hairlines. */
export function AchievementList({ children, minWidth, variant, brand, className, style, ...props }: AchievementListProps) {
  const items = React.Children.toArray(children);
  return (
    <ol
      className={cn("kzs-achievements", storyVariantClass(variant), brandClass(brand), className)}
      style={minWidth ? ({ "--kzs-min": minWidth, ...style } as React.CSSProperties) : style}
      {...props}
    >
      {items.map((child, i) => (
        <li key={React.isValidElement(child) && child.key != null ? child.key : i} style={{ "--i": i } as React.CSSProperties}>
          {child}
        </li>
      ))}
    </ol>
  );
}

export type EmblemProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  /** The emblem: `sword` (courage, the first step), `mirror` (clarity, honesty), `jewel` (care, what is kept). */
  kind: "sword" | "mirror" | "jewel";
  /**
   * Width and height in pixels.
   * @default 20
   */
  size?: number;
};

/** Three line emblems for achievements and choices (`currentColor`, decorative). */
export function Emblem({ kind, size = 20, ...props }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {kind === "sword" && (
        <>
          <path d="M24 3 L27 28 L24 36 L21 28 Z" />
          <path d="M15 30 H33 M24 36 V45" />
        </>
      )}
      {kind === "mirror" && (
        <>
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="9" />
          <path d="M24 2 V6 M24 42 V46 M2 24 H6 M42 24 H46" />
        </>
      )}
      {kind === "jewel" && (
        <>
          <path d="M31 10 a13 13 0 1 1 -15 19 a8 8 0 0 0 8 -9 a8 8 0 0 1 7 -10 Z" />
          <circle cx="29" cy="17" r="2.6" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
