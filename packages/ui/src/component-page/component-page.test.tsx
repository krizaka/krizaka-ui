import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/component-page/button";
import { axeViolations } from "../test/axe";
import { ComponentPage } from "./index";

describe("ComponentPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Button" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "When to use" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof ComponentPage).toBe("function");
  });
});
