/* The live kit of the home's first screen: real components under the real token classes of @krizaka/tokens. An identity
   is a brand class (`.brand-<id>`; Krizaka is the default and has none) and the theme a scoped class (`.theme-dark` /
   `.theme-light`), so the code line under the kit is exactly what a product writes. No imports: the tests run this file
   with Node's type stripping. */

/** The identities the kit offers: the default first, then the products the home's scene draws (lib/home-scene.ts). */
export const KIT_IDENTITIES = ["krizaka", "orazaka", "orochia", "yomizaka"] as const;
export type KitIdentity = (typeof KIT_IDENTITIES)[number];
export const KIT_THEMES = ["dark", "light"] as const;
export type KitTheme = (typeof KIT_THEMES)[number];

/** The classes a subtree wears to look like `id` in `theme`. */
export function kitScope(id: KitIdentity, theme: KitTheme): string {
  return [id === "krizaka" ? null : `brand-${id}`, `theme-${theme}`].filter(Boolean).join(" ");
}
