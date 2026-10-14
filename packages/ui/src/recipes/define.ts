import type { TV } from "tailwind-variants";

/** What a recipe is made of: the `tv()` options — `base`, `slots`, `variants`, `defaultVariants`, `compoundVariants`. */
export type RecipeConfig = Parameters<TV>[0];

/**
 * A recipe is data: the variants of a component (a `variant`, a `size`, a `tone`…) as classes of the Krizaka tokens.
 * `defineRecipe` only keeps the literal types, so `tv(recipe)` is typed exactly as `tv({ … })` would be (the web side) and
 * `nativeRecipe(recipe)` reads the same classes into styles on the theme's roles (the native side, `./native`).
 *
 * Sizes are a variant dimension (`size: { sm: "h-8 px-3 text-xs" }`); states are the prefixes (`hover:`, `disabled:`,
 * `data-[state=on]:`). Write colours as roles (`bg-accent`, `text-fg-secondary`, `border-border-default`, `ring-accent/40`),
 * spacing as Tailwind units (`h-10`, `px-4`), type as `text-sm` / `text-[11px]` / `font-semibold`.
 */
export function defineRecipe<const C extends RecipeConfig>(config: C): C {
  return config;
}
