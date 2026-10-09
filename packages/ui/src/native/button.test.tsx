import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { Button, IconButton } from "./button";

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

  test("disabled", async () => {
    await render(<Button label="Send" disabled />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  test("IconButton: label is the accessible name", async () => {
    await render(<IconButton label="Close" icon={<Text>x</Text>} variant="ghost" size="sm" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
  });
});
