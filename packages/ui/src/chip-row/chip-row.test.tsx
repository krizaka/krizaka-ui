import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { ChipRow } from "./index";

const row = (
  <ChipRow label="For whom?" hint="Pick one.">
    <ChipRow.Item href="#a" selected>
      Tenants
    </ChipRow.Item>
    <ChipRow.Item href="#b">Landlords</ChipRow.Item>
    <ChipRow.Item href="#c" badge="Soon">
      Agencies
    </ChipRow.Item>
  </ChipRow>
);

describe("ChipRow", () => {
  it("is a nav named by its label, described by the hint, a list of links, with no axe violation", async () => {
    const { container } = render(row);
    const nav = screen.getByRole("navigation", { name: "For whom?" });
    expect(document.getElementById(nav.getAttribute("aria-describedby")!)?.textContent).toBe("Pick one.");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("marks the current item with aria-current and shows a badge", () => {
    render(row);
    expect(screen.getByRole("link", { name: "Tenants" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Landlords" }).getAttribute("aria-current")).toBeNull();
    expect(screen.getByRole("link", { name: /Agencies/ }).textContent).toContain("Soon");
  });

  it("gives every item a 44 px target, scrolls with snap on a phone and wraps from md", () => {
    render(row);
    expect(screen.getByRole("link", { name: "Tenants" }).className).toContain("min-h-11");
    const list = screen.getByRole("list");
    expect(list.className).toContain("snap-x");
    expect(list.className).toContain("overflow-x-auto");
    expect(list.className).toContain("md:flex-wrap");
  });

  it("moves focus with the arrows, Home and End", async () => {
    const user = userEvent.setup();
    render(row);
    screen.getByRole("link", { name: "Tenants" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Landlords" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: /Agencies/ }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: /Agencies/ }));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Tenants" }));
  });

  it("renders your router's link with asChild", () => {
    render(
      <ChipRow label="Tags">
        <ChipRow.Item asChild selected>
          <a href="/x" data-router>
            X
          </a>
        </ChipRow.Item>
      </ChipRow>,
    );
    const link = screen.getByRole("link", { name: "X" });
    expect(link.hasAttribute("data-router")).toBe(true);
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.className).toContain("min-h-11");
  });
});
