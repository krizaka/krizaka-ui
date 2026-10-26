import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Separator } from "./index";

describe("Separator", () => {
  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    const line = container.firstChild as HTMLElement;
    expect(line.getAttribute("role")).toBe("none");
    expect(line.className).toContain("h-px");
  });

  it("is a vertical separator for assistive technology when not decorative", () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const line = screen.getByRole("separator");
    expect(line.getAttribute("aria-orientation")).toBe("vertical");
    expect(line.className).toContain("w-px");
  });

  describe('variant="hand" (krizaka-ui#602)', () => {
    it.each(["stroke", "wave", "dash"] as const)("draws the %s as an inline SVG path stretched to the width, with a stroke that does not scale", async (shape) => {
      const { container } = render(<Separator variant="hand" shape={shape} />);
      const line = container.firstChild as HTMLElement;
      expect(line.dataset.variant).toBe("hand");
      expect(line.dataset.shape).toBe(shape);
      expect(line.getAttribute("role")).toBe("none");
      const svg = line.querySelector("svg") as SVGElement;
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.getAttribute("preserveAspectRatio")).toBe("none");
      const path = svg.querySelector("path") as SVGPathElement;
      expect(path.getAttribute("vector-effect")).toBe("non-scaling-stroke");
      expect(path.getAttribute("d")?.length).toBeGreaterThan(10);
      expect(await axeViolations(container)).toEqual([]);
    });

    it("is deterministic: the same shape draws the same path every time", () => {
      const a = render(<Separator variant="hand" shape="wave" />).container.querySelector("path")?.getAttribute("d");
      const b = render(<Separator variant="hand" shape="wave" />).container.querySelector("path")?.getAttribute("d");
      expect(a).toBe(b);
    });

    it("has a fixed 6 px height, so nothing shifts, and takes the hue at 60 % or the ink", () => {
      const hue = render(<Separator variant="hand" />).container.firstChild as HTMLElement;
      const ink = render(<Separator variant="hand" tone="ink" />).container.firstChild as HTMLElement;
      expect(hue.className).toContain("h-1.5");
      expect(hue.dataset.tone).toBe("hue");
      expect(ink.dataset.tone).toBe("ink");
    });

    it("keeps role=separator only when it is not decorative", () => {
      render(<Separator variant="hand" decorative={false} />);
      expect(screen.getByRole("separator")).toBeTruthy();
    });
  });
});
