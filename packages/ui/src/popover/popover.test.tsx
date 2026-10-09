import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { Popover } from "./index";

describe("Popover", () => {
  it("opens from its trigger, styled and labelled, and closes on Escape with the focus back", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Content aria-label="Share">
          <button type="button">Copy link</button>
        </Popover.Content>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Share" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(dialog.className).toContain("kz-pop");
    expect(dialog.className).toContain("bg-surface-2");
    expect(await axeViolations(dialog)).toEqual([]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
