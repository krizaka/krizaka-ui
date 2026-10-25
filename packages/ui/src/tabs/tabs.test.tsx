import { themes } from "@krizaka/tokens/native";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BinderExample from "../../registry/examples/tabs/binder";
import { axeViolations } from "../test/axe";
import { isTabActive, Tabs } from "./index";

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

  it("glides one light to the active tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="a" variant="segmented">
        <Tabs.List aria-label="Views">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">a</Tabs.Content>
        <Tabs.Content value="b">b</Tabs.Content>
      </Tabs.Root>,
    );
    const list = screen.getByRole("tablist");
    expect(list.getAttribute("data-indicator")).toBe("on");
    expect(list.className).toContain("before:bg-accent");
    await user.click(screen.getByRole("tab", { name: "B" }));
    expect(list.getAttribute("data-indicator")).toBe("on");
  });

  it("hides inactive tab panel when forceMount is true", () => {
    render(
      <Tabs.Root defaultValue="video">
        <Tabs.List aria-label="Media">
          <Tabs.Trigger value="video">Video</Tabs.Trigger>
          <Tabs.Trigger value="image">Image</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="video" forceMount data-testid="panel-video">
          Video content
        </Tabs.Content>
        <Tabs.Content value="image" forceMount data-testid="panel-image">
          Image content
        </Tabs.Content>
      </Tabs.Root>,
    );

    const videoPanel = screen.getByTestId("panel-video");
    const imagePanel = screen.getByTestId("panel-image");

    expect(videoPanel.getAttribute("data-state")).toBe("active");
    expect(videoPanel.className).toContain("data-[state=inactive]:hidden");
    expect(imagePanel.getAttribute("data-state")).toBe("inactive");
    expect(imagePanel.className).toContain("data-[state=inactive]:hidden");
  });
});

describe("Tabs scroll container", () => {
  // A scrolling list (pills on a phone) must never scroll vertically: with overflow-x set, overflow-y computes to auto,
  // so a 1-2 px overhang (a focus ring, a border) draws a vertical scrollbar thumb at the end of the bar.
  it("never scrolls vertically when it scrolls sideways", () => {
    render(<Example variant="pills" />);
    const list = screen.getByRole("tablist");
    expect(list.className).toContain("overflow-x-auto");
    expect(list.className).toContain("overflow-y-hidden");
    expect(list.className).toContain("[&::-webkit-scrollbar]:hidden");
    expect(list.className).toContain("[scrollbar-width:none]");
  });

  it("keeps the focus ring and the sliding light inside the list (padding, not overflow)", () => {
    render(<Example variant="pills" />);
    const list = screen.getByRole("tablist");
    // The same box height as before (the old pb-1): the ring room sits in the padding, the flow does not change.
    expect(list.className).toContain("pt-1");
    expect(list.className).toContain("-mt-1");
    expect(list.className).toContain("pb-1");
  });

  it("does not scroll on the other variants", () => {
    render(<Example variant="underline" />);
    const list = screen.getByRole("tablist");
    expect(list.className).not.toMatch(/overflow-(x-|y-)?auto/);
  });
});

