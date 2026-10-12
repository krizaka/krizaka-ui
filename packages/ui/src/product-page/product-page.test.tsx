import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/product-page/orazaka";
import { axeViolations } from "../test/axe";
import { ProductPage } from "./index";

describe("ProductPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "The AI that never leaves home" })).toBeTruthy();
    expect(container.firstElementChild?.className).toContain("brand-orazaka");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof ProductPage).toBe("function");
  });
});
