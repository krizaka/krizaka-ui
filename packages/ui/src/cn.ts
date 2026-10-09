import { type ClassValue, clsx } from "clsx";
import { cn as merge } from "tailwind-variants";

export type { ClassValue };

/**
 * Merges Tailwind classes: the last one wins — a product's `className` overrides the primitive's. The merge engine is
 * tailwind-merge as tailwind-variants ships it (the one `tv` uses), so the platform carries a single copy of it.
 */
export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs)) ?? "";
}
