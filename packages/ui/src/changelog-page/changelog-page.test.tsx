import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/changelog-page/releases";
import { axeViolations } from "../test/axe";
import { ChangelogPage } from "./index";

describe("ChangelogPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "What changed" })).toBeTruthy();
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe("2026-10-11");
    expect(screen.getAllByText("Added")).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof ChangelogPage).toBe("function");
  });
});
