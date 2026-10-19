import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { SearchField } from "./index";

describe("SearchField", () => {
  it("is a named search input in a search landmark, with no axe violation", async () => {
    const { container } = render(<SearchField label="Search videos" />);
    expect(screen.getByRole("search")).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "Search videos" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("clears, submits on Enter and searches once typing pauses", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onSubmit = vi.fn();
    render(<SearchField label="Search" onSearch={onSearch} onSubmit={onSubmit} debounce={400} />); // long enough that a slow runner cannot pause between two keystrokes
    const input = screen.getByRole("searchbox") as HTMLInputElement;
    await user.type(input, "cat");
    expect(onSearch).not.toHaveBeenCalled();
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("cat"), { timeout: 3000 });
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("cat");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input.value).toBe("");
    expect(document.activeElement).toBe(input);
  });

  it("focuses itself with ⌘K or Ctrl+K", () => {
    render(<SearchField label="Search" shortcut="k" />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(document.activeElement).toBe(screen.getByRole("searchbox", { name: "Search" }));
  });

  it("walks the suggestions with the arrows and picks one with Enter", async () => {
    const user = userEvent.setup();
    const onSuggestionSelect = vi.fn();
    render(<SearchField label="Search" suggestions={[{ value: "a", label: "sunset" }, { value: "b", label: "studio" }]} onSuggestionSelect={onSuggestionSelect} />);
    const input = screen.getByRole("combobox", { name: "Search" });
    await user.click(input);
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onSuggestionSelect).toHaveBeenCalledWith({ value: "b", label: "studio" });
  });
});
