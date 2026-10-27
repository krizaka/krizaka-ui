import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LibraryExample from "../../registry/examples/desktop-window/library";
import { axeViolations } from "../test/axe";
import { desktopMenus, DesktopWindow, type DesktopWindowProps } from "./index";
import { clamp, dragged, keyed, paneMax } from "./panes";

const labels = { sidebar: "Library", inspector: "Details", resizeSidebar: "Resize the sidebar", resizeInspector: "Resize the inspector", toggleSidebar: "Show or hide the sidebar", toggleInspector: "Show or hide the inspector" };
const limits = { min: 180, max: 360 };

describe("the panes' arithmetic", () => {
  it("clamps a size, and the content keeps its room: the ceiling falls with the window", () => {
    expect([100, 240, 900].map((v) => clamp(v, 180, 360))).toEqual([180, 240, 360]);
    expect(paneMax(limits, 1280, 300, 360, 0)).toBe(360);
    expect(paneMax(limits, 800, 300, 360, 0)).toBe(180);
    expect(paneMax(limits, 900, 300, 360, 0)).toBe(240);
  });

  it("a drag follows the pointer along the reading direction: mirrored in right-to-left, and for the end pane", () => {
    expect(dragged(240, 40, 1, 1, limits)).toBe(280);
    expect(dragged(240, 40, -1, 1, limits)).toBe(200);
    expect(dragged(300, 40, 1, -1, { min: 240, max: 480 })).toBe(260);
    expect(dragged(240, 500, 1, 1, limits)).toBe(360);
    expect(dragged(240, 500, 1, 1, limits, 300)).toBe(300);
    expect(dragged(240, -500, 1, 1, limits)).toBe(180);
  });

  it("the arrows grow the pane that points away from its edge, 16 px (64 with Shift); Home and End go to the ends", () => {
    expect(keyed("ArrowRight", 240, 1, 1, limits, false)).toBe(256);
    expect(keyed("ArrowLeft", 240, 1, 1, limits, false)).toBe(224);
    expect(keyed("ArrowRight", 240, 1, 1, limits, true)).toBe(304);
    expect(keyed("ArrowRight", 240, -1, 1, limits, false)).toBe(224);
    expect(keyed("ArrowLeft", 300, 1, -1, { min: 240, max: 480 }, false)).toBe(316);
    expect(keyed("Home", 240, 1, 1, limits, false)).toBe(180);
    expect(keyed("End", 240, 1, 1, limits, false, 300)).toBe(300);
    expect(keyed("a", 240, 1, 1, limits, false)).toBeNull();
  });
});

describe("desktopMenus", () => {
  const run = () => undefined;
  it("groups the commands into menus, gives the menu the accelerator of the chord, and the page its shortcuts", () => {
    const m = desktopMenus([
      { id: "view.sidebar", menu: "View", label: "Hide sidebar", shortcut: "mod+b", run },
      { id: "view.inspector", menu: "View", label: "Show inspector", shortcut: "mod+alt+i", run, separated: true },
      { id: "file.new", menu: "File", label: "New file", shortcut: "mod+n", run, enabled: false },
      { id: "go.files", menu: "Go", label: "Files", shortcut: "g f", run },
    ]);
    expect(m.menus.map((x) => x.title)).toEqual(["View", "File", "Go"]);
    expect(m.menus[0]?.items).toEqual([
      { id: "view.sidebar", label: "Hide sidebar", accelerator: "CmdOrCtrl+B" },
      { id: "view.inspector", label: "Show inspector", accelerator: "CmdOrCtrl+Alt+I", separated: true },
    ]);
    expect(m.menus[1]?.items[0]).toMatchObject({ enabled: false });
    expect(m.menus[2]?.items[0]).toEqual({ id: "go.files", label: "Files" });
    expect(Object.keys(m.shortcuts)).toEqual(["mod+b", "mod+alt+i", "mod+n", "g f"]);
    expect(Object.keys(m.handlers)).toEqual(["view.sidebar", "view.inspector", "file.new", "go.files"]);
  });

  it("refuses an id the native side would refuse, a repeat, and one chord on two commands", () => {
    expect(() => desktopMenus([{ id: "View.Sidebar", menu: "View", label: "x", run }])).toThrow(/not a menu id/);
    expect(() => desktopMenus([{ id: "a", menu: "V", label: "x", run }, { id: "a", menu: "V", label: "y", run }])).toThrow(/declared twice/);
    expect(() => desktopMenus([{ id: "a", menu: "V", label: "x", shortcut: "mod+b", run }, { id: "b", menu: "V", label: "y", shortcut: "Mod+B", run }])).toThrow(/two commands/);
  });
});

