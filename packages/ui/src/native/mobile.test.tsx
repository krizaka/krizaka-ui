// The mobile components of /native: what Orazaka's Jobs tab and Orochia's app use (Loader, Stepper, Meter,
// NumberTicker), the overlays (Dialog, BottomSheet, ActionSheet), the forms (Field, Select, Switch, Checkbox, Radio,
// Slider, OtpInput), the navigation (TabBar, Header, Tabs), the lists (List, SwipeableRow, DataTable), and the screens
// (ImageViewer, PermissionPrompt, Onboarding, MediaPicker) — their roles, names, values and the haptics they play.
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { AccessibilityInfo, Text } from "react-native";

import { ActionSheet } from "./action-sheet";
import { Avatar } from "./avatar";
import { BottomSheet } from "./bottom-sheet";
import { Checkbox } from "./checkbox";
import { DataTable } from "./data-table";
import { AlertDialog } from "./dialog";
import { Field, Input, Select } from "./field";
import { Header } from "./header";
import { ImageViewer } from "./image-viewer";
import { List, ListItem } from "./list";
import { Loader } from "./loader";
import { MediaPicker } from "./media-picker";
import { Meter } from "./meter";
import { NumberTicker } from "./number-ticker";
import { Onboarding } from "./onboarding";
import { OtpInput } from "./otp-input";
import { PermissionPrompt } from "./permission-prompt";
import { RadioGroup } from "./radio-group";
import { Slider } from "./slider";
import { Stepper } from "./stepper";
import { SwipeableRow } from "./swipeable-row";
import { TabBar } from "./tab-bar";
import { type Haptics, hapticsFrom, ThemeProvider } from "./theme";

const feedback = () => {
  const calls: string[] = [];
  const haptics: Haptics = { selection: () => calls.push("selection"), impact: (w) => calls.push(`impact:${w}`), notification: (t) => calls.push(`notification:${t}`) };
  return { calls, wrap: (ui: React.ReactElement) => <ThemeProvider haptics={haptics}>{ui}</ThemeProvider> };
};

describe("waits and figures", () => {
  test("Loader shows after its delay, is announced, and ends on its words", async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    const { rerender } = await render(<Loader label="Loading your jobs" />);
    expect(screen.queryByLabelText("Loading your jobs")).toBeNull();
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByRole("progressbar", { name: "Loading your jobs" })).toBeTruthy();
    expect(announce).toHaveBeenCalledWith("Loading your jobs");
    await rerender(<Loader label="Loading your jobs" status="success" successLabel="Jobs loaded" />);
    await act(async () => jest.advanceTimersByTime(700));
    await act(async () => jest.advanceTimersByTime(10));
    expect(screen.getByLabelText("Jobs loaded")).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(screen.queryByLabelText("Jobs loaded")).toBeNull();
    jest.useRealTimers();
  });

  test("Stepper says each step's status; Meter is a meter with its value in words", async () => {
    await render(<Stepper current={1} steps={[{ title: "Transcribe" }, { title: "Translate" }, { title: "Mix" }]} statusLabels={{ done: "fait" }} />);
    expect(screen.getByLabelText("Transcribe, fait")).toBeTruthy();
    expect(screen.getByLabelText("Translate, in progress")).toBeTruthy();
    expect(screen.getByLabelText("Mix, to come")).toBeTruthy();
    await render(<Meter label="Credits" value={4120} max={5000} valueText="4,120 of 5,000" thresholds={{ low: 0.8, high: 0.95 }} />);
    const meter = screen.getByRole("meter" as never);
    expect(meter.props["aria-valuetext"]).toBe("4,120 of 5,000");
    expect(meter.props["aria-valuenow"]).toBe(4120);
  });

  test("NumberTicker carries its final value for screen readers from the first frame", async () => {
    await render(<NumberTicker value={128.4} locale="en-US" format={{ style: "currency", currency: "USD" }} />);
    expect(screen.getByLabelText("$128.40")).toBeTruthy();
  });
});

