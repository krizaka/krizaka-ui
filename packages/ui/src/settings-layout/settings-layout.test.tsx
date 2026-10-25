import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SettingsLayout, SettingsRow, SettingsSection } from "./index";

describe("SettingsLayout", () => {
  it("lists the sections, marks the current one, names each form, with no axe violation", async () => {
    const { container } = render(
      <SettingsLayout
        title="Settings"
        navLabel="Settings sections"
        nav={[
          { id: "profile", label: "Profile", href: "#profile", current: true },
          { id: "billing", label: "Billing", href: "/settings/billing" },
        ]}
      >
        <SettingsSection id="profile" title="Profile" footer={<button type="button">Save</button>}>
          fields
        </SettingsSection>
      </SettingsLayout>,
    );
    expect(screen.getByRole("navigation", { name: "Settings sections" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Profile" }).getAttribute("aria-current")).toBe("location");
    expect(screen.getByRole("region", { name: "Profile" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("SettingsLayout, many sections", () => {
  const groups = [
    { id: "library", label: "Library", items: [{ id: "videos", label: "Videos", href: "/me/videos", current: true, badge: 12 }, { id: "lists", label: "Lists", href: "/me/lists" }, { id: "uploads", label: "Uploads", href: "/me/uploads" }] },
    { id: "account", label: "Account", items: [{ id: "profile", label: "Profile", href: "/me/profile" }, { id: "security", label: "Security", href: "/me/security" }, { id: "data", label: "My data", href: "/me/data" }] },
  ];

  it("shows the groups' titles in the sidebar, a count after a label, and one menu for a phone, with no axe violation", async () => {
    const { container } = render(
      <SettingsLayout navLabel="Your space" nav={groups} header={<h1>Elena</h1>}>
        x
      </SettingsLayout>,
    );
    expect(screen.getAllByRole("heading", { level: 2, name: /Library|Account/ })).toHaveLength(4);
    expect(container.querySelectorAll("[data-settings-menu]")).toHaveLength(1);
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: /Videos/ }).map((l) => l.getAttribute("aria-current"))).toEqual(["page", "page"]);
    expect(screen.getAllByText("12")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 1, name: "Elena" })).toBeTruthy();
    expect(container.querySelector("summary")?.textContent).toBe("Videos");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("keeps the chips for five sections or fewer, even when they are grouped", () => {
    const five = [{ id: "a", label: "A", items: groups[0]!.items }, { id: "b", label: "B", items: groups[1]!.items.slice(0, 2) }];
    const { container } = render(<SettingsLayout navLabel="n" nav={five}>x</SettingsLayout>);
    expect(container.querySelector("[data-settings-menu]")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });
});

describe("SettingsRow and the flat variant", () => {
  it("a row names its control with a label and a help text, on one line from the sm breakpoint", async () => {
    const { container } = render(
      <SettingsLayout variant="flat" title="Settings" navLabel="Settings sections" nav={[{ id: "account", label: "Account", href: "/settings/account", current: true }]}>
        <SettingsSection variant="flat" title="Account">
          <SettingsRow label="Username" description="Shown to your team." htmlFor="u">
            <input id="u" defaultValue="oussama" />
          </SettingsRow>
          <SettingsRow label="Plan">Pro</SettingsRow>
        </SettingsSection>
      </SettingsLayout>,
    );
    expect(screen.getByLabelText("Username")).toBeTruthy();
    expect(screen.getByText("Shown to your team.")).toBeTruthy();
    const section = screen.getByRole("region", { name: "Account" });
    // flat: hairline-divided rows, no card chrome
    const tokens = section.className.split(" ");
    for (const card of ["border", "rounded-xl", "bg-surface-1"]) expect(tokens).not.toContain(card);
    expect(section.querySelector("[data-settings-rows]")?.className).toMatch(/divide-y/);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("the flat content is one calm column (max 45rem)", () => {
    const { container } = render(
      <SettingsLayout variant="flat" navLabel="n" nav={[{ id: "a", label: "A", href: "/a" }]}>
        x
      </SettingsLayout>,
    );
    expect(container.innerHTML).toMatch(/max-w-\[45rem\]/);
  });

  it("the section list never draws a scrollbar (no overflow-y, hidden scrollbars on the phone chips)", () => {
    render(<SettingsLayout navLabel="Sections" nav={[{ id: "a", label: "A", href: "/a" }]}>x</SettingsLayout>);
    const cls = screen.getByRole("navigation", { name: "Sections" }).className;
    expect(cls).toMatch(/overflow-y-hidden/);
    expect(cls).toMatch(/\[scrollbar-width:none\]/);
    expect(cls).toMatch(/\[&::-webkit-scrollbar\]:hidden/);
  });
});
