import { render, screen } from "@testing-library/react";
import type * as React from "react";

import { axeViolations } from "../test/axe";
import { LinkCard } from "./index";

const RouterLink = ({ href, ...props }: { href: string; className?: string; children?: React.ReactNode }) => <a data-router="" href={href} {...props} />;

describe("LinkCard", () => {
  it("is one link named by its text, through the router, with no axe violation", async () => {
    const { container } = render(<LinkCard href="/docs/ui" linkAs={RouterLink} icon={<svg />} title="Krizaka UI" description="Live components." cta="Open" />);
    const link = screen.getByRole("link");
    expect(link.textContent).toContain("Krizaka UI");
    expect(link.hasAttribute("data-router")).toBe(true);
    expect(link.hasAttribute("data-kz-light")).toBe(false);
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

  it("keeps the facts and the way in in one foot, pinned to the bottom unless footerAlign is top", () => {
    const { container, rerender } = render(<LinkCard href="/a" title="A" description="Text." extra={<span>Dev preview</span>} cta="Open" />);
    const foot = container.querySelector(".kz-link-card-foot");
    expect(foot?.textContent).toContain("Dev preview");
    expect(foot?.textContent).toContain("Open");
    expect(container.querySelector(".kz-link-card")?.hasAttribute("data-footer")).toBe(false);
    rerender(<LinkCard href="/a" title="A" description="Text." cta="Open" footerAlign="top" />);
    expect(container.querySelector(".kz-link-card")?.getAttribute("data-footer")).toBe("top");
    rerender(<LinkCard href="/a" title="A" description="Text." />);
    expect(container.querySelector(".kz-link-card-foot")).toBeNull();
  });

  it("has one quiet hover: `hover` is a deprecated no-op, no pointer light", () => {
    const { container, rerender } = render(<LinkCard href="/a" title="A" />);
    const card = () => container.querySelector(".kz-link-card") as HTMLElement;
    for (const hover of [undefined, "quiet", "light"] as const) {
      rerender(<LinkCard href="/a" title="A" hover={hover} />);
      expect(card().className).not.toMatch(/kz-hover-/);
      expect(card().hasAttribute("data-kz-light")).toBe(false);
    }
  });
});
