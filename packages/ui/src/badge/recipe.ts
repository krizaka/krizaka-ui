// The badge's tones and sizes, written once as classes of the Krizaka tokens: the web wears them with `tv(badgeRecipe)`,
// React Native reads the same classes into styles (native/badge.tsx). Status tones are soft (a tint, a coloured dot, a
// text role): the invariant status tokens are too light to carry small text on a light surface, or to sit under white
// text (WCAG AA).
import { defineRecipe } from "../recipes/define";

export const badgeRecipe = defineRecipe({
  base: "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm font-semibold ",
  variants: {
    tone: {
      neutral: "bg-surface-3 text-fg-secondary",
      accent: "bg-accent-soft text-fg ring-1 ring-inset ring-accent/40 [&>[data-dot]]:bg-accent",
      success: "bg-success/15 text-fg ring-1 ring-inset ring-success/40 [&>[data-dot]]:bg-success",
      warning: "bg-warning/15 text-fg ring-1 ring-inset ring-warning/40 [&>[data-dot]]:bg-warning",
      danger: "bg-danger/15 text-fg ring-1 ring-inset ring-danger/40 [&>[data-dot]]:bg-danger",
      /** On a media: veil and text invariant, identical in both themes. */
      scrim: "bg-scrim text-fg-on-media backdrop-blur-md",
    },
    size: { sm: "px-2 py-0.5 text-[10px]", md: "px-2.5 py-1 text-[11px]" },
    pulse: { true: "[&>[data-dot]]:motion-safe:animate-pulse" },
  },
  defaultVariants: { tone: "neutral", size: "sm" },
});
