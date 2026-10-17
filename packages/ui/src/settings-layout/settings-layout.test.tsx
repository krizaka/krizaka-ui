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
