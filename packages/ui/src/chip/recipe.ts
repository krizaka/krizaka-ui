// The chip's parts and sizes, written once as classes of the Krizaka tokens: the web wears them with `tv(chipRecipe)`,
// React Native reads the same classes into styles (native/chip.tsx). `data-[state=on]:` is the chosen chip.
import { defineRecipe } from "../recipes/define";

export const chipRecipe = defineRecipe({
  slots: {
    group: "flex flex-wrap items-center gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
    base:
      "inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 " +
      "border-border-default bg-surface-1 text-fg-secondary hover:border-border-strong hover:text-fg " +
      "data-[state=on]:border-accent data-[state=on]:bg-accent-soft data-[state=on]:text-fg",
    remove:
      "-mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
  variants: {
    size: { sm: { base: "h-7 px-3 text-xs" }, md: { base: "h-9 px-3.5 text-xs" } },
  },
  defaultVariants: { size: "md" },
});
