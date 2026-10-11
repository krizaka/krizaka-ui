import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { LoaderGlyph, Spinner } from "./index";

describe("Spinner", () => {
  it("is a named status with its size, and no axe violation", async () => {
    const { container } = render(<Spinner label="Loading" size="lg" />);
    const spinner = screen.getByRole("status", { name: "Loading" });
    expect(spinner.dataset.size).toBe("lg");
    expect(spinner.getAttribute("class")).toContain("h-10");
    expect(spinner.tagName.toLowerCase()).toBe("svg");
    expect(spinner.getAttribute("aria-hidden")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("lets the product's className win", () => {
    render(<Spinner label="Loading" className="text-fg-secondary" />);
    const classes = (screen.getByRole("status").getAttribute("class") ?? "").split(" ");
    expect(classes).toContain("text-fg-secondary");
    expect(classes).not.toContain("text-accent");
  });

  it("grows its trace to a value and draws the ending of the glyph", () => {
    const { container, rerender } = render(<Spinner label="Uploading" value={0.42} />);
    expect(container.querySelector("svg")?.getAttribute("data-progress")).toBe("42");
    expect(container.querySelector(".kz-loader-trace")?.getAttribute("stroke-dasharray")).toBe("42 58");
    rerender(<LoaderGlyph state="success" />);
    expect(container.querySelector(".kz-loader-mark")).not.toBeNull();
    expect(container.querySelector(".kz-loader-node")).toBeNull();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
