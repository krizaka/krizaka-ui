// SettingsRow / SettingsGroup (settings-layout) on React Native: a titled group, rows that are buttons when they open something.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { Switch } from "react-native";

import { SettingsGroup, SettingsRow } from "./settings-layout";

afterEach(async () => cleanup());

describe("SettingsRow / SettingsGroup (native)", () => {
  test("a group is a heading and its rows", async () => {
    await render(
      <SettingsGroup title="Account">
        <SettingsRow label="Username" value="eric" />
        <SettingsRow label="Language" value="English" onPress={() => {}} />
      </SettingsGroup>,
    );
    expect(screen.getByRole("heading", { name: "Account" })).toBeTruthy();
    expect(screen.getByText("Username")).toBeTruthy();
    expect(screen.getByText("English")).toBeTruthy();
  });

  test("a row with onPress is a button named by its visible words (label, help, value), and presses", async () => {
    const onPress = jest.fn();
    await render(<SettingsRow label="Language" description="Used across the app" value="English" onPress={onPress} />);
    const button = screen.getByRole("button", { name: /Language.*English/ });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("a row without onPress is not a button; one with a control keeps the control reachable", async () => {
    await render(
      <SettingsGroup>
        <SettingsRow label="Username" value="eric" />
        <SettingsRow label="Notifications" trailing={<Switch accessibilityLabel="Notifications" value onValueChange={() => {}} />} onPress={() => {}} />
      </SettingsGroup>,
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByLabelText("Notifications")).toBeTruthy();
  });

  test("a disabled row does not press", async () => {
    const onPress = jest.fn();
    await render(<SettingsRow label="Delete account" destructive disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Delete account" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
