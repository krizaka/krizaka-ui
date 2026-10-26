// Server-safe. A profile at a glance (story.css): a portrait, a name, one headline gauge, a few stats, a line — a creator,
// a match, a plan, a team member. In a `Scene` of a `ScrollStage` the card arrives and its gauges fill, once.
import type * as React from "react";

import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";
import { StatGauge } from "./stat-gauge";

export interface ProfileStat {
  /** What it measures (“Response rate”) — passed translated. */
  label: string;
  /** The value, between 0 and `max`. */
  value: number;
  /** The top of the range (default 100). */
  max?: number;
  /** The value in words (“92 %”, “4.8 / 5”); default: the percentage. */
  valueText?: string;
}

export type ProfileCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The portrait: an image, an avatar, a mark. Decorative — the name carries the meaning. */
  visual: React.ReactNode;
  /** The name (the card's heading). */
  name: React.ReactNode;
  /**
   * The level of the name.
   * @default "h3"
   */
  nameAs?: "h2" | "h3" | "h4" | "p";
  /** A small glyph before the name (decorative): a verified mark, an emblem. */
  icon?: React.ReactNode;
  /** The headline gauge's label (“Profile complete”, arcade “Power”); without it, no headline gauge. */
  statLabel?: string;
  /**
   * The headline gauge's value, 0–100.
   * @default 100
   */
  value?: number;
  /** The headline value in words; default: the percentage. */
  valueText?: string;
  /** What shows as the headline figure instead of `valueText`: a `NumberTicker` that climbs. Decorative. */
  figure?: React.ReactNode;
  /** More gauges under the headline one: two to four, each with its value in words. */
  stats?: readonly ProfileStat[];
  /** One line under the gauges: where they come from, what they do. */
  caption?: React.ReactNode;
  /** Under everything: actions (follow, message), chips. */
  children?: React.ReactNode;
  /**
   * The diameter of the portrait, in pixels.
   * @default 132 (arcade 196)
   */
  visualSize?: number;
  /**
   * `default`: a sober card. `arcade`: the fighter card — the brand's light, a ring and a breathing aura, a skewed gauge.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`): the accent and gradient become that brand's. */
  brand?: string;
};

/** A profile at a glance: portrait, name, a headline gauge, stats with their values in words, a line and actions. */
export function ProfileCard({
  visual,
  name,
  nameAs: Name = "h3",
  icon,
  statLabel,
  value = 100,
  valueText,
  figure,
  stats,
  caption,
  children,
  visualSize,
  variant,
  brand,
  className,
  style,
  ...props
}: ProfileCardProps) {
  return (
    <article
      className={cn("kzs-profile", storyVariantClass(variant), brandClass(brand), className)}
      style={visualSize ? ({ "--kzs-disc": `${visualSize}px`, ...style } as React.CSSProperties) : style}
      {...props}
    >
      <span className="kzs-texture" aria-hidden />
      <div className="kzs-profile-disc" aria-hidden>
        <span className="kzs-profile-ring" />
        <span className="kzs-profile-aura kzs-loop" />
        <span className="kzs-profile-flash" />
        <span className="kzs-profile-visual">{visual}</span>
      </div>
      <Name className="kzs-profile-name">
        {icon && <span aria-hidden>{icon}</span>}
        {name}
      </Name>
      {statLabel && <StatGauge label={statLabel} value={value} valueText={valueText} figure={figure} />}
      {stats && stats.length > 0 && (
        <ul className="kzs-profile-stats">
          {stats.map((s) => (
            <li key={s.label}>
              <StatGauge label={s.label} value={s.value} max={s.max} valueText={s.valueText} />
            </li>
          ))}
        </ul>
      )}
      {caption && <p className="kzs-profile-caption">{caption}</p>}
      {children && <div className="kzs-profile-extra">{children}</div>}
    </article>
  );
}
