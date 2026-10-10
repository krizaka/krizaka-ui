// Storybook only — neither exported nor built: the frame of the native stories, rendered by react-native-web in the
// web catalogue. It follows the page's theme (`html.light`, toggled by the toolbar and by the test-runner) and the
// toolbar's brand, so a native story is audited and screenshot-compared in dark and light like a web one.
import { brands } from "@krizaka/tokens/native";
import type { Decorator } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { type ThemeOverrides, ThemeProvider, useTheme } from "./theme";

// The brand themes of @krizaka/tokens/native (`brands.<id>`): the same values the products pass to their provider.
const BRANDS: Record<string, ThemeOverrides> = brands;

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
