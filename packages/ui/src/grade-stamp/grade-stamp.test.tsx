import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { GradeStamp } from "./index";

describe("GradeStamp", () => {
  it("shows the grade and the remark as text and reads its source, with no axe violation", async () => {
    const { container } = render(<GradeStamp value={18} remark="Très bien, continue" source="Vitest coverage, 2026-10-23" />);
    const stamp = container.querySelector(".kz-grade") as HTMLElement;
    expect(stamp.querySelector(".kz-grade-score")?.textContent).toBe("18/20");
    expect(stamp.querySelector(".kz-grade-remark")?.textContent).toBe("Très bien, continue");
    expect(stamp.textContent).toContain("Source: Vitest coverage, 2026-10-23");
    expect(stamp.tabIndex).toBe(0);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("formats a decimal grade and takes its scale", () => {
    const { container } = render(<GradeStamp value={17.5} outOf={20} source="Lighthouse" />);
    expect(container.querySelector(".kz-grade-score")?.textContent).toBe("17.5/20");
    const fr = render(<GradeStamp value={17.5} source="Lighthouse" locale="fr" />);
    expect(fr.container.querySelector(".kz-grade-score")?.textContent).toBe("17,5/20");
  });

  it.each([
    ["not a number", Number.NaN, 20, "Vitest"],
    ["above the scale", 21, 20, "Vitest"],
    ["below zero", -1, 20, "Vitest"],
    ["a scale of zero", 0, 0, "Vitest"],
    ["no source", 18, 20, "  "],
  ])("renders nothing for a grade that cannot be real: %s", (_name, value, outOf, source) => {
    const { container } = render(<GradeStamp value={value} outOf={outOf} source={source} />);
    expect(container.innerHTML).toBe("");
  });
});
