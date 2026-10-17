import { fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ForceUpdateScreen } from "./index";

describe("ForceUpdateScreen", () => {
  it("is the page's main, titled, with the update focused, and no axe violation", async () => {
    const onUpdate = vi.fn();
    const onRetry = vi.fn();
    const { container } = render(
      <ForceUpdateScreen mark={<svg />} title="Update to keep going" message="Why." versionLabel="You have 1.1.0" updateLabel="Update the app" onUpdate={onUpdate} retryLabel="I already updated" onRetry={onRetry} />,
    );
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Update to keep going" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Update the app" }));
    fireEvent.click(screen.getByRole("button", { name: "Update the app" }));
    fireEvent.click(screen.getByRole("button", { name: "I already updated" }));
    expect(onUpdate).toHaveBeenCalledOnce();
    expect(onRetry).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("offers no retry unless both its label and its action are given", () => {
    render(<ForceUpdateScreen title="Update" updateLabel="Go" onUpdate={() => undefined} retryLabel="Again" className="min-h-0" />);
    expect(screen.queryByRole("button", { name: "Again" })).toBeNull();
    expect(screen.getByRole("main").className.split(" ")).toContain("min-h-0");
  });
});
