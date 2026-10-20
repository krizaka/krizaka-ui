import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { PageIndex } from "./index";

describe("PageIndex", () => {
  it("is a named navigation of groups and entries with their page numbers; the current one is the page, no axe violation", async () => {
    const { container } = render(
      <PageIndex
        groups={[
          { title: "Actions", entries: [{ label: "Button", href: "/components/button", page: 42, current: true }, { label: "Confirm button", href: "/components/confirm-button", page: 43 }] },
          { title: "Forms", entries: [{ label: "Field", href: "/components/field", page: 55 }] },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Index" });
    expect(nav.className).toContain("kz-index");
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(["Actions", "Forms"]);
    const current = screen.getByRole("link", { name: /Button\s*42/ });
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.getAttribute("href")).toBe("/components/button");
    expect(screen.getByRole("link", { name: /Confirm button\s*43/ }).hasAttribute("aria-current")).toBe(false);
    expect(container.querySelector(".kz-index-leader")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders internal entries through the app's link and names the navigation", () => {
    const Link = ({ href, children, className }: { href: string; children?: React.ReactNode; className?: string }) => (
      <a data-router="" href={href} className={className}>
        {children}
      </a>
    );
    render(<PageIndex label="Components" linkAs={Link} groups={[{ title: "A", entries: [{ label: "Chip", href: "/components/chip" }] }]} />);
    expect(screen.getByRole("navigation", { name: "Components" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Chip" }).hasAttribute("data-router")).toBe(true);
  });
});
