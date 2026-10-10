import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Theme",
  summary: "Dark, light or the system's: `ThemeProvider`, `ThemeScript` against the flash, and `ThemeToggle`.",
  status: "stable",
  category: "foundations",
  platforms: "both",
  whenToUse: [
    "Once per app, in the root layout: `ThemeScript` in `<head>`, `ThemeProvider` around the app.",
    "`ThemeToggle` in the header or the settings, to cycle dark → light → system.",
    "`useTheme()` to read or set the mode from your own control.",
  ],
  whenNotToUse: [
    { when: "To theme one area differently: put `.theme-light` or `.theme-dark` on the subtree instead." },
    { when: "To change a product's colours: override the `--kz-*` tokens in its design system." },
  ],
  bestPractices: [
    "Put `<ThemeScript />` in `<head>` and `suppressHydrationWarning` on `<html>`: the right theme is applied before the first paint.",
    "The choice is persisted as `kz-theme` and applied as `html.light`: every Krizaka app reads the same switch.",
    "Check every screen in both themes.",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "The toggle cycles to the next mode." }],
    notes: ["`ThemeToggle` is a button named by `label` (translated); its icon shows the current mode.", "`color-scheme` follows the theme, so native controls and scrollbars match."],
  },
  related: ["button", "cn"],
  web: {
    imports: ["ThemeProvider", "ThemeScript", "ThemeToggle", "useTheme"],
    examples: [
      { name: "toggle", title: "Toggle", description: "A ghost icon button in its provider." },
      { name: "secondary", title: "Another look", description: "Any button variant and shape." },
    ],
  },
  native: {
    imports: ["ThemeProvider", "useTheme"],
    differences: [
      "`ThemeProvider` takes the product's colour roles (`overrides`) and fonts; there is no `ThemeScript` and no toggle.",
      "`useTheme()` returns the resolved `theme` (colour roles), `scheme`, `radius` and `motion` for `StyleSheet`.",
      "The mode is not persisted: the app stores it from `onModeChange`.",
    ],
    examples: [{ name: "provider", title: "Provider", description: "Once at the root; `useTheme()` reads the roles in any component." }],
  },
} satisfies ComponentMeta;