function Window(props: Partial<DesktopWindowProps> = {}) {
  return (
    <DesktopWindow labels={labels} title="Files" sidebar={<a href="#all">All files</a>} inspector={<p>Details of one</p>} toolbarEnd={<button type="button">New</button>} {...props}>
      <p>content</p>
    </DesktopWindow>
  );
}

describe("DesktopWindow", () => {
  beforeEach(() => {
    Element.prototype.setPointerCapture = vi.fn();
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({ width: 1280, height: 800, top: 0, left: 0, right: 1280, bottom: 800, x: 0, y: 0, toJSON: () => ({}) });
  });
  afterEach(() => vi.restoreAllMocks());

  it("is three panes under a toolbar: landmarks named by the words, the window's density, the desktop marker", () => {
    const { container } = render(<Window />);
    expect(container.querySelector("[data-desktop]")).not.toBeNull();
    expect(screen.getByRole("complementary", { name: "Library" })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "Details" })).toBeTruthy();
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("main").textContent).toBe("content");
    expect(container.firstElementChild?.className).toContain("text-[13px]");
  });

  it("the toolbar moves the window — its bar and its title — and never a control; folded, it clears the traffic lights", () => {
    const { container } = render(<Window defaultSidebarOpen={false} />);
    expect(screen.getByRole("banner").hasAttribute("data-tauri-drag-region")).toBe(true);
    expect(screen.getByText("Files").hasAttribute("data-tauri-drag-region")).toBe(true);
    for (const button of screen.getAllByRole("button")) expect(button.hasAttribute("data-tauri-drag-region"), button.textContent || button.getAttribute("aria-label") || "").toBe(false);
    expect(container.querySelector("[data-sidebar=closed]")).not.toBeNull();
    expect(screen.getByRole("banner").className).toContain("traffic-lights-inset");
  });

  it("the dividers are separators with their size, and the arrows resize their pane", async () => {
    const user = userEvent.setup();
    const onSizes = vi.fn();
    render(<Window onSizesChange={onSizes} />);
    const side = screen.getByRole("separator", { name: "Resize the sidebar" });
    expect(side.getAttribute("aria-valuenow")).toBe("240");
    expect(side.getAttribute("aria-valuemin")).toBe("180");
    expect(side.getAttribute("aria-valuemax")).toBe("360");
    side.focus();
    await user.keyboard("{ArrowRight}");
    expect(side.getAttribute("aria-valuenow")).toBe("256");
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(side.getAttribute("aria-valuenow")).toBe("192");
    await user.keyboard("{End}");
    expect(side.getAttribute("aria-valuenow")).toBe("360");
    await user.keyboard("{Home}");
    expect(side.getAttribute("aria-valuenow")).toBe("180");
    const insp = screen.getByRole("separator", { name: "Resize the inspector" });
    insp.focus();
    await user.keyboard("{ArrowLeft}");
    expect(insp.getAttribute("aria-valuenow")).toBe("316");
    expect(onSizes).toHaveBeenLastCalledWith({ sidebar: 180, inspector: 316 });
  });

  it("a drag with the pointer resizes, within the limits", () => {
    render(<Window />);
    const side = screen.getByRole("separator", { name: "Resize the sidebar" });
    fireEvent.pointerDown(side, { button: 0, clientX: 240, pointerId: 1 });
    fireEvent.pointerMove(side, { clientX: 300, pointerId: 1 });
    expect(side.getAttribute("aria-valuenow")).toBe("300");
    expect(side.hasAttribute("data-active")).toBe(true);
    fireEvent.pointerMove(side, { clientX: 900, pointerId: 1 });
    expect(side.getAttribute("aria-valuenow")).toBe("360");
    fireEvent.pointerUp(side, { pointerId: 1 });
    fireEvent.pointerMove(side, { clientX: 200, pointerId: 1 });
    expect(side.getAttribute("aria-valuenow")).toBe("360");
    expect(side.hasAttribute("data-active")).toBe(false);
  });

  it("the content keeps its room: in a 900 pt window the panes cannot take more than what leaves 360", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({ width: 900, height: 800, top: 0, left: 0, right: 900, bottom: 800, x: 0, y: 0, toJSON: () => ({}) });
    render(<Window />);
    expect(screen.getByRole("separator", { name: "Resize the sidebar" }).getAttribute("aria-valuemax")).toBe("240");
    expect(screen.getByRole("separator", { name: "Resize the inspector" }).getAttribute("aria-valuemax")).toBe("300");
  });

  it("folds with Enter on a divider (the focus goes to the toolbar button), the toolbar button and the shortcut", async () => {
    const user = userEvent.setup();
    const onSidebar = vi.fn();
    render(<Window onSidebarOpenChange={onSidebar} />);
    const sidebar = screen.getByRole("complementary", { name: "Library" });
    const toggle = screen.getByRole("button", { name: "Show or hide the sidebar" });
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    screen.getByRole("separator", { name: "Resize the sidebar" }).focus();
    await user.keyboard("{Enter}");
    expect(sidebar.hasAttribute("data-collapsed")).toBe(true);
    expect(screen.queryByRole("separator", { name: "Resize the sidebar" })).toBeNull();
    expect(document.activeElement).toBe(toggle);
    await user.click(toggle);
    expect(sidebar.hasAttribute("data-collapsed")).toBe(false);
    await user.keyboard("{Control>}b{/Control}");
    expect(sidebar.hasAttribute("data-collapsed")).toBe(true);
    expect(onSidebar).toHaveBeenCalledTimes(3);
    await user.keyboard("{Control>}i{/Control}");
    expect(screen.getByRole("complementary", { name: "Details" }).hasAttribute("data-collapsed")).toBe(true);
  });

  it("the window's own keys can be handed to the menu bar's commands", async () => {
    const user = userEvent.setup();
    render(<Window shortcuts={{ sidebar: false, inspector: false }} />);
    await user.keyboard("{Control>}b{/Control}");
    expect(screen.getByRole("complementary", { name: "Library" }).hasAttribute("data-collapsed")).toBe(false);
  });

  it("without an inspector it is two panes, and has no inspector toggle", () => {
    render(<Window inspector={undefined} />);
    expect(screen.queryByRole("complementary", { name: "Details" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show or hide the inspector" })).toBeNull();
  });

  it("the macOS focus ring is on the window: a halo for the keyboard, nothing for the pointer", () => {
    const { container } = render(<Window />);
    expect(container.firstElementChild?.className).toContain("[&_:focus-visible]:ring-[3px]!");
  });

  it("has no axe violation, and the library example commands answer the keys of the page", async () => {
    const user = userEvent.setup();
    const { container } = render(<LibraryExample />);
    expect(await axeViolations(container)).toEqual([]);
    expect(screen.getByRole("complementary", { name: "Library" }).hasAttribute("data-collapsed")).toBe(false);
    await act(async () => user.keyboard("{Control>}b{/Control}"));
    expect(screen.getByRole("complementary", { name: "Library" }).hasAttribute("data-collapsed")).toBe(true);
  });
});
