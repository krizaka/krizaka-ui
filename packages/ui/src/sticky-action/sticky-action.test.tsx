import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { StickyAction } from "./index";

describe("StickyAction", () => {
  it("holds its action at the bottom edge of a phone and is not drawn from md up", async () => {
    const { container } = render(
      <StickyAction data-testid="bar">
        <a href="#book">Book</a>
      </StickyAction>,
    );
    const cls = screen.getByTestId("bar").className;
    expect(cls).toContain("sticky");
    expect(cls).toContain("bottom-0");
    expect(cls).toContain("md:hidden");
    expect(cls).toContain("safe-area-inset-bottom");
    expect(screen.getByRole("link", { name: "Book" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
