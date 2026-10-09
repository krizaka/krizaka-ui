import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Progress } from "./index";

describe("Progress", () => {
  it("is a named progress bar with its value, with no axe violation", async () => {
    const { container } = render(<Progress label="Upload" value={42} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("aria-valuetext")).toBe("42%");
    expect(bar.dataset.state).toBe("loading");
    expect((bar.firstElementChild as HTMLElement).style.width).toBe("42%");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("clamps, completes, and speaks a custom value text", () => {
    render(<Progress label="Raised" value={1500} max={1000} valueText="$1,500 of $1,000" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("1000");
    expect(bar.getAttribute("aria-valuetext")).toBe("$1,500 of $1,000");
    expect(bar.dataset.state).toBe("complete");
  });

  it("is indeterminate without a value", async () => {
    const { container } = render(<Progress label="Processing" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.dataset.state).toBe("indeterminate");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws a ring with content in its centre", async () => {
    const { container } = render(
      <Progress variant="ring" size="lg" label="Goal" value={25}>
        <span>$250</span>
      </Progress>,
    );
    const ring = screen.getByRole("progressbar", { name: "Goal" });
    expect(ring.dataset.variant).toBe("ring");
    expect(container.querySelectorAll("circle")[1].getAttribute("stroke-dashoffset")).toBe("75");
    expect(screen.getByText("$250")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
