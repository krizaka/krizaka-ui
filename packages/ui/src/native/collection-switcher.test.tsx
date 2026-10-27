// CollectionSwitcher on React Native: nesting, the default marked and not removable, the current one selected.
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";

import { CollectionSwitcher } from "./collection-switcher";

afterEach(async () => cleanup());

const COLLECTIONS = [
  { id: "all", name: "Everything", isDefault: true },
  { id: "y", name: "2026" },
  { id: "s", name: "Spring", parentId: "y" },
];

describe("CollectionSwitcher (native)", () => {
  test("marks the current one and chooses another", async () => {
    const onValueChange = jest.fn();
    await render(<CollectionSwitcher collections={COLLECTIONS} value="y" onValueChange={onValueChange} label="Collections" defaultLabel="Default" layout="tree" />);
    expect(screen.getByRole("button", { name: "2026" }).props.accessibilityState.selected).toBe(true);
    await fireEvent.press(screen.getByRole("button", { name: "Spring" }));
    expect(onValueChange).toHaveBeenCalledWith("s");
  });

  test("never offers to remove the default collection", async () => {
    const onRemove = jest.fn();
    await render(<CollectionSwitcher collections={COLLECTIONS} value="all" label="Collections" defaultLabel="Default" onRemove={onRemove} removeLabel={(n) => `Remove ${n}`} />);
    expect(screen.queryByRole("button", { name: "Remove Everything" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Remove 2026" }));
    expect(onRemove).toHaveBeenCalledWith("y");
  });
});
