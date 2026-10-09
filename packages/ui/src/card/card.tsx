// Server-safe: no hook, no context. One `tv` definition with slots: each part takes its slot, and a product overrides
// any part through `className` (merged last by tailwind-merge).
import { Slot } from "radix-ui";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "../cn";

export const card = tv({
  slots: {
    root:
      "group relative flex flex-col overflow-hidden border border-border-default bg-surface-1 text-fg transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    media: "relative overflow-hidden bg-media",
    image: "h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105",
    fallback: "flex h-full w-full items-center justify-center bg-linear-to-br from-accent/15 via-media to-accent-2/15 text-accent/60",
    overlay: "absolute z-10 flex items-center gap-1.5",
    body: "relative flex flex-1 flex-col gap-3",
    title: "line-clamp-1 text-sm font-semibold text-fg transition-colors group-hover:text-accent",
    description: "line-clamp-2 text-xs text-fg-secondary",
    stat: "min-w-0",
    statLabel: "text-[10px] font-semibold uppercase tracking-wider text-fg-secondary",
    statValue: "font-display text-xl font-black tabular-nums text-fg",
    footer: "relative mt-auto flex items-center gap-2 border-t border-border-subtle pt-3 text-xs text-fg-secondary",
  },
  variants: {
    radius: { md: { root: "rounded-md" }, lg: { root: "rounded-lg" }, xl: { root: "rounded-xl" } },
    tone: { default: {}, elevated: { root: "bg-surface-2 shadow-md" }, glass: { root: "bg-surface-1/70 backdrop-blur-md" } },
    interactive: { true: { root: "kz-spotlight kz-lift hover:border-accent/50" } },
    padding: { none: { body: "p-0" }, sm: { body: "p-3" }, md: { body: "p-4" }, lg: { body: "p-6" } },
  },
  defaultVariants: { radius: "xl", tone: "default", padding: "md" },
});

type CardVariants = VariantProps<typeof card>;
/** The parts without a variant read the default slots: no context, so server-safe. */
const slots = card();

export type CardRootProps = React.ComponentProps<"div"> &
  Pick<CardVariants, "radius" | "tone" | "interactive"> & {
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
export type CardMediaProps = React.ComponentProps<"div"> & { aspect?: keyof typeof ASPECT };

export function CardMedia({ aspect = "video", className, ...props }: CardMediaProps) {
  return <div data-aspect={aspect} className={slots.media({ className: cn(ASPECT[aspect], className) })} {...props} />;
}

export type CardImageProps = Omit<React.ComponentProps<"img">, "src"> & {
  src?: string | null;
  /** Shown when there is no image: an icon, an illustration (decorative). */
  fallback?: React.ReactNode;
};

/** The image of a media, or its `fallback` when there is none. `alt` is empty by default: the title names the card. */
export function CardImage({ src, alt = "", fallback, className, ...props }: CardImageProps) {
  if (!src) {
    return (
      <div data-fallback="" aria-hidden className={slots.fallback({ className })}>
        {fallback}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={slots.image({ className })} {...props} />;
}

const CORNER = {
  "top-left": "left-2.5 top-2.5",
  "top-right": "right-2.5 top-2.5",
  "bottom-left": "bottom-2.5 left-2.5",
  "bottom-right": "bottom-2.5 right-2.5",
} as const;
export type CardOverlayProps = React.ComponentProps<"div"> & { corner?: keyof typeof CORNER };

/** What sits on the media (badges, a caption). `scrim` and `fg-on-media` are invariant: nothing to do for light. */
export function CardOverlay({ corner = "top-left", className, ...props }: CardOverlayProps) {
  return <div data-corner={corner} className={slots.overlay({ className: cn(CORNER[corner], className) })} {...props} />;
}

export type CardBodyProps = React.ComponentProps<"div"> & Pick<CardVariants, "padding">;

export function CardBody({ padding, className, ...props }: CardBodyProps) {
  return <div className={card({ padding }).body({ className })} {...props} />;
}

export type CardTitleProps = React.ComponentProps<"h3"> & { as?: "h2" | "h3" | "h4" };

export function CardTitle({ as: Tag = "h3", className, ...props }: CardTitleProps) {
  return <Tag className={slots.title({ className })} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={slots.description({ className })} {...props} />;
}

export type CardStatProps = React.ComponentProps<"div"> & { label: React.ReactNode };

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
