// The platform's `tv` and merge: tailwind-variants' engine taught the Krizaka material (BRAND.md §6), so that a
// signature class is merged with the right group — `bg-sheen` is a background image (it must not drop `bg-surface-2`),
// `shadow-raised` a shadow (a product's `shadow-none` replaces it), `inset-shadow-edge` an inset shadow.
import { cnMerge, createTV, type TWMConfig } from "tailwind-variants";

/** The Krizaka utilities of `@krizaka/tailwind`, as tailwind-merge class groups — for a product's own `twMerge`. */
export const twMergeConfig = {
  extend: {
    classGroups: {
      "bg-image": [{ bg: ["sheen", "fill-shade", "halo"] }],
      shadow: [{ shadow: ["raised", "floating", "overlay", "glow", "glow-lg"] }],
      "inset-shadow": [{ "inset-shadow": ["edge", "edge-fill", "well"] }],
      "kz-glass": ["glass"],
      "kz-focus": ["focus-ring", "focus-ring-inset"],
      "kz-node": ["node"],
      "kz-node-lit": ["node-lit"],
    },
  },
} satisfies NonNullable<TWMConfig["twMergeConfig"]>;

/** `tv` with the platform's merge: every primitive builds its variants with it. */
export const tv = createTV({ twMergeConfig });

/** Merges class strings with the platform's merge (the last one wins). */
export function merge(classes: string): string {
  return cnMerge(classes)({ twMergeConfig }) ?? "";
}
