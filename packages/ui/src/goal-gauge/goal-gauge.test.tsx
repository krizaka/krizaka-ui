import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { GoalGauge } from "./index";

describe("GoalGauge", () => {
  it("is a meter named by its label, with its value in words and no axe violation", async () => {
    const { container } = render(<GoalGauge label="Profile" segments={5} value={3} />);
    const meter = screen.getByRole("meter", { name: "Profile" });
    expect(meter.getAttribute("aria-valuenow")).toBe("3");
    expect(meter.getAttribute("aria-valuemax")).toBe("5");
    expect(meter.getAttribute("aria-valuetext")).toBe("3 / 5");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("clamps the value into the segments and lights that many cells", () => {
    render(<GoalGauge label="Goal" segments={4} value={9} valueText="All done" />);
    const meter = screen.getByRole("meter");
    expect(meter.getAttribute("aria-valuenow")).toBe("4");
    expect(meter.getAttribute("aria-valuetext")).toBe("All done");
    expect(meter.querySelectorAll("[data-lit]")).toHaveLength(4);
  });

  it("keeps at least one segment and hides the label row on demand", () => {
    render(<GoalGauge label="Goal" segments={0} value={-2} showLabel={false} />);
    const meter = screen.getByRole("meter");
    expect(meter.getAttribute("aria-valuemax")).toBe("1");
    expect(meter.getAttribute("aria-valuenow")).toBe("0");
    expect(meter.querySelector(".kzs-gauge-head")).toBeNull();
  });
});
