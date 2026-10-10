import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NoResultsExample from "../../registry/examples/command/no-results";
import { axeViolations } from "../test/axe";
import { Command, CommandDialog } from "./index";

function Palette({ onSelect = () => {} }: { onSelect?: (value: string) => void }) {
  return (
    <Command.Root label="Commands">
      <Command.Input placeholder="Type a command" />
      <Command.List label="Suggestions" emptyLabel="Nothing found.">
        <Command.Group heading="Pages">
          <Command.Item onSelect={() => onSelect("home")}>Home</Command.Item>
          <Command.Item onSelect={() => onSelect("wallet")}>Wallet</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Actions">
          <Command.Item onSelect={() => onSelect("upload")} keywords={["video"]}>
            Upload
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}

describe("Command", () => {
  it("is a combobox over a listbox, with no axe violation", async () => {
    const { container } = render(<Palette />);
    const input = screen.getByRole("combobox", { name: "Commands" });
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox", { name: "Suggestions" })).toBeTruthy();
    expect(input.getAttribute("placeholder")).toBe("Type a command");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves with the arrows and runs the active item with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Home" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Wallet" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenLastCalledWith("upload");
  });

  it("filters as you type, by keyword too, and says when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    await user.type(screen.getByRole("combobox"), "video");
    await waitFor(() => expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Upload"]));
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "zzz");
    await waitFor(() => expect(screen.getByText("Nothing found.")).toBeTruthy());
  });

  it("says nothing matches beside the listbox, never inside it — no axe violation (aria-required-children)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Palette />);
    await user.type(screen.getByRole("combobox"), "zzz");
    const empty = await screen.findByText("Nothing found.");
    expect(screen.getByRole("listbox").contains(empty)).toBe(false);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("warns in development when Command.Empty is put inside Command.List", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Command.Root label="Commands">
        <Command.List label="Suggestions">
          <Command.Empty emptyLabel="Nothing." />
        </Command.List>
      </Command.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("emptyLabel"));
    warn.mockRestore();
  });

  it("renders the no-results example without an axe violation", async () => {
    const { container } = render(<NoResultsExample />);
    expect(await screen.findByText("Nothing matches “zzz”.")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("CommandDialog", () => {
  it("opens as a named dialog without a close button, focuses the input, and closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CommandDialog defaultOpen label="Search" onOpenChange={onOpenChange} footer={<p>↑↓ to move</p>}>
        <Command.Input placeholder="Search creators, videos, tags" />
        <Command.List label="Results" emptyLabel="No result.">
          <Command.Item>Night ride</Command.Item>
        </Command.List>
      </CommandDialog>,
    );
    const dialog = screen.getByRole("dialog", { name: "Search" });
    expect(dialog.querySelector("button")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("combobox"));
    expect(screen.getByText("↑↓ to move")).toBeTruthy();
    expect(await axeViolations(dialog)).toEqual([]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
