import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "./index";

describe("Tooltip", () => {
  it("shows on keyboard focus, describes its trigger, and Escape dismisses it", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copy the link">
        <button type="button" aria-label="Copy">
          ⧉
        </button>
      </Tooltip>,
    );
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Copy" });
    expect(document.activeElement).toBe(trigger);
    const tip = await screen.findByRole("tooltip");
    expect(tip.textContent).toBe("Copy the link");
    expect(trigger.getAttribute("aria-describedby")).toBe(tip.id);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("waits 300 ms on hover by default", () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip content="Later">
          <button type="button">Hover me</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole("button");
      act(() => void trigger.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse" })));
      act(() => void vi.advanceTimersByTime(250));
      expect(screen.queryByRole("tooltip")).toBeNull();
      act(() => void vi.advanceTimersByTime(100));
      expect(screen.getByRole("tooltip").textContent).toBe("Later");
    } finally {
      vi.useRealTimers();
    }
  });
});