describe("Tabs as routes (Tabs.Nav)", () => {
  function Routes({ current }: { current: string }) {
    return (
      <Tabs.Nav label="Studio sections" current={current}>
        <Tabs.NavLink href="/studio/videos">Videos</Tabs.NavLink>
        <Tabs.NavLink href="/studio/stories" exact>Stories</Tabs.NavLink>
        <Tabs.NavLink href="/studio?tab=earnings">Earnings</Tabs.NavLink>
      </Tabs.Nav>
    );
  }

  it("is a named navigation of links (not a tablist), the active one aria-current=page, no axe violation", async () => {
    const { container } = render(<Routes current="/studio/videos" />);
    expect(screen.getByRole("navigation", { name: "Studio sections" })).toBeTruthy();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.getByRole("link", { name: "Videos" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Stories" }).getAttribute("aria-current")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("reads the active tab from the route: no local state, it follows the prop", () => {
    const { rerender } = render(<Routes current="/studio/videos" />);
    rerender(<Routes current="/studio/stories" />);
    expect(screen.getByRole("link", { name: "Stories" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Videos" }).getAttribute("aria-current")).toBeNull();
  });

  it("matches the pages below a section unless exact, ignores the trailing slash and the hash, and reads the search params", () => {
    expect(isTabActive("/studio/videos/42", "/studio/videos")).toBe(true);
    expect(isTabActive("/studio/videos/42", "/studio/videos", true)).toBe(false);
    expect(isTabActive("/studio/videos/#top", "/studio/videos")).toBe(true);
    expect(isTabActive("/studio?tab=earnings", "/studio?tab=earnings")).toBe(true);
    expect(isTabActive("/studio?tab=videos", "/studio?tab=earnings")).toBe(false);
    expect(isTabActive("/studio", "/studio?tab=earnings")).toBe(false);
    expect(isTabActive("/studio", "/")).toBe(false);
    expect(isTabActive("/", "/")).toBe(true);
  });

  it("renders your router's link with asChild and keeps the keyboard the page's own (Tab, Enter)", async () => {
    render(
      <Tabs.Nav label="Sections" current="/a">
        <Tabs.NavLink href="/a" asChild><a href="/a" data-router="">A</a></Tabs.NavLink>
        <Tabs.NavLink href="/b">B</Tabs.NavLink>
      </Tabs.Nav>,
    );
    const a = screen.getByRole("link", { name: "A" });
    expect(a.hasAttribute("data-router")).toBe(true);
    expect(a.getAttribute("aria-current")).toBe("page");
    await userEvent.tab();
    expect(document.activeElement).toBe(a);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "B" }));
  });
});

describe("Tabs — binder dividers (#648)", () => {
  /** WCAG contrast of two #rrggbb colours. */
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi! + 0.05) / (lo! + 0.05);
  };

  it("every hue reads at 3:1 or more on the dividers' surfaces, in both themes", () => {
    const roles = { accent: "accent", success: "successText", warning: "warningText", danger: "dangerText", neutral: "textMuted" } as const;
    for (const mode of ["dark", "light"] as const) {
      const t = themes[mode] as unknown as Record<string, string>;
      for (const [hue, role] of Object.entries(roles)) {
        for (const surface of ["surface1", "surface2"]) {
          expect(contrast(t[role]!, t[surface]!), `${hue} on ${surface} (${mode})`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  function Binder({ add }: { add?: () => void }) {
    return (
      <Tabs.Root variant="binder" defaultValue="all">
        <Tabs.List aria-label="Collections" add={add ? { label: "Divider", onAdd: add } : undefined}>
          <Tabs.Trigger value="all" count={48}>All</Tabs.Trigger>
          <Tabs.Trigger value="regulars" hue="success" count={21}>Regulars</Tabs.Trigger>
          <Tabs.Trigger value="archived" hue="neutral">Archived</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all">48 clients</Tabs.Content>
        <Tabs.Content value="regulars">21 regulars</Tabs.Content>
        <Tabs.Content value="archived">Archived clients</Tabs.Content>
      </Tabs.Root>
    );
  }

  it("draws dividers: the count in the tab's name, the hue as --kz-hue, the accent by default", () => {
    render(<Binder />);
    const regulars = screen.getByRole("tab", { name: "Regulars 21" });
    expect(regulars.style.getPropertyValue("--kz-hue")).toBe("var(--kz-success-text)");
    expect(regulars.className).toContain("before:bg-(--kz-hue,var(--kz-accent))");
    expect(screen.getByRole("tab", { name: "All 48" }).style.getPropertyValue("--kz-hue")).toBe("");
    expect(screen.getByRole("tablist").className).toContain("overflow-x-auto");
    expect(screen.getByRole("tablist").className).toContain("mask-image");
  });

  it("walks the dividers with the arrows, Home and End", async () => {
    const user = userEvent.setup();
    render(<Binder />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "All 48" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Regulars 21" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Archived" }));
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "All 48" }));
  });

  it("puts « + » after the list, outside the tablist, with no axe violation", async () => {
    const add = vi.fn();
    const { container } = render(<Binder add={add} />);
    const button = screen.getByRole("button", { name: "Divider" });
    expect(screen.getByRole("tablist").contains(button)).toBe(false);
    button.click();
    expect(add).toHaveBeenCalled();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("as routes, the address marks the active divider", () => {
    render(<BinderExample />);
    const active = screen.getByRole("link", { name: "Regulars 21" });
    expect(active.getAttribute("aria-current")).toBe("page");
    expect(active.style.getPropertyValue("--kz-hue")).toBe("var(--kz-success-text)");
    expect(screen.getByRole("link", { name: "All 48" }).hasAttribute("aria-current")).toBe(false);
    expect(screen.getByRole("navigation", { name: "Client collections" }).contains(screen.getByRole("button", { name: "Divider" }))).toBe(false);
  });
});
