import { render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { SettingsLayout, SettingsSection } from "./index";

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
