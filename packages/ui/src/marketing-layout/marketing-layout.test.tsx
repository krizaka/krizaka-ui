import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { MarketingLayout } from "./index";

describe("MarketingLayout", () => {
  it("starts with a link that skips to the main content, with no axe violation", async () => {
    const { container } = render(
      <MarketingLayout skipLabel="Skip to content" header={<nav aria-label="Main">bar</nav>} footer={<footer>©</footer>}>
        <h1>Page</h1>
      </MarketingLayout>,
    );
    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip.getAttribute("href")).toBe("#content");
    expect(screen.getByRole("main").id).toBe("content");
    expect(await axeViolations(container)).toEqual([]);
  });
});
