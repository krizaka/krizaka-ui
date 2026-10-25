import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppHeader } from "../app-header";
import { axeViolations } from "../test/axe";
import { RailNav } from "./index";

const svg = <svg aria-hidden />;
const mark = (name: string) => <a href="#home" aria-label={`${name}, home`}>M</a>;

function Layout(props: { expandable?: boolean; defaultExpanded?: boolean; accent?: "orazaka" }) {
  return (
    <RailNav.Shell>
      <RailNav.Root label="Orazaka" mark={mark("Orazaka")} footer={<RailNav.Item href="#settings" icon={svg} label="Settings" />} expandLabels={["Show the words", "Hide the words"]} {...props}>
        <RailNav.Item href="#home" icon={svg} label="Home" current />
        <RailNav.Item href="#studios" icon={svg} label="Studios" />
        <RailNav.Item asChild icon={svg} label="Chat" badge={2} badgeLabel="2 unread">
          <a href="#chat" data-router="" />
        </RailNav.Item>
      </RailNav.Root>
      <RailNav.Body>
        <AppHeader name="Orazaka" mark="M" chips={<span>Local</span>} />
        <main>content</main>
      </RailNav.Body>
    </RailNav.Shell>
  );
}

/** happy-dom has no media queries: a mark's visibility at a width is read from the display utilities of itself and its ancestors. */
function visibleAt(el: Element, width: "phone" | "desktop"): boolean {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const c = new Set((n.getAttribute("class") ?? "").split(/\s+/));
    const showsFromMd = [...c].some((k) => /^md:(flex|block|inline-flex|grid|inline)$/.test(k));
    if (width === "phone" && (c.has("hidden") || c.has("max-md:hidden"))) return false;
    if (width === "desktop" && (c.has("md:hidden") || (c.has("hidden") && !showsFromMd))) return false;
  }
  return true;
}

