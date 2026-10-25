// The native top bar (#640): the family's order, a count said in the name, the search trigger named.
import { describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

import FamilyExample from "../../registry/examples/app-header/native/family";
import { AppHeader, AppHeaderCount, AppHeaderSearch } from "./app-header";

describe("AppHeader (native)", () => {
  test("draws the controls in the family's order, whatever the props' order", async () => {
    const slot = (id: string) => (
      <Pressable role="button" aria-label={id}>
        <Text>{id}</Text>
      </Pressable>
    );
    await render(<AppHeader name="Yomizaka" account={slot("account")} notifications={slot("notifications")} search={slot("search")} language={slot("language")} />);
    expect(screen.getAllByRole("button").map((b) => b.props.accessibilityLabel ?? b.props["aria-label"])).toEqual(["search", "language", "notifications", "account"]);
    expect(screen.getByText("Yomizaka")).toBeTruthy();
  });

  test("the name is a link home with onHome", async () => {
    const home = jest.fn();
    await render(<AppHeader name="Yomizaka" onHome={home} />);
    await fireEvent.press(screen.getByRole("link", { name: "Yomizaka" }));
    expect(home).toHaveBeenCalled();
  });

  test("AppHeaderCount says the count in its name and caps the badge at max+", async () => {
    const press = jest.fn();
    await render(<AppHeaderCount label="Notifications" icon={null} count={140} countLabel="140 new" onPress={press} />);
    await fireEvent.press(screen.getByRole("button", { name: "Notifications, 140 new" }));
    expect(press).toHaveBeenCalled();
    expect(screen.getByText("99+", { includeHiddenElements: true })).toBeTruthy();
    await render(<AppHeaderCount label="Messages" icon={null} count={0} />);
    expect(screen.getByRole("button", { name: "Messages" })).toBeTruthy();
    expect(screen.queryByText("0", { includeHiddenElements: true })).toBeNull();
  });

  test("AppHeaderSearch is a named button that opens the search", async () => {
    const open = jest.fn();
    await render(<AppHeaderSearch label="Search files and checks" onOpen={open} />);
    await fireEvent.press(screen.getByRole("button", { name: "Search files and checks" }));
    expect(open).toHaveBeenCalled();
  });

  test("the family example renders its controls", async () => {
    await render(<FamilyExample />);
    expect(screen.getByRole("button", { name: "Notifications, 3 new" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search files and checks" })).toBeTruthy();
  });
});
