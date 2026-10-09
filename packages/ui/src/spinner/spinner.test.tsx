import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { Spinner } from "./index";

describe("Spinner", () => {
  it("is a named status with its size, and no axe violation", async () => {
    const { container } = render(<Spinner label="Loading" size="lg" />);
    const spinner = screen.getByRole("status", { name: "Loading" });
    expect(spinner.dataset.size).toBe("lg");
    expect(spinner.getAttribute("class")).toContain("h-10");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    render(<Spinner label="Loading" className="text-fg-secondary" />);
    const classes = (screen.getByRole("status").getAttribute("class") ?? "").split(" ");
    expect(classes).toContain("text-fg-secondary");
    expect(classes).not.toContain("text-accent");
  });
});
