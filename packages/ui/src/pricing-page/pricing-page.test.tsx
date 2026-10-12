import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/pricing-page/credits";
import { axeViolations } from "../test/axe";
import { PricingPage } from "./index";

describe("PricingPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Pay once for what was done" })).toBeTruthy();
    expect(container.querySelector("[data-featured]")?.textContent).toContain("Workspace");
    expect(screen.getByRole("table")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof PricingPage).toBe("function");
  });
});
