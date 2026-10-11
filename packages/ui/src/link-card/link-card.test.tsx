import { render, screen } from "@testing-library/react";
import type * as React from "react";

import { axeViolations } from "../test/axe";
import { LinkCard } from "./index";

const RouterLink = ({ href, ...props }: { href: string; className?: string; children?: React.ReactNode }) => <a data-router="" href={href} {...props} />;

describe("LinkCard", () => {
  it("is one link named by its text, through the router, lit by the pointer, with no axe violation", async () => {
    const { container } = render(<LinkCard href="/docs/ui" linkAs={RouterLink} icon={<svg />} title="Krizaka UI" description="Live components." cta="Open" />);
    const link = screen.getByRole("link");
    expect(link.textContent).toContain("Krizaka UI");
    expect(link.hasAttribute("data-router")).toBe(true);
    expect(link.hasAttribute("data-kz-light")).toBe(true);
    expect(screen.getByRole("heading", { level: 3, name: "Krizaka UI" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("opens an external address in a new tab", () => {
    render(<LinkCard href="https://github.com/krizaka" title="GitHub" titleAs="span" layout="stack" />);
    const link = screen.getByRole("link", { name: /GitHub/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.dataset.layout).toBe("stack");
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
