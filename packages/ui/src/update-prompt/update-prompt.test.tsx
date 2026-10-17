import { fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { UpdatePrompt } from "./index";

const props = { title: "A new version is available", message: "Faster chats.", versionLabel: "1.2.0 → 1.4.0", updateLabel: "Update", laterLabel: "Later" };

describe("UpdatePrompt", () => {
  it("names itself, shows the versions and runs the two actions, with no axe violation", async () => {
    const onUpdate = vi.fn();
    const onLater = vi.fn();
    const { container } = render(<UpdatePrompt {...props} mark={<svg />} onUpdate={onUpdate} onLater={onLater} />);
    expect(screen.getByRole("region", { name: "A new version is available" }).textContent).toContain("1.2.0 → 1.4.0");
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    fireEvent.click(screen.getByRole("button", { name: "Later" }));
    expect(onUpdate).toHaveBeenCalledOnce();
    expect(onLater).toHaveBeenCalledOnce();
    expect(container.querySelector("[aria-hidden]")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("works with the title alone, and the product's className wins", () => {
    render(<UpdatePrompt title="Update" updateLabel="Go" onUpdate={() => undefined} laterLabel="Later" onLater={() => undefined} className="p-2" />);
    const classes = screen.getByRole("region").className.split(" ");
    expect(classes).toContain("p-2");
    expect(classes).not.toContain("p-4");
  });

  it("does not name the region when the title is not a string", () => {
    render(<UpdatePrompt title={<b>Update</b>} updateLabel="Go" onUpdate={() => undefined} laterLabel="Later" onLater={() => undefined} />);
    expect(screen.getByRole("region").getAttribute("aria-label")).toBeNull();
  });
});
