// Storybook only — neither exported nor built: the frame of the native stories, rendered by react-native-web in the
// web catalogue. It follows the page's theme (`html.light`, toggled by the toolbar and by the test-runner) and the
// toolbar's brand, so a native story is audited and screenshot-compared in dark and light like a web one.
import type { Decorator } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { type ThemeOverrides, ThemeProvider, useTheme } from "./theme";

// The demonstration identities of apps/storybook/.storybook/storybook.css, as native overrides.
const BRANDS: Record<string, ThemeOverrides> = {
  orochia: {
    dark: { accent: "#8b5cf6", accentHover: "#7c3aed", accentSoft: "rgba(139,92,246,0.12)", accent2: "#ec4899", ring: "#a78bfa" },
    light: { accent: "#7c3aed", accentHover: "#6d28d9", accentSoft: "rgba(124,58,237,0.08)", accent2: "#db2777", ring: "#a78bfa" },
  },
  orazaka: { dark: { accent: "#3b83f7" }, light: { accent: "#3b83f7" } },
};

const isLight = () => typeof document !== "undefined" && document.documentElement.classList.contains("light");

function usePageScheme(): "dark" | "light" {
  const [light, setLight] = React.useState(isLight);
  React.useEffect(() => {
    const observer = new MutationObserver(() => setLight(isLight()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return light ? "light" : "dark";
}

function Surface({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return <View style={{ backgroundColor: theme.surface0, padding: 16, gap: 12, alignItems: "flex-start" }}>{children}</View>;
}

function Frame({ brand, children }: { brand: string; children: React.ReactNode }) {
  const scheme = usePageScheme();
  return (
    <ThemeProvider mode={scheme} overrides={BRANDS[brand]}>
      <Surface>{children}</Surface>
    </ThemeProvider>
  );
}

/** `decorators: [nativeFrame]` in the meta of every `src/native/*.stories.tsx`. */
export const nativeFrame: Decorator = (Story, { globals }) => (
  <Frame brand={String(globals.brand ?? "krizaka")}>
    <Story />
  </Frame>
);
