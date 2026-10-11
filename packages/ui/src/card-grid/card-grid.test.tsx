import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { CardGrid } from "./index";

describe("CardGrid", () => {
  it("wraps each card in a revealed cell, staggered by column", () => {
    const { container } = render(
      <CardGrid columns={2} min={240}>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </CardGrid>,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.getPropertyValue("--kz-cards-min")).toBe("240px");
    const cells = grid.querySelectorAll(".kz-cards-cell");
    expect(cells).toHaveLength(3);
    expect(cells[0]?.hasAttribute("data-reveal")).toBe(true);
    expect((cells[1] as HTMLElement).style.getPropertyValue("--kz-delay")).toBe("70ms");
    expect((cells[2] as HTMLElement).style.getPropertyValue("--kz-delay")).toBe("");
  });

  it("is a list with as='ul', without reveal, with no axe violation", async () => {
    const { container } = render(
      <CardGrid as="ul" reveal={false} fit="fit" align="start">
        <a href="#a">A</a>
        <a href="#b">B</a>
      </CardGrid>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelector("[data-reveal]")).toBeNull();
    expect(container.firstElementChild?.hasAttribute("data-fit")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });
});
