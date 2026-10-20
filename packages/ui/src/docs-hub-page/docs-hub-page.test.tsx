import { render, screen } from "@testing-library/react";

import Example from "../../registry/examples/docs-hub-page/krizaka";
import { axeViolations } from "../test/axe";
import { DocsHubPage } from "./index";

describe("DocsHubPage", () => {
  it("renders the template with its h1, its parts, and no axe violation", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("heading", { level: 1, name: "Build with Krizaka" })).toBeTruthy();
    expect(container.querySelectorAll(".kz-tpl-collection")).toHaveLength(4);
    expect(container.querySelector(".brand-orazaka")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Orazaka" }).getAttribute("href")).toBe("#orazaka");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("stacks the quick links of every collection with linksLayout=\"stack\", wraps them by default (#212)", () => {
    const collections = [{ id: "a", title: "A", href: "#a", links: [{ href: "#x", label: "X" }] }];
    const { container, rerender } = render(<DocsHubPage eyebrow="e" title="t" collectionsTitle="c" collections={collections} />);
    expect(container.querySelector('.kz-tpl-collection[data-links="wrap"]')).toBeTruthy();
    rerender(<DocsHubPage eyebrow="e" title="t" collectionsTitle="c" collections={collections} linksLayout="stack" />);
    expect(container.querySelector('.kz-tpl-collection[data-links="stack"]')).toBeTruthy();
  });

  it("is exported", () => {
    expect(typeof DocsHubPage).toBe("function");
  });
});
