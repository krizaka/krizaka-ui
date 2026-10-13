// The navigation of /native: TabBar (badge in words, a tick, reselect), Header (the screen's heading, the back button),
// Tabs (a tab list and its panel), Fab (named, clear of the safe area) — and the insets the app passes.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Fab } from "./fab";
import { Header } from "./header";
import { TabBar } from "./tab-bar";
import { Tabs } from "./tabs";
import { type HapticKind, ThemeProvider } from "./theme";

describe("navigation (native)", () => {
  test("TabBar: tabs with their badge in words, a tick on change, reselect on the current one", async () => {
    const kinds: HapticKind[] = [];
    const change = jest.fn();
    const reselect = jest.fn();
    const icon = () => null;
    await render(
      <ThemeProvider haptics={(k) => kinds.push(k)} insets={{ top: 0, right: 0, bottom: 34, left: 0 }}>
        <TabBar
          value="home"
          onValueChange={change}
          onReselect={reselect}
          items={[
            { value: "home", label: "Home", icon },
            { value: "messages", label: "Messages", icon, badge: 3, badgeLabel: "3 unread" },
          ]}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText(", 3 unread")).toBeTruthy();
    await fireEvent.press(screen.getByRole("tab", { name: /Messages/ }));
    await fireEvent.press(screen.getByRole("tab", { name: /Home/ }));
    expect(change).toHaveBeenCalledWith("messages");
    expect(reselect).toHaveBeenCalledWith("home");
    expect(kinds).toEqual(["selection", "selection"]);
  });

  test("Header: the title is the screen's heading; the back button is named", async () => {
    const back = jest.fn();
    await render(<Header title="Earnings" backLabel="Back" onBack={back} />);
    expect(screen.getAllByRole("heading", { name: "Earnings" }).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalled();
  });

  test("Tabs: the selected tab shows its panel; Fab is a named button", async () => {
    await render(<Tabs aria-label="Page" items={[{ value: "a", label: "Videos", content: <Text>42 videos</Text> }, { value: "b", label: "About", content: <Text>Hi</Text> }]} />);
    expect(screen.getByText("42 videos")).toBeTruthy();
    await fireEvent.press(screen.getByRole("tab", { name: "About" }));
    expect(screen.getByText("Hi")).toBeTruthy();
    const press = jest.fn();
    await render(<Fab label="New challenge" icon={null} onPress={press} />);
    await fireEvent.press(screen.getByRole("button", { name: "New challenge" }));
    expect(press).toHaveBeenCalled();
  });
});
