import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { AppHeader } from "./index";

describe("AppHeader", () => {
  it("shows the name as text, the chips and the actions, with no axe violation", async () => {
    const { container } = render(<AppHeader name="Orazaka" chips={<span>Local</span>} actions={<button type="button">Account</button>} />);
    expect(screen.getByRole("banner").textContent).toContain("Orazaka");
    expect(screen.getByText("Local")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Account" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("carries the mark below md only (the rail carries it above)", () => {
    const { container } = render(<AppHeader name="Orazaka" mark={<i>M</i>} />);
    const mark = container.querySelector("[data-brand-mark]")!;
    expect(mark.className).toContain("md:hidden");
    expect(mark.className).not.toMatch(/(^|\s)hidden(\s|$)/);
  });

  it("makes the name a link home with an href or with the router's link", () => {
    const { rerender } = render(<AppHeader name="Orazaka" href="/" />);
    expect(screen.getByRole("link", { name: "Orazaka" }).getAttribute("href")).toBe("/");
    rerender(<AppHeader name="Orazaka" homeLink={<a href="/home" data-router="" />} />);
    expect(screen.getByRole("link", { name: "Orazaka" }).hasAttribute("data-router")).toBe(true);
  });

  it("lines the name up with the rail: the bar is 3.5 rem tall like the rail's mark, and the name sits close to the rail", () => {
    render(<AppHeader name="Orazaka" />);
    const cls = screen.getByRole("banner").className;
    expect(cls).toContain("h-14");
    expect(cls).toContain("md:pl-3");
  });
});
