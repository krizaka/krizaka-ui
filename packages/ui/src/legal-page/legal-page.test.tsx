import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/legal-page/privacy";
import { axeViolations } from "../test/axe";
import { LegalPage } from "./index";

describe("LegalPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Your rights" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof LegalPage).toBe("function");
  });
});
