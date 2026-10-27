import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { CopyButton } from "./index";

const props = { value: "https://x.test/r/1", label: "Copy link", copiedLabel: "Copied", fallbackLabel: "Select and copy" };

describe("CopyButton", () => {
  it("copies with the Clipboard API, announces it, and resets", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onCopy = vi.fn();
    const { container } = render(<CopyButton {...props} resetMs={50} onCopy={onCopy} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://x.test/r/1");
    expect(onCopy).toHaveBeenCalledOnce();
    expect(container.querySelector("[aria-live=polite]")?.textContent).toBe("Copied");
    expect(screen.getByRole("button").hasAttribute("data-copied")).toBe(true);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 80));
    });
    expect(container.querySelector("[aria-live=polite]")?.textContent).toBe("");
  });

  it("shows a selected read-only field when the clipboard is unavailable", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const onCopy = vi.fn();
    render(<CopyButton {...props} onCopy={onCopy} />);
    await user.click(screen.getByRole("button"));
    const field = screen.getByLabelText("Select and copy") as HTMLInputElement;
    expect(field.readOnly).toBe(true);
    expect(field.value).toBe("https://x.test/r/1");
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("names an icon-only button by its label", () => {
    render(<CopyButton {...props} iconOnly />);
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
  });
});
