import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/catalogue-page/components";
import { axeViolations } from "../test/axe";
import { CataloguePage } from "./index";

describe("CataloguePage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Components" })).toBeTruthy();
    expect(screen.getByText("6 components").getAttribute("aria-live")).toBe("polite");
    expect(container.querySelector("details.kz-tpl-catalogue-filters")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof CataloguePage).toBe("function");
  });
});
