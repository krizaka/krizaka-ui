import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Meter } from "./index";

describe("Meter", () => {
  it("is a named meter with its value in words, with no axe violation", async () => {
    const { container } = render(<Meter label="Storage" value={18} max={50} valueText="18 GB of 50 GB" showLabel />);
    const meter = screen.getByRole("meter", { name: "Storage" });
    expect(meter.getAttribute("aria-valuenow")).toBe("18");
    expect(meter.getAttribute("aria-valuemax")).toBe("50");
    expect(meter.getAttribute("aria-valuetext")).toBe("18 GB of 50 GB");
    expect(await axeViolations(container)).toEqual([]);
  });

  it.each([
    [10, "low", "success"],
    [80, "low", "warning"],
    [95, "low", "danger"],
    [10, "high", "danger"],
    [95, "high", "success"],
  ] as const)("tones %i with optimum %s as %s", (value, optimum, level) => {
    render(<Meter label="M" value={value} thresholds={{ low: 0.7, high: 0.9 }} optimum={optimum} />);
    expect(screen.getByRole("meter").dataset.level).toBe(level);
  });

  it("splits into parts with a legend, as a named group", async () => {
    const { container } = render(
      <Meter variant="ring" label="Split of a tip" parts={[{ label: "To the creator", value: 90, valueText: "€9.00" }, { label: "Platform", value: 10 }]} />,
    );
    const group = screen.getByRole("group", { name: "Split of a tip" });
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["To the creator€9.00", "Platform10 %"]);
    expect(group.querySelectorAll("circle")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });
});
