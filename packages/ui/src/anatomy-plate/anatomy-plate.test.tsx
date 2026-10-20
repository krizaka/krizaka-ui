import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { AnatomyPlate } from "./index";

describe("AnatomyPlate", () => {
  it("draws the specimen between its numbered parts, alternating sides, the numbers in order, with no axe violation", async () => {
    const { container } = render(
      <AnatomyPlate
        title="Anatomy"
        subtitle="× 1.6"
        scale={1.6}
        parts={[
          { label: "the label", note: "a verb." },
          { label: "the fill", note: "the ink." },
          { label: "the focus", note: "always visible." },
        ]}
      >
        <button type="button">Publish</button>
      </AnatomyPlate>,
    );
    const [left, right] = [...container.querySelectorAll("ol.kz-anatomy-parts")] as HTMLOListElement[];
    expect(left.dataset.side).toBe("left");
    expect([...left.querySelectorAll("li")].map((li) => li.value)).toEqual([1, 3]);
    expect([...right.querySelectorAll("li")].map((li) => li.value)).toEqual([2]);
    expect(screen.getByRole("button", { name: "Publish" }).closest(".kz-anatomy-specimen")).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--kz-anatomy-scale")).toBe("1.6");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps a part on the side it is given", () => {
    const { container } = render(
      <AnatomyPlate parts={[{ label: "a", note: "x", side: "right" }, { label: "b", note: "y", side: "right" }]}>
        <span>specimen</span>
      </AnatomyPlate>,
    );
    expect(container.querySelector('ol[data-side="left"]')?.children).toHaveLength(0);
    expect(container.querySelector('ol[data-side="right"]')?.children).toHaveLength(2);
  });
});
