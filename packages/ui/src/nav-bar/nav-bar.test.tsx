import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { familyLabels, sites } from "../sites";
import { axeViolations } from "../test/axe";
import { NavBar, placePanel } from "./index";

function Bar() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home">Krizaka</NavBar.Brand>
      <NavBar.Items>
        <NavBar.Menu label="Products" inlineUpTo={0}>
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

function ProductBar() {
  return (
    <div>
      <p>The page</p>
      <NavBar.Root label="Main">
        <NavBar.Brand href="#home">Orazaka</NavBar.Brand>
        <NavBar.Items>
          <NavBar.Menu label="Product" inlineUpTo={0}>
            <NavBar.MenuLink href="#how" title="How it works" description="Install to first answer in three commands." />
            <NavBar.MenuLink href="#studios" title="Studios" description="Ready-made workflows." />
          </NavBar.Menu>
          <NavBar.Link href="#docs">Docs</NavBar.Link>
        </NavBar.Items>
        <NavBar.Actions>
          <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
            <NavBar.MobileGroup label="Product">
              <NavBar.MobileLink href="#how">How it works</NavBar.MobileLink>
              <NavBar.MobileLink href="#studios">Studios</NavBar.MobileLink>
            </NavBar.MobileGroup>
            <NavBar.MobileGroup label="Platforms">
              <NavBar.MobileLink href="#mac">Mac</NavBar.MobileLink>
            </NavBar.MobileGroup>
          </NavBar.Mobile>
        </NavBar.Actions>
      </NavBar.Root>
    </div>
  );
}

