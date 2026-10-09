import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { ConfirmButton } from "./index";

function Trash() {
  return <svg aria-hidden viewBox="0 0 24 24" />;
}

describe("ConfirmButton", () => {
  it("arms on the first press, announces it, and confirms on the second", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const { container } = render(
      <ConfirmButton label="Delete" confirmLabel="Delete for good?" onConfirm={onConfirm}>
        <Trash />
      </ConfirmButton>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    await user.click(button);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(button.hasAttribute("data-armed")).toBe(true);
    expect(button.getAttribute("aria-label")).toBe("Delete for good?");
    expect(container.querySelector("[aria-live=polite]")?.textContent).toBe("Delete for good?");
    expect(await axeViolations(container)).toEqual([]);
    await user.click(button);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(button.hasAttribute("data-armed")).toBe(false);
  });

  it("disarms after timeoutMs, on Escape and on blur", async () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();
    const onArmedChange = vi.fn();
    render(
      <>
        <ConfirmButton label="Remove" confirmLabel="Remove?" timeoutMs={1000} onConfirm={onConfirm} onArmedChange={onArmedChange}>
          <Trash />
        </ConfirmButton>
        <button type="button">Elsewhere</button>
      </>,
    );
    const button = screen.getByRole("button", { name: "Remove" });
    act(() => button.click());
    expect(button.hasAttribute("data-armed")).toBe(true);
    act(() => vi.advanceTimersByTime(1000));
    expect(button.hasAttribute("data-armed")).toBe(false);
    expect(onArmedChange.mock.calls).toEqual([[true], [false]]);
    vi.useRealTimers();

    const user = userEvent.setup();
    await user.click(button);
    await user.keyboard("{Escape}");
    expect(button.hasAttribute("data-armed")).toBe(false);
    await user.click(button);
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(button.hasAttribute("data-armed")).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("works from the keyboard: Enter twice", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmButton confirmLabel="Leave the group?" onConfirm={onConfirm}>
        Leave
      </ConfirmButton>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button").textContent).toContain("Leave the group?");
    await user.keyboard("{Enter}");
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