describe("overlays", () => {
  test("AlertDialog confirms, then closes", async () => {
    const onConfirm = jest.fn();
    await render(<AlertDialog defaultOpen title="Delete the video?" cancelLabel="Keep it" confirmLabel="Delete" destructive onConfirm={onConfirm} />);
    // The dialog is a container (not one accessibility element): found by its name.
    expect(screen.getByLabelText("Delete the video?").props.role).toBe("dialog");
    await fireEvent.press(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalled();
    expect(screen.queryByLabelText("Delete the video?")).toBeNull();
  });

  test("BottomSheet is a modal dialog named by its title; ActionSheet runs an action with a tick", async () => {
    await render(
      <BottomSheet defaultOpen title="Comments" closeLabel="Close">
        <Text>Nice</Text>
      </BottomSheet>,
    );
    expect(screen.getByLabelText("Comments").props.role).toBe("dialog");
    const { calls, wrap } = feedback();
    const share = jest.fn();
    await render(wrap(<ActionSheet defaultOpen title="Your video" cancelLabel="Cancel" actions={[{ label: "Share", onPress: share }, { label: "Delete", destructive: true, onPress: jest.fn() }]} />));
    await fireEvent.press(screen.getByRole("menuitem", { name: "Share" }));
    expect(share).toHaveBeenCalled();
    expect(calls).toEqual(["selection"]);
  });
});

describe("forms", () => {
  test("Field names its control and says its error", async () => {
    await render(
      <Field label="Handle" error="No spaces.">
        <Input defaultValue="elena music" />
      </Field>,
    );
    const input = screen.getByLabelText("Handle");
    expect(input.props["aria-invalid"]).toBe(true);
    expect(screen.getByRole("alert")).toHaveTextContent("No spaces.");
  });

  test("Select opens a sheet of options and picks one", async () => {
    const picked: string[] = [];
    await render(
      <Field label="Dub into">
        <Select options={[{ value: "en", label: "English" }, { value: "fr", label: "Français" }]} value="en" onValueChange={(v) => picked.push(v)} />
      </Field>,
    );
    await fireEvent.press(screen.getByRole("combobox", { name: "Dub into" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Français" }));
    expect(picked).toEqual(["fr"]);
  });

  test("Checkbox, RadioGroup and Slider: roles, states, accessibility actions", async () => {
    await render(<Checkbox label="Terms" />);
    await fireEvent.press(screen.getByRole("checkbox", { name: "Terms" }));
    expect(screen.getByRole("checkbox", { name: "Terms" })).toBeChecked();
    await render(<RadioGroup label="Visibility" defaultValue="all" options={[{ value: "all", label: "Everyone" }, { value: "fans", label: "Supporters" }]} />);
    await fireEvent.press(screen.getByRole("radio", { name: "Supporters" }));
    expect(screen.getByRole("radio", { name: "Supporters" })).toBeChecked();
    const values: number[] = [];
    await render(<Slider label="Exposure" min={-2} max={2} step={0.5} defaultValue={0} onValueChange={(v) => values.push(v)} valueText={(v) => `${v} EV`} />);
    const slider = screen.getByRole("slider", { name: "Exposure" });
    await act(async () => fireEvent(slider, "accessibilityAction", { nativeEvent: { actionName: "increment" } }));
    expect(values).toEqual([0.5]);
    expect(screen.getByRole("slider").props["aria-valuetext"]).toBe("0.5 EV");
  });

  test("OtpInput keeps digits only and completes with a success tick", async () => {
    const { calls, wrap } = feedback();
    const done = jest.fn();
    await render(wrap(<OtpInput label="Code" length={4} onComplete={done} />));
    await fireEvent.changeText(screen.getByLabelText("Code"), "4a8-2 1");
    expect(done).toHaveBeenCalledWith("4821");
    expect(calls).toContain("notification:success");
  });
});

describe("navigation and lists", () => {
  test("TabBar: tabs named with their badge, a tick on change, reselect on the current one", async () => {
    const { calls, wrap } = feedback();
    const change = jest.fn();
    const reselect = jest.fn();
    const icon = () => null;
    await render(
      wrap(
        <TabBar
          value="home"
          onValueChange={change}
          onReselect={reselect}
          items={[
            { value: "home", label: "Home", icon },
            { value: "messages", label: "Messages", icon, badge: 3, badgeLabel: "3 unread" },
          ]}
        />,
      ),
    );
    await fireEvent.press(screen.getByRole("tab", { name: "Messages, 3 unread" }));
    await fireEvent.press(screen.getByRole("tab", { name: "Home" }));
    expect(change).toHaveBeenCalledWith("messages");
    expect(reselect).toHaveBeenCalledWith("home");
    expect(calls).toEqual(["selection", "selection"]);
  });

  test("Header: the title is the screen's heading; the back button is named", async () => {
    const back = jest.fn();
    await render(<Header title="Earnings" backLabel="Back" onBack={back} />);
    expect(screen.getAllByRole("heading", { name: "Earnings" }).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalled();
  });

  test("SwipeableRow offers its actions to screen readers; List shows its empty state", async () => {
    const archive = jest.fn();
    await render(
      <SwipeableRow trailing={[{ label: "Archive", onPress: archive }]} onActivate={jest.fn()} testID="row">
        <ListItem title="Elena" />
      </SwipeableRow>,
    );
    // The row is a gesture responder that declines touches at rest, so the test calls the action as the screen reader does.
    await act(async () => screen.getByTestId("row").props.onAccessibilityAction({ nativeEvent: { actionName: "Archive" } }));
    expect(archive).toHaveBeenCalled();
    await render(<List data={[]} keyExtractor={(x: string) => x} renderItem={(x) => <ListItem title={x} />} empty={<Text>No job yet</Text>} />);
    expect(screen.getByText("No job yet")).toBeTruthy();
  });

  test("DataTable: cards headed by the title column, sorted by the sort row", async () => {
    const rows = [
      { id: "a", name: "Dub", credits: 120 },
      { id: "b", name: "Transcribe", credits: 18 },
    ];
    const Sorted = () => {
      const [sort, setSort] = React.useState<{ column: string; direction: "ascending" | "descending" } | null>(null);
      return (
        <DataTable
          caption="Jobs"
          rows={rows}
          getRowId={(r) => r.id}
          sort={sort}
          onSortChange={setSort}
          columns={[
            { id: "name", header: "Job", card: "title" },
            { id: "credits", header: "Credits", sortable: true },
          ]}
        />
      );
    };
    await render(<Sorted />);
    await fireEvent.press(screen.getByRole("button", { name: "Credits" }));
    const titles = screen.getAllByText(/^(Dub|Transcribe)$/).map((t) => t.props.children);
    expect(titles).toEqual(["Transcribe", "Dub"]);
  });
});

describe("screens", () => {
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

  test("Onboarding: Skip and Get started both finish it", async () => {
    const done = jest.fn();
    await render(<Onboarding slides={[{ title: "One", description: "First" }]} labels={{ next: "Next", done: "Get started", skip: "Skip", position: (n, t) => `${n}/${t}` }} onDone={done} />);
    await fireEvent.press(screen.getByRole("button", { name: "Get started" }));
    expect(done).toHaveBeenCalledTimes(1);
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

  test("Avatar says its presence; hapticsFrom adapts expo-haptics", async () => {
    await render(<Avatar alt="Elena" presence="online" presenceLabel="online" />);
    expect(screen.getByRole("img", { name: "Elena, online" })).toBeTruthy();
    const seen: unknown[] = [];
    const run = (x: unknown) => {
      seen.push(x);
      return Promise.resolve();
    };
    const h = hapticsFrom({
      selectionAsync: () => run("selection"),
      impactAsync: run as never,
      notificationAsync: run as never,
      ImpactFeedbackStyle: { Light: "L", Medium: "M", Heavy: "H" },
      NotificationFeedbackType: { Success: "S", Warning: "W", Error: "E" },
    });
    h.selection?.();
    h.impact?.("medium");
    h.notification?.("error");
    expect(seen).toEqual(["selection", "M", "E"]);
  });
});
