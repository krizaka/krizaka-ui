import { type ClassValue, clsx } from "clsx";
import { cnMerge, type TWMergeConfig } from "tailwind-variants";

export type { ClassValue };

/**
 * The preset's own utilities, told to the merge engine: the material (BRAND.md §6: `bg-sheen`, `bg-fill-shade`,
 * `bg-halo` are background images; `shadow-raised` · `-floating` · `-overlay` · `-glow` are shadows; `inset-shadow-edge`
 * · `-edge-fill` · `-well` are inset shadows). Unknown, tailwind-merge would take `bg-sheen` for a colour and drop the
 * `bg-surface-2` it lies on.
 */
export const twMergeConfig: TWMergeConfig = {
  extend: {
    classGroups: {
      "bg-image": ["bg-sheen", "bg-fill-shade", "bg-halo"],
      shadow: ["shadow-raised", "shadow-floating", "shadow-overlay", "shadow-glow", "shadow-glow-lg"],
      "inset-shadow": ["inset-shadow-edge", "inset-shadow-edge-fill", "inset-shadow-well"],
    },
  },
};

/**
 * Merges Tailwind classes: the last one wins — a product's `className` overrides the primitive's. The merge engine is
 * tailwind-merge as tailwind-variants ships it (the one `tv` uses), so the platform carries a single copy of it.
 * tailwind-variants bundles that engine since 3.3 (it never imports the `tailwind-merge` package, an optional peer):
 * hence `tailwind-variants ^3.3.1` and no `tailwind-merge` dependency — `scripts/consumer.mjs` checks it on a clean
 * install of the packed package.
 */
export function cn(...inputs: ClassValue[]): string {
  return cnMerge(clsx(inputs))({ twMergeConfig }) ?? "";
}
