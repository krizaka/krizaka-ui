import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/status-page/operational";
import { axeViolations } from "../test/axe";
import { StatusPage } from "./index";

describe("StatusPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "How things are running" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("All systems operational");
    expect(screen.getByText("Slower than usual")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof StatusPage).toBe("function");
  });
});