describe("RailNav", () => {
  it("is a named navigation; the current item is marked; every item is named (the count in words too); no axe violation", async () => {
    const { container } = render(<Layout />);
    expect(screen.getByRole("navigation", { name: "Orazaka" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Studios" }).hasAttribute("aria-current")).toBe(false);
    expect(screen.getByRole("link", { name: "Chat, 2 unread" }).hasAttribute("data-router")).toBe(true);
    expect(screen.getByRole("link", { name: "Settings" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves the focus with the arrows, wrapping, and with Home and End", async () => {
    const user = userEvent.setup();
    render(<Layout />);
    const names = () => (document.activeElement as HTMLElement).getAttribute("aria-label");
    screen.getByRole("link", { name: "Home" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(names()).toBe("Studios");
    await user.keyboard("{ArrowRight}");
    expect(names()).toBe("Chat, 2 unread");
    await user.keyboard("{ArrowDown}");
    expect(names()).toBe("Settings");
    await user.keyboard("{ArrowDown}");
    expect(names()).toBe("Home");
    await user.keyboard("{ArrowUp}");
    expect(names()).toBe("Settings");
    await user.keyboard("{Home}");
    expect(names()).toBe("Home");
    await user.keyboard("{End}");
    expect(names()).toBe("Settings");
    await user.keyboard("{ArrowLeft}");
    expect(names()).toBe("Chat, 2 unread");
  });

  it("is not expandable unless asked; then a toggle widens it and says so", () => {
    const { rerender } = render(<Layout />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<Layout expandable />);
    const nav = screen.getByRole("navigation", { name: "Orazaka" });
    const toggle = screen.getByRole("button", { name: "Show the words" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(nav.hasAttribute("data-expanded")).toBe(false);
    fireEvent.click(toggle);
    expect(nav.hasAttribute("data-expanded")).toBe(true);
    expect(screen.getByRole("button", { name: "Hide the words" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("scopes the product's brand over the rail", () => {
    render(<Layout accent="orazaka" />);
    expect(screen.getByRole("navigation", { name: "Orazaka" }).className).toContain("brand-orazaka");
  });

  it("says each icon in a tooltip on a collapsed rail (keyboard focus shows it, Escape dismisses it)", async () => {
    const user = userEvent.setup();
    render(<Layout />);
    await user.tab();
    await user.tab(); // the mark, then the first item
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Home");
    const tip = await screen.findByRole("tooltip");
    expect(tip.textContent).toBe("Home");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("puts the words on the rows of an expanded rail instead of tooltips", async () => {
    const user = userEvent.setup();
    render(<Layout expandable defaultExpanded />);
    expect(screen.getByRole("navigation", { name: "Orazaka" }).hasAttribute("data-expanded")).toBe(true);
    await user.tab();
    await user.tab();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Home");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("keeps the tab bar clear of the content on a phone and gives the tabs a 56 px bar", () => {
    render(<Layout />);
    expect(screen.getByRole("navigation", { name: "Orazaka" }).className).toContain("h-[calc(3.5rem+env(safe-area-inset-bottom))]");
    expect(screen.getByText("content").parentElement?.className).toContain("pb-[calc(3.5rem+env(safe-area-inset-bottom))]");
  });
});

describe("one brand mark per width (RailNav + AppHeader)", () => {
  it.each(["phone", "desktop"] as const)("shows exactly one mark on %s", (width) => {
    const { container } = render(<Layout />);
    const marks = [...container.querySelectorAll("[data-brand-mark]")].filter((m) => visibleAt(m, width));
    expect(marks).toHaveLength(1);
  });

  it("puts it in the rail on a desktop and in the header on a phone", () => {
    const { container } = render(<Layout />);
    const at = (width: "phone" | "desktop") => [...container.querySelectorAll("[data-brand-mark]")].find((m) => visibleAt(m, width));
    expect(at("desktop")?.closest("nav")).not.toBeNull();
    expect(at("phone")?.closest("header")).not.toBeNull();
  });

  it("keeps the product's name as text in the header at both widths", () => {
    const { container } = render(<Layout />);
    const name = [...container.querySelectorAll("header span")].find((s) => s.textContent === "Orazaka")!;
    expect(visibleAt(name, "phone") && visibleAt(name, "desktop")).toBe(true);
  });
});

describe("RailNav — shortcuts and the wide default (#647)", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });
  const wideWindow = (wide: boolean) => {
    const listeners = new Set<() => void>();
    window.matchMedia = ((query: string) => ({
      matches: wide && query === "(min-width: 80rem)",
      media: query,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    })) as unknown as typeof window.matchMedia;
    return listeners;
  };
  const Shortcuts = (props: { defaultExpanded?: boolean }) => (
    <RailNav.Root
      label="Akinaza"
      expandable
      expandLabels={["Show the words", "Hide the words"]}
      shortcutsLabel="Shortcuts"
      shortcuts={<RailNav.Item href="#new" icon={svg} label="New invoice" />}
      footer={<RailNav.Item href="#settings" icon={svg} label="Settings" />}
      {...props}
    >
      <RailNav.Item href="#today" icon={svg} label="Today" current />
    </RailNav.Root>
  );

  it("puts the shortcuts in a named group above the footer and the toggle, desktop only", async () => {
    wideWindow(false);
    const { container } = render(<Shortcuts />);
    const group = screen.getByRole("group", { name: "Shortcuts" });
    expect(group.className).toContain("hidden md:flex");
    expect(group.contains(screen.getByRole("link", { name: "New invoice" }))).toBe(true);
    const order = [...container.querySelectorAll("[data-rail-item]")].map((el) => el.getAttribute("aria-label") ?? el.textContent);
    expect(order).toEqual(["Today", "New invoice", "Settings", "Show the words"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is expanded by default from 1280 px and narrow below, until the person toggles it", async () => {
    wideWindow(true);
    const { unmount } = render(<Shortcuts />);
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(true);
    await userEvent.setup().click(screen.getByRole("button", { name: "Hide the words" }));
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(false);
    unmount();
    wideWindow(false);
    render(<Shortcuts />);
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(false);
  });

  it("keeps an explicit defaultExpanded={false} narrow even on a wide window", () => {
    wideWindow(true);
    render(<Shortcuts defaultExpanded={false} />);
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(false);
  });

  it("follows the window when it crosses 1280 px", () => {
    let wide = false;
    const listeners = new Set<() => void>();
    window.matchMedia = ((query: string) => ({
      get matches() {
        return wide;
      },
      media: query,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    })) as unknown as typeof window.matchMedia;
    render(<Shortcuts />);
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(false);
    wide = true;
    act(() => listeners.forEach((fn) => fn()));
    expect(screen.getByRole("navigation").hasAttribute("data-expanded")).toBe(true);
  });
});
