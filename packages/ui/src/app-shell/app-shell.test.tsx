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
});
