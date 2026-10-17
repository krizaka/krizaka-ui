// The three screens of the app-version contract (krizaka/.github#75): the soft prompt asks twice-over (Update, Later), the
// forced screen leaves one way out, the maintenance screen announces itself and lets the person check again.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ForceUpdateScreen } from "./force-update-screen";
import { MaintenanceScreen } from "./maintenance-screen";
import { UpdatePrompt } from "./update-prompt";

describe("app update screens (native)", () => {
  test("UpdatePrompt names itself, shows the versions and runs its two actions", async () => {
    const update = jest.fn();
    const later = jest.fn();
    await render(
      <UpdatePrompt mark={<Text>mark</Text>} title="A new version is available" message="Faster chats." versionLabel="1.2.0 → 1.4.0" updateLabel="Update" onUpdate={update} laterLabel="Later" onLater={later} />,
    );
    expect(screen.getByText("1.2.0 → 1.4.0")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Update" }));
    await fireEvent.press(screen.getByRole("button", { name: "Later" }));
    expect(update).toHaveBeenCalledTimes(1);
    expect(later).toHaveBeenCalledTimes(1);
  });

  test("UpdatePrompt works with the title alone", async () => {
    await render(<UpdatePrompt title="Update" updateLabel="Go" onUpdate={jest.fn()} laterLabel="Later" onLater={jest.fn()} />);
    expect(screen.getByText("Update")).toBeTruthy();
  });

  test("ForceUpdateScreen leaves the update and, when given, a retry", async () => {
    const update = jest.fn();
    const retry = jest.fn();
    await render(
      <ForceUpdateScreen mark={<Text>mark</Text>} title="Update to keep going" message="Why." versionLabel="You have 1.1.0" updateLabel="Update the app" onUpdate={update} retryLabel="I already updated" onRetry={retry} />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Update the app" }));
    await fireEvent.press(screen.getByRole("button", { name: "I already updated" }));
    expect(update).toHaveBeenCalledTimes(1);
    expect(retry).toHaveBeenCalledTimes(1);
  });

  test("ForceUpdateScreen offers no retry without both its label and its action, and can be a card", async () => {
    await render(<ForceUpdateScreen fill={false} title="Update" updateLabel="Go" onUpdate={jest.fn()} retryLabel="Again" />);
    expect(screen.queryByRole("button", { name: "Again" })).toBeNull();
  });

  test("MaintenanceScreen announces itself and lets the person try again", async () => {
    const retry = jest.fn();
    await render(<MaintenanceScreen mark={<Text>mark</Text>} title="Back in a few minutes" message="We are upgrading." retryLabel="Try again" onRetry={retry} />);
    expect(screen.getByText("We are upgrading.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  test("MaintenanceScreen without a retry shows no button", async () => {
    await render(<MaintenanceScreen fill={false} title="Down" retryLabel="Again" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
