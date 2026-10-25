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

describe("StickyAction task mode", () => {
  it("stays on every width and reads the total before the action", async () => {
    const { container } = render(
      <StickyAction mode="task" summary="Total $640" data-testid="bar">
        <button type="button">Send</button>
      </StickyAction>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar.className).not.toContain("md:hidden");
    expect(bar.className).toContain("sticky");
    const text = bar.textContent ?? "";
    expect(text.indexOf("Total $640")).toBeLessThan(text.indexOf("Send"));
    expect(await axeViolations(container)).toEqual([]);
  });
});
