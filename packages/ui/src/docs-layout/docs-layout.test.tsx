import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DocsLayout } from "./index";

describe("DocsLayout", () => {
  it("renders the pages, the article and the contents, the pages folded for a phone, with no axe violation", async () => {
    const { container } = render(
      <DocsLayout sidebarLabel="Pages" sidebar={<ul><li><a href="#a">A</a></li></ul>} toc={<p>contents</p>}>
        <h1>Getting started</h1>
      </DocsLayout>,
    );
    expect(screen.getByRole("article").textContent).toBe("Getting started");
    expect(container.querySelector("details summary")?.textContent).toContain("Pages");
    expect(await axeViolations(container)).toEqual([]);
  });
});
