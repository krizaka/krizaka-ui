// Server-safe: no hook, no context. One `tv` definition with slots: each part takes its slot, and a product overrides
// any part through `className` (merged last by tailwind-merge).
import { Slot } from "radix-ui";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { cn } from "../cn";
import { tv } from "../tv";

const LOOK = {
  default: "border-border-default bg-surface-1 bg-sheen shadow-raised inset-shadow-edge",
  elevated: "border-border-subtle bg-surface-2 bg-sheen shadow-floating inset-shadow-edge",
  glass: "glass shadow-floating inset-shadow-edge",
} as const;

export const card = tv({
  slots: {
    root:
      "group relative flex flex-col overflow-hidden border text-fg " +
      "transition-[border-color,box-shadow,background-color,translate,scale] duration-(--kz-duration-fast) focus-visible:focus-ring",
    media: "relative overflow-hidden bg-media",
    image: "h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105",
    fallback: "flex h-full w-full items-center justify-center bg-linear-to-br from-accent/15 via-media to-accent-2/15 text-accent/60",
    overlay: "absolute z-10 flex items-center gap-1.5",
    body: "relative flex flex-1 flex-col gap-3",
    title: "line-clamp-1 text-sm font-semibold tracking-[-0.006em] text-fg transition-colors group-hover:text-fg-accent",
    description: "line-clamp-2 text-xs text-fg-secondary",
    stat: "min-w-0",
    statLabel: "font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-fg-secondary",
    statValue: "font-display text-xl font-extrabold tracking-[-0.02em] tabular-nums text-fg",
    footer: "relative mt-auto flex items-center gap-2 border-t border-border-subtle pt-3 text-xs text-fg-secondary",
  },
  variants: {
    radius: { md: { root: "rounded-md" }, lg: { root: "rounded-lg" }, xl: { root: "rounded-xl" } },
    // The material (BRAND.md §6): a raised surface catches the light on its top edge and sits on an ink shadow.
    variant: {
      default: { root: LOOK.default },
      elevated: { root: LOOK.elevated },
      glass: { root: LOOK.glass },
      outline: { root: "border-border-default bg-transparent" },
      // The one card a section is about: a halo of the brand from the top, a hairline of light along its top edge.
      spotlight: {
        root:
          // …and the griffe: its top-right corner cut (`--kz-cut-shape`).
          "border-border-default bg-surface-1 bg-halo shadow-floating inset-shadow-edge rounded-tr-[22px] [corner-top-right-shape:var(--kz-cut-shape)] " +
          "after:pointer-events-none after:absolute after:inset-x-8 after:top-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-accent after:to-transparent",
      },
    },
    /** @deprecated The 2.x name of `variant` (default · elevated · glass). */
    tone: { default: { root: LOOK.default }, elevated: { root: LOOK.elevated }, glass: { root: LOOK.glass } },
    // The Krizaka chamfer on one corner (CSS corner-shape, where supported; rounded elsewhere).
    cut: { true: { root: "[corner-top-right-shape:bevel] rounded-tr-[22px]" } },
    interactive: { true: { root: "kz-spotlight kz-lift hover:border-accent/50 active:scale-[0.995]" } },
    padding: { none: { body: "p-0" }, sm: { body: "p-3" }, md: { body: "p-4" }, lg: { body: "p-6" } },
  },
  defaultVariants: { radius: "xl", variant: "default", padding: "md" },
});

type CardVariants = VariantProps<typeof card>;
/** The parts without a variant read the default slots: no context, so server-safe. */
const slots = card();

export type CardRootProps = React.ComponentProps<"div"> &
  Pick<CardVariants, "radius" | "variant" | "cut" | "interactive"> & {
    /**
     * md · lg · xl.
     * @default "xl"
     */
    radius?: CardVariants["radius"];
    /**
     * default (a raised surface: sheen, edge light, ink shadow) · elevated (higher, a floating shadow) · glass (frosted,
     * for a card over a media or a backdrop) · outline (a frame, no material) · spotlight (a halo of the brand from the
     * top: the one card a section is about).
     * @default "default"
     */
    variant?: CardVariants["variant"];
    /**
     * The former name of `variant` (default · elevated · glass), kept for 2.x; `variant` wins when both are given.
     * @deprecated Use `variant`.
     */
    tone?: "default" | "elevated" | "glass";
    /** The Krizaka chamfer: the top-right corner cut at 45°. */
    cut?: boolean;
    /** The spotlight that follows the pointer and the lift on hover: for a card that is a link. */
    interactive?: CardVariants["interactive"];
    /** Renders the child (a link, an article) instead of the <div>, with props, classes and ref merged. */
    asChild?: boolean;
    /** Enters on scroll (MotionObserver): the index in the grid becomes the delay (50 ms a step, 8 steps at most). */
    reveal?: number;
  };

export function CardRoot({ asChild, reveal, radius, variant, tone, cut, interactive, className, style, ...props }: CardRootProps) {
  const look = variant ?? tone ?? "default";
  const Comp = asChild ? Slot.Root : "div";
  const revealStyle =
    reveal === undefined ? style : ({ ...style, "--kz-delay": `${Math.min(Math.max(reveal, 0), 8) * 50}ms` } as React.CSSProperties);
  return (
    <Comp
      data-reveal={reveal === undefined ? undefined : ""}
      data-interactive={interactive ? "" : undefined}
      data-variant={look}
      style={revealStyle}
      className={card({ radius, variant: look, cut, interactive }).root({ className })}
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
