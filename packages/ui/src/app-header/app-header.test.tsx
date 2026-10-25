import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";

import FamilyExample from "../../registry/examples/app-header/family";
import { axeViolations } from "../test/axe";
import { AppHeader, AppHeaderCount, countName, countText } from "./index";
import { AppHeaderSearch, isSearchShortcut } from "./search/index";

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

describe("AppHeader — the family's slots (#640)", () => {
  const order = ["search", "language", "actions", "messages", "notifications", "primary", "account"] as const;

  it("draws the controls in the family's order, whatever the props' order", () => {
    const slot = (id: string) => <button type="button" data-id={id}>{id}</button>;
    render(
      <AppHeader
        name="Yomizaka"
        account={slot("account")}
        primary={slot("primary")}
        notifications={slot("notifications")}
        messages={slot("messages")}
        actions={slot("actions")}
        language={slot("language")}
        search={slot("search")}
      />,
    );
    expect(screen.getAllByRole("button").map((b) => b.dataset.id)).toEqual([...order]);
  });

  it("hides an empty slot and draws no controls row when every slot is empty", () => {
    const { container, rerender } = render(<AppHeader name="Yomizaka" notifications={null} messages={false} />);
    expect(container.querySelector(".ml-auto")).toBeNull();
    rerender(<AppHeader name="Yomizaka" account={<button type="button">Account</button>} />);
    expect(container.querySelectorAll(".ml-auto > *")).toHaveLength(1);
  });

  it("keeps the controls whole at 360 px: the name truncates, the controls never shrink", () => {
    render(<AppHeader name="A very long product name for a phone" account={<button type="button">Account</button>} />);
    const banner = screen.getByRole("banner");
    expect(banner.querySelector(".truncate")?.textContent).toContain("A very long");
    expect(banner.querySelector(".ml-auto")!.className).toContain("shrink-0");
    expect(banner.querySelector("a, div")!.className).toContain("min-w-0");
  });

  it("composes the family's bar with no axe violation", async () => {
    const { container } = render(
      <AppHeader
        name="Yomizaka"
        messages={<AppHeaderCount label="Messages" icon={<svg />} count={2} countLabel="2 unread" href="/messages" current />}
        notifications={<AppHeaderCount label="Notifications" icon={<svg />} count={3} countLabel="3 new" />}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("AppHeaderCount", () => {
  it("says the count in its name, hides the digits from screen readers", () => {
    render(<AppHeaderCount label="Notifications" icon={<svg />} count={3} countLabel="3 nouvelles" />);
    const button = screen.getByRole("button", { name: "Notifications, 3 nouvelles" });
    expect(button.querySelector("[data-count]")!.getAttribute("aria-hidden")).toBe("true");
    expect(button.querySelector("[data-count]")!.textContent).toBe("3");
    expect(button.hasAttribute("data-unread")).toBe(true);
  });

  it("is the label alone with no badge at 0, and caps the badge at max+ while the name keeps the real count", () => {
    const { rerender } = render(<AppHeaderCount label="Messages" icon={<svg />} count={0} />);
    expect(screen.getByRole("button", { name: "Messages" }).querySelector("[data-count]")).toBeNull();
    rerender(<AppHeaderCount label="Messages" icon={<svg />} count={140} />);
    const button = screen.getByRole("button", { name: "Messages, 140" });
    expect(button.querySelector("[data-count]")!.textContent).toBe("99+");
  });

  it("is a link with href (or the router's link), current when on its page", () => {
    const Router = (props: React.ComponentProps<"a">) => <a data-router="" {...props} />;
    render(<AppHeaderCount label="Messages" icon={<svg />} href="/messages" linkAs={Router} current />);
    const link = screen.getByRole("link", { name: "Messages" });
    expect(link.getAttribute("href")).toBe("/messages");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.hasAttribute("data-router")).toBe(true);
  });

  it("spreads the props a popover's asChild passes (aria-expanded, onClick) onto its button", () => {
    const click = vi.fn();
    render(<AppHeaderCount label="Notifications" icon={<svg />} aria-expanded onClick={click} />);
    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    button.click();
    expect(click).toHaveBeenCalled();
  });

  it("formats counts: nothing at 0 or below, max+ above max", () => {
    expect(countText(0)).toBeNull();
    expect(countText(-2)).toBeNull();
    expect(countText(Number.NaN)).toBeNull();
    expect(countText(7)).toBe("7");
    expect(countText(100)).toBe("99+");
    expect(countText(12, 9)).toBe("9+");
    expect(countName("Messages", 0)).toBe("Messages");
    expect(countName("Messages", 4, "4 unread")).toBe("Messages, 4 unread");
  });
});

describe("AppHeaderSearch", () => {
  it("is a button named by its words at every width (sr-only below md), opening the palette on click", () => {
    const open = vi.fn();
    render(<AppHeaderSearch label="Search files and checks" onOpen={open} />);
    const button = screen.getByRole("button", { name: "Search files and checks" });
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-keyshortcuts")).toBe("Meta+K Control+K");
    expect(screen.getByText("Search files and checks").className).toContain("sr-only md:not-sr-only");
    fireEvent.click(button);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("opens the palette on ⌘K and Ctrl+K from anywhere, not on K alone or with Alt", () => {
    const open = vi.fn();
    render(<AppHeaderSearch label="Search" onOpen={open} />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    fireEvent.keyDown(window, { key: "K", ctrlKey: true });
    fireEvent.keyDown(window, { key: "k" });
    fireEvent.keyDown(window, { key: "k", metaKey: true, altKey: true });
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("has no shortcut with shortcut={false}, and stops listening when unmounted", () => {
    const open = vi.fn();
    const { unmount, rerender } = render(<AppHeaderSearch label="Search" onOpen={open} shortcut={false} />);
    expect(screen.getByRole("button").hasAttribute("aria-keyshortcuts")).toBe(false);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    rerender(<AppHeaderSearch label="Search" onOpen={open} />);
    unmount();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(open).not.toHaveBeenCalled();
    expect(isSearchShortcut({ key: "k", metaKey: false, ctrlKey: true, altKey: false }, "k")).toBe(true);
  });

  it("opens the family example's palette with ⌘K", async () => {
    render(<FamilyExample />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByRole("dialog", { name: "Search" })).toBeTruthy();
  });
});
