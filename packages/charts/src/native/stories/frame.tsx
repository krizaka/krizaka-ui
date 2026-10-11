// Storybook only — neither exported nor built: the frame of the native chart stories, rendered by react-native-web.
// It follows the page's theme (`html.light`, toggled by the toolbar and the test-runner) and the toolbar's brand, so a
// native chart is audited and screenshot-compared in dark and light like a web one.
import { brands, themes } from "@krizaka/tokens/native";
import type { Decorator } from "@storybook/react-vite";
import { type ReactNode, useEffect, useState } from "react";
import { View } from "react-native";

import type { BrandId } from "../../core/types";
import { ChartsProvider } from "../frame";

const isLight = () => typeof document !== "undefined" && document.documentElement.classList.contains("light");

function Frame({ brand, children }: { brand: BrandId; children: ReactNode }) {
  const [light, setLight] = useState(isLight);
  useEffect(() => {
    const observer = new MutationObserver(() => setLight(isLight()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const scheme = light ? "light" : "dark";
  return (
    <ChartsProvider scheme={scheme} brand={brand} theme={brands[brand][scheme]}>
      <View style={{ backgroundColor: themes[scheme].surface0, padding: 16, width: 360 }}>{children}</View>
    </ChartsProvider>
  );
}

/** `decorators: [chartsNativeFrame]` in the meta of every native chart story. */
export const chartsNativeFrame: Decorator = (Story, { globals }) => (
  <Frame brand={String(globals.brand ?? "krizaka") as BrandId}>
    <Story />
  </Frame>
);
