import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { StepProgress } from "./index";

const label = (n: number, total: number) => `Step ${n} of ${total}`;

describe("StepProgress", () => {
  it("is a progress bar that says the position in words", async () => {
    const { container } = render(<StepProgress step={2} total={4} label={label} />);
    const bar = screen.getByRole("progressbar", { name: "Step 2 of 4" });
    expect(bar.getAttribute("aria-valuenow")).toBe("2");
    expect(bar.getAttribute("aria-valuemax")).toBe("4");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("fills the segments up to the current step", () => {
    render(<StepProgress step={3} total={5} label={label} />);
    const filled = [...screen.getByRole("progressbar").children].map((s) => s.className.includes("bg-accent"));
    expect(filled).toEqual([true, true, true, false, false]);
  });

  it("holds the back and trailing controls", () => {
    render(<StepProgress step={1} total={3} label={label} back={<a href="#b">Back</a>} trailing={<a href="#s">Skip</a>} />);
    expect(screen.getByRole("link", { name: "Back" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Skip" })).toBeTruthy();
  });
});
