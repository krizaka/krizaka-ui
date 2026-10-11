import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { MascotQuote } from "./index";

describe("MascotQuote", () => {
  it("is a quote and who says it, the bird decorative, with no axe violation", async () => {
    const { container } = render(
      <MascotQuote bird="falcon" label="The falcon's rule">
        Nothing crosses the walls.
      </MascotQuote>,
    );
    expect(container.querySelector("blockquote")?.textContent).toBe("Nothing crosses the walls.");
    expect(screen.getByText("The falcon's rule").closest("figcaption")).toBeTruthy();
    const bird = container.querySelector("svg") as SVGElement;
    expect(bird.getAttribute("aria-hidden")).toBe("true");
    expect(bird.hasAttribute("data-animated")).toBe(false);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is larger and alive as a callout", () => {
    const { container } = render(
      <MascotQuote bird="owl" label="The owl" variant="callout">
        Law 25.
      </MascotQuote>,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe("callout");
    expect(container.querySelector("svg")?.hasAttribute("data-animated")).toBe(true);
  });
});
