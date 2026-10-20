import { fireEvent, render, screen } from "@testing-library/react";

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

  it("puts a foundation beside the frame of the cards, above by default and under with foundationPosition='end'", async () => {
    const { container, rerender } = render(
      <CardGrid foundation={<a href="#e">Engine</a>} foundationLabel="Powered by it" className="brand" reveal={false}>
        <div>a</div>
        <div>b</div>
      </CardGrid>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("kz-foundation");
    expect(root.className).toContain("brand");
    expect(root.getAttribute("data-position")).toBe("start");
    expect(root.querySelector(".kz-foundation-base")?.textContent).toBe("Engine");
    expect(root.querySelector(".kz-foundation-label")?.textContent).toBe("Powered by it");
    expect(root.querySelectorAll(".kz-foundation-group .kz-cards-cell")).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
    rerender(
      <CardGrid foundation={<a href="#e">Engine</a>} foundationPosition="end">
        <div>a</div>
      </CardGrid>,
    );
    expect((container.firstElementChild as HTMLElement).getAttribute("data-position")).toBe("end");
  });

  it("has one quiet hover: `hover` and `light` are deprecated no-ops, nothing follows the pointer", () => {
    const { container, rerender } = render(
      <CardGrid>
        <div data-kz-light="">a</div>
      </CardGrid>,
    );
    const grid = () => container.firstElementChild as HTMLElement;
    const cell = container.querySelector("[data-kz-light]") as HTMLElement;
    fireEvent.pointerMove(cell, { clientX: 30, clientY: 12 });
    expect(cell.style.getPropertyValue("--kz-pointer-x")).toBe("");
    rerender(
      <CardGrid hover="light" light>
        <div>a</div>
      </CardGrid>,
    );
    expect(grid().className).not.toMatch(/kz-hover-/);
  });
});
