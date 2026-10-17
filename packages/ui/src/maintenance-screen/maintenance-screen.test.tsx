import { fireEvent, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { MaintenanceScreen } from "./index";

describe("MaintenanceScreen", () => {
  it("says what is happening politely and lets the person check again, with no axe violation", async () => {
    const onRetry = vi.fn();
    const { container } = render(<MaintenanceScreen mark={<svg />} title="Back in a few minutes" message="We are upgrading." retryLabel="Try again" onRetry={onRetry} />);
    expect(screen.getByRole("status").textContent).toContain("We are upgrading.");
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("offers no retry without both its label and its action, and works with a title alone", () => {
    render(<MaintenanceScreen title="Down" retryLabel="Again" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
