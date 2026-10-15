import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { familyLabels, sites } from "../sites";
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

function FamilyBar({ labels = familyLabels.en }: { labels?: typeof familyLabels.en }) {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home">Krizaka UI</NavBar.Brand>
      <NavBar.Family current="ui" labels={labels} />
      <NavBar.Badge env="DEV" version="v1.2.3" />
      <NavBar.Items>
        <NavBar.Link href="#components" active>
          Components
        </NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/krizaka-ui" label="Source on GitHub" />
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          <NavBar.MobileLink href="#components">Components</NavBar.MobileLink>
          <NavBar.Family current="ui" labels={labels} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}

describe("NavBar.Family", () => {
  it("is its own named navigation with a chevron button, closed at first, and no axe violation", async () => {
    const { container } = render(<FamilyBar />);
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const trigger = within(family).getByRole("button", { name: "Krizaka family" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("opens with the keyboard, lists every site grouped, marks the current one, and Escape returns the focus", async () => {
    const user = userEvent.setup();
    render(<FamilyBar />);
    const trigger = screen.getByRole("button", { name: "Krizaka family" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const links = await within(family).findAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(sites.map((s) => s.url));
    for (const name of ["Krizaka", "Products", "Open source", "GitHub"]) expect(within(family).getByRole("list", { name })).toBeTruthy();
    const ui = within(family).getByRole("link", { name: /Krizaka UI/ });
    expect(ui.getAttribute("aria-current")).toBe("true");
    expect(ui.textContent).toContain("You are here");
    expect(within(family).getByRole("link", { name: /Yororis/ }).textContent).toContain("Under construction");
    expect(within(family).getByRole("link", { name: /Yasakia/ }).textContent).toContain("In development");
    await user.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("never opens on hover — a click opens it", async () => {
    const user = userEvent.setup();
    render(<FamilyBar />);
    const trigger = screen.getByRole("button", { name: "Krizaka family" });
    await user.hover(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders as the mobile panel's last group, in French with familyLabels.fr", async () => {
    const user = userEvent.setup();
    render(<FamilyBar labels={familyLabels.fr} />);
    await user.click(screen.getByRole("button", { name: "Open the menu" }));
    const panel = screen.getAllByRole("navigation", { name: "Main" }).find((n) => n.tagName === "NAV" && n.id)!;
    const group = within(panel).getByRole("group", { name: "Famille Krizaka" });
    expect(panel.lastElementChild).toBe(group);
    expect(within(group).getAllByRole("link")).toHaveLength(sites.length);
    expect(within(group).getByRole("list", { name: "Produits" })).toBeTruthy();
    expect(within(group).getByRole("link", { name: /Krizaka UI/ }).getAttribute("aria-current")).toBe("true");
    expect(within(group).getByRole("link", { name: /Yororis/ }).textContent).toContain("En construction");
  });

  it("says the family once in the mobile panel — the company's own group carries no second, duplicate heading", async () => {
    const user = userEvent.setup();
    render(<FamilyBar />);
    await user.click(screen.getByRole("button", { name: "Open the menu" }));
    const panel = screen.getAllByRole("navigation", { name: "Main" }).find((n) => n.tagName === "NAV" && n.id)!;
    const group = within(panel).getByRole("group", { name: "Krizaka family" });
    expect(within(group).getAllByText("Krizaka family")).toHaveLength(1);
    expect(within(group).queryByText(/^Krizaka$/, { selector: "p" })).toBeNull();
    for (const name of ["Products", "Open source", "GitHub"]) expect(within(group).getByText(name, { selector: "p" })).toBeTruthy();
  });

  it("shows the environment and the version, and the repository as a named icon link", () => {
    render(<FamilyBar />);
    expect(screen.getByText("DEV · v1.2.3")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Source on GitHub" }).getAttribute("href")).toBe("https://github.com/krizaka/krizaka-ui");
  });
});
