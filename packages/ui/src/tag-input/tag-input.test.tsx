import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { TagInput } from "./index";

describe("TagInput", () => {
  it("adds a word with Enter or a comma, cleaned, with no axe violation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<TagInput label="Tags" normalize={(t) => t.trim().toLowerCase().replace(/^#/, "")} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Tags" });
    await user.type(input, "#Sunset{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["sunset"]);
    await user.type(input, "Drone,");
    expect(onValueChange).toHaveBeenLastCalledWith(["sunset", "drone"]);
    await user.type(input, "SUNSET{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["sunset", "drone"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("splits a paste on the separators", () => {
    const onValueChange = vi.fn();
    render(<TagInput label="Recipients" separators={[",", " "]} onValueChange={onValueChange} />);
    fireEvent.paste(screen.getByRole("combobox"), { clipboardData: { getData: () => "a@x.com, b@y.org c@z.net" } });
    expect(onValueChange).toHaveBeenLastCalledWith(["a@x.com", "b@y.org", "c@z.net"]);
  });

  it("refuses a word with the reason, shown and read with the field", async () => {
    const user = userEvent.setup();
    render(<TagInput label="Recipients" validate={(v) => (v.includes("@") ? null : `“${v}” is not an e-mail address.`)} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "eric{Enter}");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("“eric” is not an e-mail address.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
  });

  it("removes the last tag with Backspace, and stops at max", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagInput label="Tags" defaultValue={["a", "b"]} max={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "c{Enter}");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.clear(input);
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
  });
});
