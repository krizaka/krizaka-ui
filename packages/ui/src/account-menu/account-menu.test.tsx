import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { AccountMenu } from "./index";

function Menu({ onLanguage = () => {}, onSignOut = () => {} }: { onLanguage?: (v: string) => void; onSignOut?: () => void }) {
  return (
    <AccountMenu
      label="Account"
      name="Eric"
      email="eric@orazaka.io"
      avatar={{ defaultAvatar: { brand: "orazaka", seed: "eric" } }}
      links={[
        { id: "profile", label: "Profile", href: "/settings/account" },
        { id: "settings", label: "Settings", href: "/settings" },
      ]}
      language={{ label: "Language", value: "en", options: [{ value: "en", label: "English" }, { value: "fr", label: "Français" }], onChange: onLanguage }}
      signOut={{ label: "Sign out", onSelect: onSignOut }}
    />
  );
}

describe("AccountMenu", () => {
  it("opens on the identity first, then the links, the language row and Sign out — with no axe violation", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByText("eric@orazaka.io")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Profile" }).getAttribute("href")).toBe("/settings/account");
    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Language/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeTruthy();
    expect(await axeViolations(screen.getByRole("menu"))).toEqual([]);
  });

  it("the language is a compact submenu showing the current one, and changing it calls back", async () => {
    const user = userEvent.setup();
    const onLanguage = vi.fn();
    render(<Menu onLanguage={onLanguage} />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByRole("menuitem", { name: /Language/ }).textContent).toContain("English");
    screen.getByRole("menuitem", { name: /Language/ }).focus();
    await user.keyboard("{ArrowRight}");
    const fr = await screen.findByRole("menuitemradio", { name: "Français" });
    fr.focus();
    await user.keyboard("{Enter}");
    expect(onLanguage).toHaveBeenCalledWith("fr");
  });

  it("Sign out is a quiet item (not the danger tone) that runs the callback", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<Menu onSignOut={onSignOut} />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    const item = screen.getByRole("menuitem", { name: "Sign out" });
    expect(item.getAttribute("data-tone")).toBe("default");
    await user.click(item);
    expect(onSignOut).toHaveBeenCalled();
  });

  it("draws no scrollbar at its natural height: it only scrolls when the screen is shorter, never sideways", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    const cls = screen.getByRole("menu").className;
    expect(cls).toContain("overflow-x-hidden");
    expect(cls).toContain("max-h-(--radix-dropdown-menu-content-available-height)");
  });
});
