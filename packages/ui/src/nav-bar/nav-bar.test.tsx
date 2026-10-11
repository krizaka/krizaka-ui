import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { NavBar } from "./index";

function Bar() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home">Krizaka</NavBar.Brand>
      <NavBar.Items>
        <NavBar.Menu label="Products">
          <NavBar.MenuLink href="#a" title="Orazaka" description="Sovereign AI." />
          <NavBar.MenuLink href="#b" title="Orochia" />
        </NavBar.Menu>
        <NavBar.Link href="#story" active>
          Our story
        </NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          <NavBar.MobileLink href="#story" active>
            Our story
          </NavBar.MobileLink>
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}

describe("NavBar", () => {
  it("is a named navigation with the current page marked, and no axe violation", async () => {
    const { container } = render(<Bar />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
    const story = screen.getByRole("link", { name: "Our story" });
    expect(story.getAttribute("aria-current")).toBe("page");
    expect(story.hasAttribute("data-active")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("opens a menu from its trigger and closes it with Escape, the focus back on the trigger", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(await screen.findByRole("link", { name: /Orazaka/ })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("tightens once the page scrolls", () => {
    const { container } = render(<Bar />);
    const header = container.querySelector("header")!;
    expect(header.hasAttribute("data-compact")).toBe(false);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 120, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header.hasAttribute("data-compact")).toBe(true);
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("opens the mobile panel as a disclosure; a link or Escape closes it", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    const toggle = screen.getByRole("button", { name: "Open the menu" });
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("Close the menu");
    const panel = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(panel.tagName).toBe("NAV");
    await user.keyboard("{Escape}");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
    await user.click(toggle);
    await user.click(screen.getAllByRole("link", { name: "Our story" }).at(-1)!);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("places the light on the current page", () => {
    const { container } = render(<Bar />);
    const list = container.querySelector("ul")!;
    expect(list.getAttribute("data-indicator")).toBe("on");
    expect(list.style.getPropertyValue("--kz-ind-w")).toMatch(/px$/);
  });
});
