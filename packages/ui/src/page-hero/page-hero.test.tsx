import { render, screen } from "@testing-library/react";
import type * as React from "react";

import { axeViolations } from "../test/axe";
import { PageHero } from "./index";

const RouterLink = ({ href, ...props }: { href: string; className?: string; children?: React.ReactNode }) => <a data-router="" href={href} {...props} />;

describe("PageHero", () => {
  it("renders the h1, the back link through the router, the lead and the aside, with no axe violation", async () => {
    const { container } = render(
      <PageHero title="Krizaka Java" eyebrow="Building block" lead="The foundation." back={{ href: "/open-source", label: "Open source" }} linkAs={RouterLink} aside={<span>bird</span>}>
        <p>facts</p>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Krizaka Java" })).toBeTruthy();
    const back = screen.getByRole("link", { name: /Open source/ });
    expect(back.hasAttribute("data-router")).toBe(true);
    expect(container.querySelector(".kz-hero-aside")?.textContent).toBe("bird");
    expect(container.firstElementChild?.tagName).toBe("HEADER");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("can stand without a backdrop, centred", () => {
    const { container } = render(<PageHero title="Hub" backdrop="none" align="center" aside={<span>x</span>} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).not.toContain("kz-backdrop");
    expect(el.dataset.align).toBe("center");
    expect(container.querySelector(".kz-hero-aside")).toBeNull();
  });
});
