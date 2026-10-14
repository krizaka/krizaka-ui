import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { AppShell } from "./index";

function Shell(props: { defaultCollapsed?: boolean; skipLabel?: string }) {
  return (
    <AppShell.Root {...props}>
      <AppShell.Sidebar label="Studio" brand="Studio" collapseLabels={["Collapse", "Expand"]} closeLabel="Close the menu">
        <AppShell.Group>Main</AppShell.Group>
        <AppShell.Item href="#home" icon={<svg aria-hidden />} label="Home" current badge={3} />
        <AppShell.Item asChild label="Videos">
          <a href="#videos" data-router="" />
        </AppShell.Item>
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Home" menuLabel="Open the menu" actions={<button type="button">Upload</button>} />
        <AppShell.Main>content</AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}

describe("AppShell", () => {
  it("renders a named navigation, the current item, the header's h1 and the content, with no axe violation", async () => {
    const { container } = render(<Shell />);
    expect(screen.getByRole("navigation", { name: "Studio" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Home/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: /Videos/ }).hasAttribute("data-router")).toBe(true);
    expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeTruthy();
    expect(screen.getByRole("main").textContent).toBe("content");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("collapses to its icons, the words becoming titles", () => {
    render(<Shell />);
    const toggle = screen.getByRole("button", { name: "Collapse" });
    fireEvent.click(toggle);
    expect(screen.getByRole("navigation", { name: "Studio" }).hasAttribute("data-collapsed")).toBe(true);
    expect(screen.getByRole("link", { name: /Home/ }).getAttribute("title")).toBe("Home");
    expect(screen.getByRole("button", { name: "Expand" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the sidebar as a dialog from the header's menu button", () => {
    render(<Shell />);
    fireEvent.click(screen.getByRole("button", { name: "Open the menu" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Home");
    expect(screen.getByRole("button", { name: "Close the menu" })).toBeTruthy();
  });

  it("starts with a skip link that lands on the content, when it has the words for it", async () => {
    const user = userEvent.setup();
    render(<Shell skipLabel="Skip to content" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Skip to content" }));
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("main"));
  });

  it("has no skip link without words", () => {
    render(<Shell />);
    expect(screen.queryByRole("link", { name: /skip/i })).toBeNull();
  });

  it("folds the sidebar with ⌘/Ctrl+B, and not when the shortcut is turned off", () => {
    const { unmount } = render(<ShortcutShell />);
    fireEvent.keyDown(document.body, { key: "b", ctrlKey: true });
    expect(screen.getByRole("navigation", { name: "Studio" }).hasAttribute("data-collapsed")).toBe(true);
    fireEvent.keyDown(document.body, { key: "b", ctrlKey: true });
    expect(screen.getByRole("navigation", { name: "Studio" }).hasAttribute("data-collapsed")).toBe(false);
    unmount();
    render(<ShortcutShell collapseShortcut={false} />);
    fireEvent.keyDown(document.body, { key: "b", ctrlKey: true });
    expect(screen.getByRole("navigation", { name: "Studio" }).hasAttribute("data-collapsed")).toBe(false);
  });

  it("goes to a section with its shortcut, and shows the keys on the item", () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<ShortcutShell onVideos={onClick} />);
    const link = screen.getByRole("link", { name: /Videos/ });
    expect(link.querySelector("kbd")?.textContent).toBe("G");
    expect(link.getAttribute("aria-keyshortcuts")).toBeNull();
    expect(screen.getByRole("link", { name: /Home/ }).getAttribute("aria-keyshortcuts")).toMatch(/^(Meta|Control)\+1$/);
    fireEvent.keyDown(document.body, { key: "g" });
    fireEvent.keyDown(document.body, { key: "v" });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.body, { key: "1", ctrlKey: true });
    expect(screen.getByRole("link", { name: /Home/ })).toBeTruthy();
  });

  it("opens the command palette from the header's search, by click or by ⌘/Ctrl+K, and says its keys", async () => {
    const onOpen = vi.fn();
    const { container } = render(
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Header title="Home" menuLabel="Open the menu">
            <AppShell.Search label="Search" onOpen={onOpen} />
          </AppShell.Header>
          <AppShell.Main>content</AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>,
    );
    const search = screen.getByRole("button", { name: "Search" });
    expect(search.getAttribute("aria-keyshortcuts")).toMatch(/^(Meta|Control)\+K$/);
    expect(search.querySelectorAll("kbd").length).toBe(2);
    fireEvent.click(search);
    fireEvent.keyDown(document.body, { key: "k", ctrlKey: true });
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("does not listen for a section's shortcut in the drawer's copy of the sidebar", () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<ShortcutShell onVideos={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Open the menu" }));
    fireEvent.keyDown(document.body, { key: "g" });
    fireEvent.keyDown(document.body, { key: "v" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

function ShortcutShell({ collapseShortcut, onVideos }: { collapseShortcut?: string | false; onVideos?: (e: React.MouseEvent) => void }) {
  return (
    <AppShell.Root collapseShortcut={collapseShortcut}>
      <AppShell.Sidebar label="Studio" brand="Studio" collapseLabels={["Collapse", "Expand"]} closeLabel="Close the menu">
        <AppShell.Item href="#home" label="Home" current shortcut="mod+1" />
        <AppShell.Item href="#videos" label="Videos" shortcut="g v" onClick={onVideos} />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Home" menuLabel="Open the menu" />
        <AppShell.Main>content</AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
