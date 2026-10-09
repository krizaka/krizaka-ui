import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { Tabs } from "./index";

function Example({ variant, orientation }: { variant?: "underline" | "segmented" | "pills"; orientation?: "horizontal" | "vertical" }) {
  return (
    <Tabs.Root defaultValue="videos" variant={variant} orientation={orientation}>
      <Tabs.List aria-label="Profile">
        <Tabs.Trigger value="videos">Videos</Tabs.Trigger>
        <Tabs.Trigger value="stories">Stories</Tabs.Trigger>
        <Tabs.Trigger value="about" disabled>
          About
        </Tabs.Trigger>
        <Tabs.Trigger value="collections">Collections</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="videos">All videos</Tabs.Content>
      <Tabs.Content value="stories">All stories</Tabs.Content>
      <Tabs.Content value="about">About me</Tabs.Content>
      <Tabs.Content value="collections">All collections</Tabs.Content>
    </Tabs.Root>
  );
}

describe("Tabs", () => {
  it("wires tabs to their panels, with no axe violation", async () => {
    const { container } = render(<Example />);
    const tab = screen.getByRole("tab", { name: "Videos" });
    expect(tab.getAttribute("aria-selected")).toBe("true");
    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(screen.getByRole("tablist", { name: "Profile" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves and activates with the arrows, skips a disabled tab, wraps, Home and End", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Videos" }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Stories" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("All stories");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Collections" }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Videos" }));
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Collections" }));
    await user.keyboard("{Home}");
    expect(screen.getByRole("tabpanel").textContent).toBe("All videos");
  });

  it("uses the up and down arrows when vertical", async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("vertical");
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Stories" }));
  });

  it("carries its variant to the list and the tabs, and lets the className win", () => {
    render(
      <Tabs.Root defaultValue="a" variant="segmented">
        <Tabs.List aria-label="View" className="w-full">
          <Tabs.Trigger value="a" className="px-6">
            Grid
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">Grid</Tabs.Content>
      </Tabs.Root>,
    );
    const list = screen.getByRole("tablist");
    expect(list.dataset.variant).toBe("segmented");
    expect(list.className).toContain("rounded-xl");
    expect(list.className).toContain("w-full");
    const tab = screen.getByRole("tab");
    expect(tab.className).toContain("px-6");
    expect(tab.className).not.toContain("px-3");
    expect(tab.className).toContain("data-[state=active]:bg-accent");
  });
});
