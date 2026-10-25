"use client";

import { AppearanceSettings, type ThemeCardOption } from "@krizaka/ui/account-settings";
import * as React from "react";

const dark = { surface0: "#111318", surface1: "#171a21", surface2: "#1e222b", text: "#e8ebf1", muted: "#959eae" };
const light = { surface0: "#fbfbfa", surface1: "#ffffff", surface2: "#f4f4f2", text: "#242c3d", muted: "#646d80" };
// In an app these come from `appearance.themes` of @krizaka/tokens; the product passes the subset it offers.
const THEMES: ThemeCardOption[] = [
  { id: "system", label: "System", description: "Follows your device", preview: null, halves: [light, dark] },
  { id: "light", label: "Light", preview: light },
  { id: "dark", label: "Dark", preview: dark },
  { id: "blueprint", label: "Blueprint", description: "Navy", preview: { surface0: "hsl(222 40% 9%)", surface1: "hsl(222 38% 12%)", surface2: "hsl(222 36% 15%)", text: "hsl(215 40% 93%)", muted: "hsl(215 18% 69%)" } },
];

// Applied at once, nothing to save: `useAppearance()` of @krizaka/ui/theme does it in a real app.
export default function AppearanceExample() {
  const [theme, setTheme] = React.useState("system");
  const [accent, setAccent] = React.useState("akinaza");
  const [density, setDensity] = React.useState("standard");
  const [language, setLanguage] = React.useState("en");
  return (
    <AppearanceSettings
      themes={THEMES} theme={theme} onThemeChange={setTheme}
      accents={[{ id: "akinaza", label: "Forest green", color: "#4fa04f" }, { id: "krizaka", label: "Steel blue", color: "#3f78ab" }]} accent={accent} onAccentChange={setAccent}
      densities={[{ value: "standard", label: "Standard" }, { value: "compact", label: "Compact" }]} density={density} onDensityChange={setDensity}
      languages={[{ code: "en", name: "English" }, { code: "fr", name: "Français" }]} language={language} onLanguageChange={setLanguage}
    />
  );
}