describe("NavBar.Menu — three links or fewer stand in the bar", () => {
  const Bar3 = ({ links = 3, inlineUpTo, inlineFrom = "md" }: { links?: number; inlineUpTo?: number; inlineFrom?: "md" | "lg" | "xl" }) => (
    <NavBar.Root label="Main">
      <NavBar.Items>
        <NavBar.Menu label="Product" inlineUpTo={inlineUpTo} inlineFrom={inlineFrom}>
          {["Overview", "How it works", "The demo shop", "Pricing"].slice(0, links).map((title, i) => (
            <NavBar.MenuLink key={title} href={`#${i}`} title={title} description="A line." active={i === 1} />
          ))}
        </NavBar.Menu>
        <NavBar.Link href="#docs">Docs</NavBar.Link>
      </NavBar.Items>
    </NavBar.Root>
  );

  it("renders three links as plain links of the bar, the current one marked, with no dropdown trigger", () => {
    render(<Bar3 />);
    expect(screen.queryByRole("button", { name: "Product" })).toBeNull();
    expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual(["Overview", "How it works", "The demo shop", "Docs"]);
    expect(screen.getByRole("link", { name: "How it works" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Overview" }).getAttribute("aria-current")).toBeNull();
  });

  it("stands in the bar only from `lg` by default: below it the section is the dropdown (long French labels, #tablet)", () => {
    render(<Bar3 inlineFrom="lg" />);
    // Both are in the markup; the classes choose by breakpoint (768 px: dropdown, 1024 px and up: the links).
    const trigger = screen.getByRole("button", { name: "Product" });
    expect(trigger.closest("li")?.className).toContain("lg:hidden");
    for (const name of ["Overview", "How it works", "The demo shop"]) expect(screen.getByRole("link", { name }).closest("li")?.className).toContain("max-lg:hidden");
  });

  it("inlineFrom=\"xl\" moves the switch to xl; the default is lg", () => {
    const { unmount } = render(<Bar3 inlineFrom="xl" />);
    expect(screen.getByRole("link", { name: "Overview" }).closest("li")?.className).toContain("max-xl:hidden");
    unmount();
    render(
      <NavBar.Root label="Main">
        <NavBar.Items>
          <NavBar.Menu label="Product">
            <NavBar.MenuLink href="#a" title="A" />
          </NavBar.Menu>
        </NavBar.Items>
      </NavBar.Root>,
    );
    expect(screen.getByRole("link", { name: "A" }).closest("li")?.className).toContain("max-lg:hidden");
  });

  it("keeps the dropdown above the limit", () => {
    render(<Bar3 links={4} />);
    expect(screen.getByRole("button", { name: "Product" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Overview" })).toBeNull();
  });

  it("takes the limit as a prop: 0 always makes a dropdown, a higher one inlines more", () => {
    const { unmount } = render(<Bar3 inlineUpTo={0} />);
    expect(screen.getByRole("button", { name: "Product" })).toBeTruthy();
    unmount();
    render(<Bar3 links={4} inlineUpTo={4} />);
    expect(screen.queryByRole("button", { name: "Product" })).toBeNull();
    expect(screen.getByRole("link", { name: "Pricing" })).toBeTruthy();
  });

  it("renders the router's link for asChild links", () => {
    render(
      <NavBar.Root label="Main">
        <NavBar.Items>
          <NavBar.Menu label="Product">
            <NavBar.MenuLink asChild title="Overview">
              <a data-router href="#o" />
            </NavBar.MenuLink>
          </NavBar.Menu>
        </NavBar.Items>
      </NavBar.Root>,
    );
    const link = screen.getByRole("link", { name: "Overview" });
    expect(link.hasAttribute("data-router")).toBe(true);
  });
});

describe("NavBar — the menus' intent and size", () => {
  it("does not open a menu when the pointer only passes over its trigger", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    const trigger = screen.getByRole("button", { name: "Product" });
    await user.hover(trigger);
    await user.unhover(trigger);
    await act(() => new Promise((r) => setTimeout(r, 120)));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the open menu when the pointer moves on to a plain link: one item lit at a time", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    const trigger = screen.getByRole("button", { name: "Product" });
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.hover(screen.getByRole("link", { name: "Docs" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the light on the open menu's trigger while the pointer is in its panel", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProductBar />);
    const list = container.querySelector("ul")!;
    await user.click(screen.getByRole("button", { name: "Product" }));
    await user.hover(await screen.findByRole("link", { name: /Studios/ }));
    expect(list.getAttribute("data-indicator")).toBe("on");
  });

  it("closes the open menu on a click outside", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    const trigger = screen.getByRole("button", { name: "Product" });
    await user.click(trigger);
    await user.click(screen.getByText("The page"));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("draws a panel wide enough for a description, never wider than the page between its gutters", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    await user.click(screen.getByRole("button", { name: "Product" }));
    const link = await screen.findByRole("link", { name: /How it works/ });
    const panel = link.parentElement!;
    expect(panel.className).toContain("w-[min(28rem,calc(100vw-2rem))]");
    expect(panel.className).not.toContain("w-max");
    expect(panel.className).toContain("max-h-[calc(100dvh-6rem)]");
  });

  it("wraps a description on two lines at most, at word boundaries, with an ellipsis after that — never a single truncated line", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    await user.click(screen.getByRole("button", { name: "Product" }));
    const link = await screen.findByRole("link", { name: /How it works/ });
    const text = screen.getByText("Install to first answer in three commands.");
    expect(text.className).toContain("line-clamp-2");
    expect(text.className).not.toContain("truncate");
    expect(text.className).toContain("wrap-break-word");
    // The icon tile stays at the top of the link when the description takes two lines.
    expect(link.className).toContain("items-start");
  });

  it("opens the panel under its trigger and keeps it inside the page", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProductBar />);
    await user.click(screen.getByRole("button", { name: "Product" }));
    await screen.findByRole("link", { name: /How it works/ });
    // happy-dom has no layout: the viewport carries the property the panel is placed with (set from measured rects).
    const viewport = container.querySelector<HTMLElement>("[class*='--kz-menu-left']");
    expect(viewport).toBeTruthy();
  });
});

describe("placePanel — a panel under its trigger, inside the page", () => {
  const panel = 448; // 28 rem
  it("aligns the panel's left edge with its trigger's at 1280 px", () => {
    expect(placePanel({ trigger: 300, root: 100, panel, window: 1280 })).toBe(200);
  });

  it("is pushed back from the right edge when it would overflow, with the gutter kept", () => {
    const left = placePanel({ trigger: 1100, root: 100, panel, window: 1280 });
    expect(100 + left + panel).toBeLessThanOrEqual(1280 - 16);
    expect(left).toBe(1280 - 16 - panel - 100);
  });

  it("never leaves the left gutter", () => {
    expect(placePanel({ trigger: 4, root: 0, panel, window: 1280 })).toBe(16);
  });

  it("fits at 360 px: a panel capped to the width between the gutters is placed at the left gutter", () => {
    const capped = 360 - 32; // w-[min(28rem,calc(100vw-2rem))]
    const left = placePanel({ trigger: 200, root: 0, panel: capped, window: 360 });
    expect(left).toBeGreaterThanOrEqual(16);
    expect(left + capped).toBeLessThanOrEqual(360 - 16);
  });

  it("fits the two-column panel at 768 px", () => {
    const capped = Math.min(640, 768 - 32);
    const left = placePanel({ trigger: 500, root: 24, panel: capped, window: 768 });
    expect(24 + left).toBeGreaterThanOrEqual(16);
    expect(24 + left + capped).toBeLessThanOrEqual(768 - 16);
  });
});

describe("NavBar.Language — one switch in the bar and in the mobile panel", () => {
  const languages = [
    { code: "en", name: "English", href: "/en" },
    { code: "fr", name: "Français", href: "/fr" },
  ];
  function WithLanguage() {
    return (
      <NavBar.Root label="Main">
        <NavBar.Brand href="#home">Yomizaka</NavBar.Brand>
        <NavBar.Actions>
          <NavBar.Language label="Langue" current="fr" languages={languages} />
          <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
            <NavBar.MobilePreferences label="Préférences">
              <NavBar.Language label="Langue" current="fr" languages={languages} />
            </NavBar.MobilePreferences>
          </NavBar.Mobile>
        </NavBar.Actions>
      </NavBar.Root>
    );
  }

  it("is a globe and the current code in the bar, never the other language", () => {
    render(<WithLanguage />);
    const trigger = screen.getByRole("button", { name: "Langue: Français" });
    expect(trigger.querySelector("[data-code]")?.getAttribute("data-code")).toBe("fr");
  });

  it("is a row of the languages by their own names inside the mobile panel's preferences", async () => {
    const user = userEvent.setup();
    render(<WithLanguage />);
    await user.click(screen.getByRole("button", { name: "Open the menu" }));
    const preferences = screen.getByRole("group", { name: "Préférences" });
    const row = within(preferences).getByRole("group", { name: "Langue" });
    expect(within(row).getAllByRole("link").map((a) => a.textContent)).toEqual(["English", "Français"]);
    expect(within(row).getByRole("link", { name: "English" }).getAttribute("hreflang")).toBe("en");
  });
});

describe("NavBar.Mobile — groups and dismissal", () => {
  it("groups the panel like the bar's menus, each group named by its heading, and no axe violation", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    await user.click(screen.getByRole("button", { name: "Open the menu" }));
    const product = screen.getByRole("group", { name: "Product" });
    expect(within(product).getAllByRole("link").map((a) => a.textContent)).toEqual(["How it works", "Studios"]);
    expect(within(screen.getByRole("group", { name: "Platforms" })).getByRole("link", { name: "Mac" })).toBeTruthy();
    // The panel itself (in a browser the desktop list, also named “Main”, is hidden below md — happy-dom has no CSS).
    expect(await axeViolations(product.closest("nav")!)).toEqual([]);
  });

  it("closes on a press outside the panel", async () => {
    const user = userEvent.setup();
    render(<ProductBar />);
    const toggle = screen.getByRole("button", { name: "Open the menu" });
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    await user.click(screen.getByText("The page"));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});

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
    // The pointer is still on the trigger: let the hover-intent timer (200 ms) run its course, or it would reopen the
    // menu right after Escape closed it (what made this test flaky on slow runners).
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    await user.keyboard("{Escape}");
    // Radix closes on its own tick (and the hover-intent timer may still be pending on a loaded runner): wait, don't race.
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
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
    expect(within(family).getByRole("link", { name: /Yomizaka/ }).textContent).toContain("In development");
    expect(within(family).getByRole("link", { name: /Akinaza/ }).textContent).toContain("In development");
    // The paused products (2026-10-25) are out of the family.
    for (const name of [/Orochia/, /Yasakia/, /Yororis/, /Kachizaka/]) expect(within(family).queryByRole("link", { name })).toBeNull();
    await user.keyboard("{Escape}");
    // Radix closes on its own tick (and the hover-intent timer may still be pending on a loaded runner): wait, don't race.
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
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

  it("closes on a click away and on a second click of the trigger (#261)", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <FamilyBar />
        <button type="button">Elsewhere</button>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Krizaka family" });
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(trigger);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
  });

  it("closes when a family link is chosen (#261)", async () => {
    const user = userEvent.setup();
    render(<FamilyBar />);
    const trigger = screen.getByRole("button", { name: "Krizaka family" });
    await user.click(trigger);
    const link = await screen.findByRole("link", { name: /Krizaka Java/ });
    link.addEventListener("click", (e) => e.preventDefault());
    await user.click(link);
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
  });

  it("renders as the mobile panel's last group, in French with familyLabels.fr", async () => {
    const user = userEvent.setup();
    render(<FamilyBar labels={familyLabels.fr} />);
    await user.click(screen.getByRole("button", { name: "Open the menu" }));
    const panel = screen.getAllByRole("navigation", { name: "Main" }).find((n) => n.tagName === "NAV" && n.id)!;
    const group = within(panel).getByRole("group", { name: "Famille Krizaka" });
    // the panel's content sits in one display:contents wrapper (the delegated link-close handler): the group is still its last child
    expect(panel.lastElementChild?.lastElementChild).toBe(group);
    expect(within(group).getAllByRole("link")).toHaveLength(sites.length);
    expect(within(group).getByRole("list", { name: "Produits" })).toBeTruthy();
    expect(within(group).getByRole("link", { name: /Krizaka UI/ }).getAttribute("aria-current")).toBe("true");
    expect(within(group).getByRole("link", { name: /Yomizaka/ }).textContent).toContain("En développement");
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

describe("NavBar.Brand with the organisation's facts (@krizaka/org)", () => {
  it("is the Krizaka mark and the org's brand name, linking home, when it has no children", () => {
    render(
      <NavBar.Root label="Main">
        <NavBar.Brand href="https://www.krizaka.com" org={{ brand: { name: "Krizaka" } }} />
      </NavBar.Root>,
    );
    const brand = screen.getByRole("link", { name: "Krizaka" });
    expect(brand.getAttribute("href")).toBe("https://www.krizaka.com");
    expect(brand.querySelector("svg")).not.toBeNull();
  });

  it("lets its children win (a product's own brand)", () => {
    render(
      <NavBar.Root label="Main">
        <NavBar.Brand href="#home" org={{ brand: { name: "Krizaka" } }}>
          Orazaka
        </NavBar.Brand>
      </NavBar.Root>,
    );
    expect(screen.getByRole("link", { name: "Orazaka" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Krizaka" })).toBeNull();
  });
});
