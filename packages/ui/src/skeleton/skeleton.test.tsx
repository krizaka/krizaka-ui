import { render } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Skeleton } from "./index";

describe("Skeleton", () => {
  it("is decorative, exposes its shape, and has no axe violation", async () => {
    const { container } = render(<Skeleton shape="circle" />);
    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
    expect(skeleton.dataset.shape).toBe("circle");
    expect(skeleton.className).toContain("rounded-full");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    const { container } = render(<Skeleton className="h-5 w-1/2" />);
    const classes = (container.firstElementChild as HTMLElement).className.split(" ");
    expect(classes).toContain("h-5");
    expect(classes).not.toContain("h-3");
    expect(classes).toContain("w-1/2");
    expect(classes).not.toContain("w-full");
  });
});
