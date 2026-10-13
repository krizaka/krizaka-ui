// The overlays and screens of /native: ActionSheet (a menu, a tick), ImageViewer (named images, moved by the screen
// reader's swipes), PermissionPrompt (asks, then the feature; blocked, the settings), Onboarding (skip and finish).
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ActionSheet } from "./action-sheet";
import { ImageViewer } from "./image-viewer";
import { Onboarding } from "./onboarding";
import { PermissionPrompt } from "./permission-prompt";
import { type HapticKind, ThemeProvider } from "./theme";

describe("overlays (native)", () => {
  test("ActionSheet runs an action with a tick", async () => {
    const kinds: HapticKind[] = [];
    const share = jest.fn();
    await render(
      <ThemeProvider haptics={(k) => kinds.push(k)}>
        <ActionSheet defaultOpen title="Your video" cancelLabel="Cancel" actions={[{ label: "Share", onPress: share }, { label: "Delete", destructive: true, onPress: jest.fn() }]} />
      </ThemeProvider>,
    );
    await fireEvent.press(screen.getByRole("menuitem", { name: "Share" }));
    expect(share).toHaveBeenCalled();
    expect(kinds).toEqual(["selection"]);
  });

  test("ImageViewer names the image and its position, and moves with the screen reader's swipes", async () => {
    const moves: (number | null)[] = [];
    await render(<ImageViewer images={[{ uri: "a.jpg", alt: "Stage" }, { uri: "b.jpg", alt: "Crowd" }]} index={0} onIndexChange={(i) => moves.push(i)} closeLabel="Close" />);
    const image = screen.getByRole("img", { name: "Stage, 1 / 2" });
    await act(async () => fireEvent(image, "accessibilityAction", { nativeEvent: { actionName: "increment" } }));
    await fireEvent.press(screen.getByRole("button", { name: "Close" }));
    expect(moves).toEqual([1, null]);
  });

  test("PermissionPrompt asks, then shows the feature; blocked, it leads to the settings", async () => {
    const allow = jest.fn();
    const { rerender } = await render(<PermissionPrompt status="undetermined" title="Film" description="Why" allowLabel="Allow" onAllow={allow} />);
    await fireEvent.press(screen.getByRole("button", { name: "Allow" }));
    expect(allow).toHaveBeenCalled();
    await rerender(
      <PermissionPrompt status="granted" title="Film" description="Why" allowLabel="Allow" onAllow={allow}>
        <Text>Camera</Text>
      </PermissionPrompt>,
    );
    expect(screen.getByText("Camera")).toBeTruthy();
    const settings = jest.fn();
    await rerender(<PermissionPrompt status="blocked" title="Film" description="Why" allowLabel="Allow" onAllow={allow} settingsLabel="Open the settings" onOpenSettings={settings} />);
    await fireEvent.press(screen.getByRole("button", { name: "Open the settings" }));
    expect(settings).toHaveBeenCalled();
  });

  test("Onboarding: Get started finishes it", async () => {
    const done = jest.fn();
    await render(<Onboarding slides={[{ title: "One", description: "First" }]} labels={{ next: "Next", done: "Get started", skip: "Skip", position: (n, t) => `${n}/${t}` }} onDone={done} />);
    await fireEvent.press(screen.getByRole("button", { name: "Get started" }));
    expect(done).toHaveBeenCalledTimes(1);
  });
});
