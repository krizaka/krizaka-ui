// Server-safe: no hook, no context. One `tv` definition with slots: each part takes its slot, and a product overrides
// any part through `className` (merged last by tailwind-merge).
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../cn";
import { cardRecipe } from "./recipe";

export const card = tv(cardRecipe);

type CardVariants = VariantProps<typeof card>;
/** The parts without a variant read the default slots: no context, so server-safe. */
const slots = card();

export type CardRootProps = React.ComponentProps<"div"> &
  Pick<CardVariants, "radius" | "tone" | "interactive"> & {
    /**
     * md · lg · xl.
     * @default "xl"
     */
    radius?: CardVariants["radius"];
    /**
     * default (the base surface) · elevated (raised, a shadow) · glass (translucent, blurred).
     * @default "default"
     */
    tone?: CardVariants["tone"];
    /** The spotlight that follows the pointer and the lift on hover: for a card that is a link. */
    interactive?: CardVariants["interactive"];
    /** Renders the child (a link, an article) instead of the <div>, with props, classes and ref merged. */
    asChild?: boolean;
    /** Enters on scroll (MotionObserver): the index in the grid becomes the delay (50 ms a step, 8 steps at most). */
    reveal?: number;
  };

export function CardRoot({ asChild, reveal, radius, tone, interactive, className, style, ...props }: CardRootProps) {
  const Comp = asChild ? Slot.Root : "div";
  const revealStyle =
    reveal === undefined ? style : ({ ...style, "--kz-delay": `${Math.min(Math.max(reveal, 0), 8) * 50}ms` } as React.CSSProperties);
  return (
    <Comp
      data-reveal={reveal === undefined ? undefined : ""}
      data-interactive={interactive ? "" : undefined}
      style={revealStyle}
      className={card({ radius, tone, interactive }).root({ className })}
      {...props}
    />
  );
}

const ASPECT = { video: "aspect-video", square: "aspect-square", portrait: "aspect-[3/4]", auto: "" } as const;
export type CardMediaProps = React.ComponentProps<"div"> & {
  /** The ratio of the media: video (16:9) · square · portrait (3:4) · auto (the content's). */
  aspect?: keyof typeof ASPECT;
};

export function CardMedia({ aspect = "video", className, ...props }: CardMediaProps) {
  return <div data-aspect={aspect} className={slots.media({ className: cn(ASPECT[aspect], className) })} {...props} />;
}

export type CardImageProps = Omit<React.ComponentProps<"img">, "src"> & {
  /** The image's URL; `null` or nothing shows the `fallback`. */
  src?: string | null;
  /** Shown when there is no image: an icon, an illustration (decorative). */
  fallback?: React.ReactNode;
  /**
   * When the browser loads it: `lazy` (default, a card in a list or below the fold) or `eager` for the first cards
   * of a page — the image that is the largest contentful paint must not wait (add `fetchPriority="high"`).
   * @default "lazy"
   */
  loading?: "lazy" | "eager";
};

/** The image of a media, or its `fallback` when there is none. `alt` is empty by default: the title names the card. */
export function CardImage({ src, alt = "", fallback, loading = "lazy", className, ...props }: CardImageProps) {
  if (!src) {
    return (
      <div data-fallback="" aria-hidden className={slots.fallback({ className })}>
        {fallback}
      </div>
    );
  }
  return <img src={src} alt={alt} loading={loading} decoding="async" className={slots.image({ className })} {...props} />;
}

const CORNER = {
  "top-left": "left-2.5 top-2.5",
  "top-right": "right-2.5 top-2.5",
  "bottom-left": "bottom-2.5 left-2.5",
  "bottom-right": "bottom-2.5 right-2.5",
} as const;
export type CardOverlayProps = React.ComponentProps<"div"> & {
  /** The corner of the media it sits in. */
  corner?: keyof typeof CORNER;
};

/** What sits on the media (badges, a caption). `scrim` and `fg-on-media` are invariant: nothing to do for light. */
export function CardOverlay({ corner = "top-left", className, ...props }: CardOverlayProps) {
  return <div data-corner={corner} className={slots.overlay({ className: cn(CORNER[corner], className) })} {...props} />;
}

export type CardBodyProps = React.ComponentProps<"div"> & {
  /**
   * none · sm · md · lg.
   * @default "md"
   */
  padding?: CardVariants["padding"];
};

export function CardBody({ padding, className, ...props }: CardBodyProps) {
  return <div className={card({ padding }).body({ className })} {...props} />;
}

export type CardTitleProps = React.ComponentProps<"h3"> & {
  /** The heading level, to fit the page's outline. */
  as?: "h2" | "h3" | "h4";
};

export function CardTitle({ as: Tag = "h3", className, ...props }: CardTitleProps) {
  return <Tag className={slots.title({ className })} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={slots.description({ className })} {...props} />;
}

export type CardStatProps = React.ComponentProps<"div"> & {
  /** What the figure is, in small capitals above it (the figure is the children). */
  label: React.ReactNode;
};

/** A figure put forward: the label in capitals, the value in tabular digits. */
export function CardStat({ label, className, children, ...props }: CardStatProps) {
  return (
    <div className={slots.stat({ className })} {...props}>
      <p className={slots.statLabel()}>{label}</p>
      <p className={slots.statValue()}>{children}</p>
    </div>
  );
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={slots.footer({ className })} {...props} />;
}

/** `Card.Root/Media/Image/Overlay/Body/Title/Description/Stat/Footer`. */
export const Card = {
  Root: CardRoot,
  Media: CardMedia,
  Image: CardImage,
  Overlay: CardOverlay,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Stat: CardStat,
  Footer: CardFooter,
};
