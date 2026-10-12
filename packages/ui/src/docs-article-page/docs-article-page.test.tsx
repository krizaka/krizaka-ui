import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/docs-article-page/cli";
import { axeViolations } from "../test/axe";
import { DocsArticlePage } from "./index";

describe("DocsArticlePage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "The CLI" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(container.querySelector("a[rel=\"next\"]")?.textContent).toContain("Packs & Studios");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is exported", () => {
    expect(typeof DocsArticlePage).toBe("function");
  });
});
