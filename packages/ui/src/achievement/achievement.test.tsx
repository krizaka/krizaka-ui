import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Achievement, AchievementList } from "./index";

describe("Achievement", () => {
  it("says its title, its eyebrow and what it replaced, with no axe violation", async () => {
    const { container } = render(<Achievement title="First video" eyebrow="Milestone" replaced="Draft" />);
    expect(screen.getByText("First video")).toBeTruthy();
    expect(screen.getByText("Milestone")).toBeTruthy();
    expect(container.querySelector("del")?.textContent).toBe("Draft");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("marks a locked one, and hides its icon from assistive technology", () => {
    const { container } = render(<Achievement title="Locked" locked icon={<i>★</i>} eyebrow="Soon" />);
    expect(container.firstElementChild?.hasAttribute("data-locked")).toBe(true);
    expect(container.querySelector("[aria-hidden]")?.textContent).toBe("★");
  });
});

describe("AchievementList", () => {
  it("is a list with one item per achievement", () => {
    render(
      <AchievementList aria-label="Achievements">
        <Achievement title="One" />
        <Achievement title="Two" />
      </AchievementList>,
    );
    expect(screen.getByRole("list", { name: "Achievements" }).querySelectorAll("li").length).toBe(2);
  });
});
