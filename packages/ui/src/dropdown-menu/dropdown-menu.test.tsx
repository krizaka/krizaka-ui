import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { DropdownMenu } from "./index";

function Menu({ onSelect = () => {} }: { onSelect?: (value: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Video</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={() => onSelect("edit")}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => onSelect("share")}>Share</DropdownMenu.Item>
        <DropdownMenu.CheckboxItem checked>Pinned</DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger" onSelect={() => onSelect("delete")}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe("DropdownMenu", () => {
  it("opens with the keyboard, moves with the arrows and runs the item on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    screen.getByRole("button", { name: "Actions" }).focus();
    await user.keyboard("{Enter}");
    const menu = screen.getByRole("menu");
    expect(await axeViolations(menu)).toEqual([]);
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Edit" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Share" }));
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const del = screen.getByRole("menuitem", { name: "Delete" });
    expect(document.activeElement).toBe(del);
    expect(del.dataset.tone).toBe("danger");
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("delete");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape and gives the focus back to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Pinned" }).getAttribute("aria-checked")).toBe("true");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
