import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { ChipLink, chipVariants } from "./index";

describe("ChipLink", () => {
  it("is a link, the current one marked, with no axe violation", async () => {
    const { container } = render(
      <nav aria-label="Tags">
        <ChipLink href="#a">All</ChipLink>
        <ChipLink href="#n" selected>
          Night
        </ChipLink>
      </nav>,
    );
    const night = screen.getByRole("link", { name: "Night" });
    expect(night.getAttribute("aria-current")).toBe("page");
    expect(night.dataset.state).toBe("on");
    expect(night.className).toContain("bg-accent-soft");
    expect(screen.getByRole("link", { name: "All" }).hasAttribute("aria-current")).toBe(false);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders a router link with asChild, and styles anything through chipVariants", () => {
    render(
      <ChipLink asChild selected current="true">
        <a href="#x">X</a>
      </ChipLink>,
    );
    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("true");
    expect(chipVariants({ size: "sm", selected: true })).toContain("h-7");
  });
});
