// The desktop form of the shell (ADR-002): the window of the Orazaka Mac app (Tauri 2). The title bar moves the window,
// there is no drawer, the top clears the traffic lights — and the native menu bar answers the shell's own keys.
import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { acceleratorOf, AppShell } from "./index";

function Window({ desktop = true }: { desktop?: boolean }) {
  return (
    <AppShell.Root desktop={desktop}>
      <AppShell.Sidebar label="Orazaka" brand="Orazaka" collapseLabels={["Collapse", "Expand"]} closeLabel="Close the menu">
        <AppShell.Item href="#models" icon={<svg aria-hidden />} label="Models" current shortcut="mod+1" />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Models" menuLabel="Open the menu" actions={<button type="button">Start</button>} />
        <AppShell.Main>content</AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}

describe("AppShell desktop (a desktop app's window)", () => {
  it("marks the shell, makes the header, its title and the sidebar's top the window's drag region — never a control", () => {
    const { container } = render(<Window />);
    expect(container.querySelector("[data-desktop]")).not.toBeNull();
    const header = screen.getByRole("banner");
    expect(header.hasAttribute("data-tauri-drag-region")).toBe(true);
    expect(screen.getByRole("heading", { name: "Models" }).hasAttribute("data-tauri-drag-region")).toBe(true);
    expect(screen.getByRole("button", { name: "Start" }).hasAttribute("data-tauri-drag-region")).toBe(false);
    const sidebar = screen.getByRole("navigation", { name: "Orazaka" });
    expect(sidebar.querySelectorAll("[data-tauri-drag-region]")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Models/ }).hasAttribute("data-tauri-drag-region")).toBe(false);
  });

  it("has no drawer: the menu button opens nothing (it is hidden), and the shell is still accessible", async () => {
    const { container } = render(<Window />);
    screen.getByRole("button", { name: "Open the menu" }).click();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("leaves the web shell as it was without `desktop`", () => {
    const { container } = render(<Window desktop={false} />);
    expect(container.querySelector("[data-desktop]")).toBeNull();
    expect(container.querySelector("[data-tauri-drag-region]")).toBeNull();
  });
});

describe("acceleratorOf (the native menu bar's keys)", () => {
  it("writes a combination as a Tauri/Electron accelerator", () => {
    expect(acceleratorOf("mod+k")).toBe("CmdOrCtrl+K");
    expect(acceleratorOf("shift+mod+/")).toBe("Shift+CmdOrCtrl+/");
    expect(acceleratorOf("alt+arrowup")).toBe("Alt+Up");
    expect(acceleratorOf("mod+,")).toBe("CmdOrCtrl+,");
    expect(acceleratorOf("mod+plus")).toBe("CmdOrCtrl+Plus");
    expect(acceleratorOf("esc")).toBe("Escape");
  });

  it("has none for a sequence: a menu item takes one chord", () => {
    expect(acceleratorOf("g d")).toBeUndefined();
  });
});
