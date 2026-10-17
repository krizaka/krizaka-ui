import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { DocsNav } from "./index";

const groups = [
  { id: "guide", title: "Guide", items: [{ href: "/a", label: "A" }, { href: "/b", label: "B" }] },
  { id: "dev", title: "Developers", items: [{ href: "/c", label: "C" }] },
];

describe("DocsNav", () => {
  it("marks only the current page and opens only its group", async () => {
    const { container } = render(<DocsNav label="Docs" groups={groups} current="/b" />);
    expect(screen.getByRole("link", { name: "B" }).getAttribute("aria-current")).toBe("page");
    expect(container.querySelectorAll("[aria-current]").length).toBe(1);
    const open = [...container.querySelectorAll("details")].map((d) => d.open);
    expect(open).toEqual([true, false]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("opens every group when no page is current", () => {
    const { container } = render(<DocsNav label="Docs" groups={groups} />);
    expect([...container.querySelectorAll("details")].every((d) => d.open)).toBe(true);
  });
});
