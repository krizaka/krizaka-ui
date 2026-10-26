// Server-safe. The announcement of a chapter (story.css): “Step 02 · Payments”, or, large, a round with its title and a
// line under it. In a `Scene` of a `ScrollStage` it arrives once, after the scene's visual.
import type * as React from "react";

import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type StageBannerProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** Where the reader is: “Step 02”, “Chapter 3”, “Final round”. */
  stage: React.ReactNode;
  /** `sm`: the name of the chapter, beside the stage. */
  name?: React.ReactNode;
  /** `lg`: the title under the stage. */
  title?: React.ReactNode;
  /** `lg`: one line under the title. */
  subtitle?: React.ReactNode;
  /**
   * `sm`: one line, before a chapter's heading. `lg`: centred, the stage above a title and a line — a section's opening.
   * @default "sm"
   */
  size?: "sm" | "lg";
  /**
   * The element of the `lg` title: a heading when the banner opens a section that has none.
   * @default "p"
   */
  titleAs?: "p" | "h2" | "h3";
  /**
   * `default`: a sober eyebrow. `arcade`: the stage call — a skewed plate that slams in, a light that sweeps it.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`). */
  brand?: string;
};

/** Announces a chapter: a stage and its name on one line, or (`size="lg"`) a stage, a title and a line, centred. */
export function StageBanner({ stage, name, title, subtitle, size = "sm", titleAs: Title = "p", variant, brand, className, ...props }: StageBannerProps) {
  const cls = cn("kzs-banner", storyVariantClass(variant), brandClass(brand), className);
  if (size === "lg")
    return (
      <div data-size="lg" className={cls} {...props}>
        <span className="kzs-banner-stage">{stage}</span>
        {title && <Title className="kzs-banner-title">{title}</Title>}
        {subtitle && <p className="kzs-banner-sub">{subtitle}</p>}
      </div>
    );
  return (
    <p className={cls} {...props}>
      <span className="kzs-banner-stage">{stage}</span>
      {name && <span className="kzs-banner-name">{name}</span>}
      <span className="kzs-banner-sweep" aria-hidden />
    </p>
  );
}
