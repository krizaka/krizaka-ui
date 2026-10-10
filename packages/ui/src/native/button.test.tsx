import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { Button, IconButton } from "./button";
import { ThemeProvider } from "./theme";

// The gradient's stops as plain views, so the test reads their colours.
jest.mock("react-native-svg", () => {
  const actual = jest.requireActual<Record<string, unknown>>("react-native-svg");
  const { createElement } = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return { __esModule: true, ...actual, Stop: (props: { stopColor: string }) => createElement(View, { testID: "gradient-stop", ...props }) };
});

describe("Button", () => {
  test("a button named by its label; onPress fires", async () => {
    const onPress = jest.fn();
    await render(<Button label="Continue" variant="primary" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Continue" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("loading: busy, disabled, a spinner in place of the icon", async () => {
    const onPress = jest.fn();
    await render(<Button label="Saving" loading icon={<Text>icon</Text>} onPress={onPress} />);
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeBusy();
    expect(button).toBeDisabled();
    expect(screen.queryByText("icon")).toBeNull();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test("gradient: an accent → accent-2 fill behind an on-accent label; the other looks draw no gradient", async () => {
    const overrides = { dark: { accent: "#7c3aed", accent2: "#db2777" } };
    await render(
      <ThemeProvider mode="dark" overrides={overrides}>
        <Button label="Start" variant="gradient" />
      </ThemeProvider>,
    );
    expect(screen.getAllByTestId("gradient-stop", { includeHiddenElements: true }).map((s) => s.props.stopColor)).toEqual(["#7c3aed", "#db2777"]);
    expect(screen.getByRole("button", { name: "Start" })).toBeOnTheScreen();
    await render(
      <ThemeProvider mode="dark" overrides={overrides}>
        <Button label="Start" variant="primary" />
      </ThemeProvider>,
    );
    expect(screen.queryAllByTestId("gradient-stop", { includeHiddenElements: true })).toHaveLength(0);
  });

  test("disabled", async () => {
    await render(<Button label="Send" disabled />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  test("IconButton: label is the accessible name", async () => {
    await render(<IconButton label="Close" icon={<Text>x</Text>} variant="ghost" size="sm" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
  });
});
