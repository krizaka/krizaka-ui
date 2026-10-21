// The card's parts, radii, tones and paddings, written once as classes of the Krizaka tokens: the web wears them with
// `tv(cardRecipe)`, React Native reads the same classes into styles (native/card.tsx): a part of the card that exists only
// on the web (the hover's tint) is simply ignored there.
import { defineRecipe } from "../recipes/define";

export const cardRecipe = defineRecipe({
  slots: {
    root:
      "group relative flex flex-col overflow-hidden border border-border-default bg-surface-1 text-fg transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    media: "relative overflow-hidden bg-media",
    image: "h-full w-full object-cover",
    fallback: "flex h-full w-full items-center justify-center bg-linear-to-br from-accent/15 via-media to-accent-2/15 text-accent/60",
    overlay: "absolute z-10 flex items-center gap-1.5",
    body: "relative flex flex-1 flex-col gap-3",
    title: "line-clamp-1 text-sm font-semibold text-fg transition-colors group-hover:text-fg-accent",
    description: "line-clamp-2 text-xs text-fg-secondary",
    stat: "min-w-0",
    statLabel: "font-mono text-[11.5px] text-fg-secondary",
    statValue: "font-display text-xl font-black tabular-nums text-fg",
    footer: "relative mt-auto flex items-center gap-2 border-t border-border-subtle pt-3 text-xs text-fg-secondary",
  },
  variants: {
    radius: { md: { root: "rounded-md" }, lg: { root: "rounded-lg" }, xl: { root: "rounded-xl" } },
    tone: { default: {}, elevated: { root: "bg-surface-2 shadow-md" }, glass: { root: "bg-glass border-glass-border" } },
    interactive: { true: { root: "duration-150 hover:border-border-strong hover:bg-surface-2" } },
    padding: { none: { body: "p-0" }, sm: { body: "p-3" }, md: { body: "p-4" }, lg: { body: "p-6" } },
  },
  defaultVariants: { radius: "xl", tone: "default", padding: "md" },
});
