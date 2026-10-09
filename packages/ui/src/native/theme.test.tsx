import { describe, expect, test } from "@jest/globals";
import type { Theme as TokenTheme } from "@krizaka/tokens/native";
import { themes } from "@krizaka/tokens/native";
import { act, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { alpha, type Theme, ThemeProvider, useTheme } from "./theme";

// The declared types stand for the tokens' own, both ways (a role added to @krizaka/tokens fails here).
const forward: Theme = themes.dark satisfies TokenTheme;
const backward: TokenTheme = forward;

function Probe() {
  const { mode, scheme, theme, setMode } = useTheme();
  return (
    <Text accessibilityRole="button" onPress={() => setMode("light")}>
      {`${mode}|${scheme}|${theme.accent}|${theme.surface0}`}
    </Text>
  );
}

describe("ThemeProvider", () => {
  test("the declared roles are the tokens' roles", () => {
    expect(Object.keys(backward).sort()).toEqual(Object.keys(themes.light).sort());
  });

  test("without a provider, follows the system with the platform's roles", async () => {
    await render(<Probe />);
    expect(screen.getByText(/^system\|/)).toBeOnTheScreen();
  });

  test("a mode picks its theme, overrides apply per theme", async () => {
    await render(
      <ThemeProvider mode="light" overrides={{ light: { accent: "#7c3aed" }, dark: { accent: "#8b5cf6" } }}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText(`light|light|#7c3aed|${themes.light.surface0}`)).toBeOnTheScreen();
  });

  test("uncontrolled: setMode switches and reports the change", async () => {
    const changes: string[] = [];
    await render(
      <ThemeProvider defaultMode="dark" onModeChange={(m) => changes.push(m)}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByText(`dark|dark|${themes.dark.accent}|${themes.dark.surface0}`)).toBeOnTheScreen();
    await act(async () => screen.getByRole("button").props.onPress());
    expect(screen.getByText(`light|light|${themes.light.accent}|${themes.light.surface0}`)).toBeOnTheScreen();
    expect(changes).toEqual(["light"]);
  });

  test("alpha tints a hex role and leaves the rest", () => {
    expect(alpha("#ef4343", 0.15)).toBe("rgba(239,67,67,0.15)");
    expect(alpha("rgba(0,0,0,0.6)", 0.5)).toBe("rgba(0,0,0,0.6)");
  });
});
