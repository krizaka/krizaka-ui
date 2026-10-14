/**
 * @krizaka/ui/recipes — `defineRecipe`: the variants of a component written once, as classes of the Krizaka tokens — the
 * web side is `tv(recipe)`, the native side `nativeRecipe(recipe).resolve(props, theme)`. Pure, server-safe.
 */
export { defineRecipe, type RecipeConfig } from "./define";
export { type NativeFrame, type NativeLook, type NativeRecipe, nativeRecipe, type NativeText, type ThemeColors, withAlpha } from "./native";
export { FONT_WEIGHTS, type RoleName, ROLES, TEXT_SIZES, TRACKING } from "./roles";
