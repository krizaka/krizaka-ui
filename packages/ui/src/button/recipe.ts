// The button's variants, written once as classes of the Krizaka tokens: the web wears them with `tv(buttonRecipe)`
// (button.tsx), React Native reads the same classes into styles (native/button.tsx, `nativeRecipe`).
import { defineRecipe } from "../recipes/define";

export const buttonRecipe = defineRecipe({
  base:
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
    "disabled:pointer-events-none disabled:opacity-40 data-loading:cursor-progress active:scale-[0.98] " +
    // Busy is not unavailable: a loading button keeps its colour (it is disabled only so it is not pressed twice).
    "[&[data-loading]]:opacity-100",
  variants: {
    variant: {
      primary: "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
      // The brand's signature: accent → accent-2 (on-accent reads on both stops, tested in @krizaka/tokens).
      gradient: "bg-linear-to-r from-accent to-accent-2 text-on-accent shadow-sm hover:brightness-110",
      secondary: "border border-border-default bg-surface-2 text-fg hover:border-border-strong hover:bg-surface-3",
      outline: "border border-border-default bg-transparent text-fg hover:border-accent hover:text-fg-accent",
      ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
      // The border and the tint carry the danger; the label stays the primary text role, legible on the tint at rest
      // and hovered over every surface (`text-fg-danger` is for text set directly on a surface).
      danger: "border border-danger/50 bg-danger/10 text-fg hover:border-danger hover:bg-danger/20",
    },
    size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-sm", icon: "h-10 w-10" },
    // `cut`: the Krizaka chamfer — 45° corners (CSS corner-shape, where supported; rounded elsewhere). The border, the
    // focus ring and the hover follow the cut, unlike a clip-path.
    shape: { rounded: "rounded-lg", pill: "rounded-full", cut: "rounded-[10px] [corner-shape:bevel]" },
  },
  defaultVariants: { variant: "secondary", size: "md", shape: "rounded" },
});
