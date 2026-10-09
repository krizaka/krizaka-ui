import { type ClassValue, clsx } from "clsx";
import { cn as merge } from "tailwind-variants";

export type { ClassValue };

/**
 * Merges Tailwind classes: the last one wins — a product's `className` overrides the primitive's. The merge engine is
 * tailwind-merge as tailwind-variants ships it (the one `tv` uses), so the platform carries a single copy of it.
 * tailwind-variants bundles that engine since 3.3 (it never imports the `tailwind-merge` package, an optional peer):
 * hence `tailwind-variants ^3.3.1` and no `tailwind-merge` dependency — `scripts/consumer.mjs` checks it on a clean
 * install of the packed package.
 */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs)) ?? "";
}
