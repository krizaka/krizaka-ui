import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { VerifiedBadge } from "./index";

describe("VerifiedBadge", () => {
  it("is an image named by its label, with no axe violation", async () => {
    const { container } = render(<VerifiedBadge label="Verified" />);
    expect(screen.getByRole("img", { name: "Verified" })).toBeTruthy();
    expect(container.textContent).toBe("");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("shows the words beside the seal without reading them twice", () => {
    render(<VerifiedBadge label="Verified" showLabel />);
    const badge = screen.getByRole("img", { name: "Verified" });
    expect(badge.textContent).toBe("Verified");
    expect(badge.querySelector("[aria-hidden]:not(svg)")?.textContent).toBe("Verified");
  });

  it("takes its size and the on-media ring", () => {
    render(<VerifiedBadge label="Verified" size="lg" onMedia />);
    const badge = screen.getByRole("img", { name: "Verified" });
    expect(badge.querySelector("svg")?.getAttribute("class")).toContain("h-5");
    expect(badge.className).toContain("text-fg-on-media");
  });
});
