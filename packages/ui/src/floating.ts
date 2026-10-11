// The one surface of everything that floats next to its trigger (popover, menu, tooltip, the lists of the fields):
// frosted glass with its edge light on the floating ink shadow (BRAND.md §6), and the `kz-pop` entrance from the side
// Radix measured (`--radix-*-transform-origin`).
export const floating = "kz-pop z-50 rounded-xl border glass text-fg shadow-floating inset-shadow-edge outline-hidden";

// An option, a menu item, a suggestion that is highlighted (keyboard or pointer): a tint of the accent and a rail of
// light on its left edge. Pair with the state's variant: `data-highlighted:` (Radix), `data-[active]:` (listbox),
// `data-[selected=true]:` (cmdk) — see `highlighted`.
export const rail =
  "relative before:pointer-events-none before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent " +
  "before:opacity-0 before:shadow-[0_0_8px_var(--kz-accent)] before:transition-opacity before:duration-(--kz-duration-fast)";
