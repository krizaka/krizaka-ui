// Lists and inputs of /native: SwipeableRow (its actions for screen readers), OtpInput (digits only, completes with a
// haptic), MediaPicker (adds from the library through its sheet, removes a tile), Avatar (presence in words).
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { Avatar } from "./avatar";
import { MediaPicker } from "./media-picker";
import { OtpInput } from "./otp-input";
import { SwipeableRow } from "./swipeable-row";
import { type HapticKind, ThemeProvider } from "./theme";

describe("lists and inputs (native)", () => {
  test("SwipeableRow offers its actions to screen readers", async () => {
    const archive = jest.fn();
    await render(
      <SwipeableRow trailing={[{ label: "Archive", onPress: archive }]} onActivate={jest.fn()} testID="row">
        <Text>Elena</Text>
      </SwipeableRow>,
    );
    // The row is a gesture responder that declines touches at rest, so the test calls the action as the screen reader does.
    await act(async () => screen.getByTestId("row").props.onAccessibilityAction({ nativeEvent: { actionName: "Archive" } }));
    expect(archive).toHaveBeenCalled();
  });

  test("OtpInput keeps digits only and completes with a success haptic", async () => {
    const kinds: HapticKind[] = [];
    const done = jest.fn();
    await render(
      <ThemeProvider haptics={(k) => kinds.push(k)}>
        <OtpInput label="Code" length={4} onComplete={done} />
      </ThemeProvider>,
    );
    await fireEvent.changeText(screen.getByLabelText("Code"), "4a8-2 1");
    expect(done).toHaveBeenCalledWith("4821");
    expect(kinds).toContain("success");
  });

  test("MediaPicker adds from the library through the sheet, and removes a tile", async () => {
    const changes: number[] = [];
    const Picker = () => {
      const [media, setMedia] = React.useState<React.ComponentProps<typeof MediaPicker>["value"]>([]);
      return (
        <MediaPicker
          value={media}
          max={4}
          onValueChange={(next) => {
            changes.push(next.length);
            setMedia(next);
          }}
          labels={{ add: "Add", source: "Add from", library: "Library", camera: "Camera", cancel: "Cancel", remove: (n) => `Remove ${n}` }}
        />
      );
    };
    await render(<Picker />);
    await fireEvent.press(screen.getByRole("button", { name: "Add" }));
    await act(async () => fireEvent.press(screen.getByRole("menuitem", { name: "Library" })));
    await fireEvent.press(screen.getByRole("button", { name: "Remove 1" }));
    expect(changes).toEqual([2, 1]);
  });

  test("Avatar says its presence", async () => {
    await render(<Avatar alt="Elena" presence="online" presenceLabel="online" />);
    expect(screen.getByRole("img", { name: "Elena, online" })).toBeTruthy();
  });
});
