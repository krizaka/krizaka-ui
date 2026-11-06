import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminExample from "../../registry/examples/app-frame/admin";
import AppExample from "../../registry/examples/app-frame/app";
import TouchExample from "../../registry/examples/app-frame/touch";
import { axeViolations } from "../test/axe";
import { ThemeProvider } from "../theme";
import { ACCOUNT_MENU_ORDER, AppFrame, frameIssues, framePlaces, type FrameSection, navVocabulary, navWord, navWords, orderAccountLinks, publicBarLinks } from "./index";

const svg = <svg aria-hidden />;
const sections: FrameSection[] = [
  { id: "home", label: "Home", href: "/", icon: svg },
  { id: "files", label: "Files", href: "/files", icon: svg, gated: true },
  { id: "checks", label: "Checks", href: "/checks", icon: svg },
  { id: "settings", label: "Settings", href: "/settings", icon: svg, place: "foot" },
  { id: "help", label: "Help", href: "/help", icon: svg, place: "foot" },
];

describe("the frame's rules", () => {
  it("splits main and foot in order, drops the gated and the places the avatar owns — never both", () => {
    const p = framePlaces(sections, ["profile", "settings"]);
    expect(p.main.map((s) => s.id)).toEqual(["home", "checks"]);
    expect(p.foot.map((s) => s.id)).toEqual(["help"]);
    expect(p.dropped).toEqual([{ id: "files", reason: "gated" }, { id: "settings", reason: "account" }]);
    expect(framePlaces(sections).foot.map((s) => s.id)).toEqual(["settings", "help"]);
  });

  it("orders the account links as the frame does, whatever the order written, and only what was passed", () => {
    const links = { administration: "a", settings: "s", profile: "p" };
    expect(orderAccountLinks(links).map((l) => l.id)).toEqual(["profile", "settings", "administration"]);
    expect(orderAccountLinks({ billing: "b", profile: "p" }).map((l) => l.id)).toEqual(["profile", "billing"]);
    expect(orderAccountLinks(links, true).map((l) => l.id)).toEqual(["profile", "settings"]);
    expect(orderAccountLinks(undefined)).toEqual([]);
    expect(ACCOUNT_MENU_ORDER).toEqual(["identity", "profile", "settings", "billing", "administration", "language", "theme", "signOut"]);
  });

  it("reports a place on both, a duplicate and a tab bar that is too full", () => {
    expect(frameIssues(sections, ["settings"]).join(" ")).toMatch(/"settings" is on the rail and under the avatar/);
    expect(frameIssues([...sections, sections[0] as FrameSection]).join(" ")).toMatch(/"home" is declared twice/);
    const many = Array.from({ length: 6 }, (_, i): FrameSection => ({ id: `s${i}`, label: `S${i}`, href: "/", icon: svg }));
    expect(frameIssues(many).join(" ")).toMatch(/6 main sections/);
    expect(frameIssues(sections.slice(0, 3))).toEqual([]);
  });
});

describe("the shared vocabulary", () => {
  it("says Docs, Terms and Settings the same way, EN and FR, with the same keys", () => {
    expect(Object.keys(navWords.fr).sort((a, b) => a.localeCompare(b))).toEqual(Object.keys(navWords.en).sort((a, b) => a.localeCompare(b)));
    expect(navWord("en", "terms")).toBe("Terms");
    expect(navWord("fr", "terms")).toBe("Conditions d'utilisation");
    expect(navWord("fr-CA", "settings")).toBe("Réglages");
    expect(navWord("de", "settings")).toBe("Settings");
    expect(navVocabulary().docs).toBe("Docs");
    for (const [locale, words] of Object.entries(navWords)) for (const [key, word] of Object.entries(words)) expect(word, `${locale}.${key}`).not.toBe("");
  });

  it("the public bar is flat, four links at most, in the family's order, from the addresses the product has", () => {
    const all = publicBarLinks({ download: "/d", docs: "/docs", pricing: "/pricing", howItWorks: "/#how" });
    expect(all.map((l) => l.id)).toEqual(["howItWorks", "pricing", "docs", "download"]);
    expect(all.length).toBeLessThanOrEqual(4);
    expect(publicBarLinks({ docs: "/docs", howItWorks: "/#how" }, "fr").map((l) => l.label)).toEqual(["Comment ça marche", "Docs"]);
  });
});

function Frame({ admin = false, billing = true, language = true, linkAs, touchTargets }: { admin?: boolean; billing?: boolean; language?: boolean } & Pick<React.ComponentProps<typeof AppFrame>, "linkAs" | "touchTargets">) {
  return (
    <ThemeProvider>
      <AppFrame
        name="Verikora"
        mark="M"
        homeHref="/app"
        linkAs={linkAs}
        touchTargets={touchTargets}
        variant={admin ? "admin" : "app"}
        sections={sections}
        currentId="home"
        account={{
          name: "Eric",
          email: "eric@example.com",
          links: { administration: { href: "/admin" }, billing: billing ? { href: "/billing" } : undefined, settings: { href: "/settings" }, profile: { href: "/profile" } },
          onSignOut: () => {},
        }}
        language={language ? { value: "en", options: [{ value: "en", label: "English" }, { value: "fr", label: "Français" }], onChange: () => {} } : undefined}
      >
        <main id="content">content</main>
      </AppFrame>
    </ThemeProvider>
  );
}

describe("AppFrame", () => {
  it("opens the account menu in the fixed order: identity, Profile, Settings, Billing, Administration, Language, Theme, Sign out", async () => {
    const user = userEvent.setup();
    render(<Frame />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    const menu = screen.getByRole("menu");
    const names = within(menu).getAllByRole("menuitem").map((i) => i.textContent?.replace(/(English|System)$/, ""));
    expect(names).toEqual(["Profile", "Settings", "Billing", "Administration", "Language", "Theme", "Sign out"]);
    expect(within(menu).getByText("eric@example.com")).toBeTruthy();
    expect(await axeViolations(menu)).toEqual([]);
  });

  it("leaves Billing and the language out when the product has none, and keeps the theme", async () => {
    const user = userEvent.setup();
    render(<Frame billing={false} language={false} />);
    await user.click(screen.getByRole("button", { name: "Account" }));
    const names = within(screen.getByRole("menu")).getAllByRole("menuitem").map((i) => i.textContent);
    expect(names.some((n) => n?.startsWith("Billing"))).toBe(false);
    expect(names.some((n) => n?.startsWith("Language"))).toBe(false);
    expect(names.some((n) => n?.startsWith("Theme"))).toBe(true);
  });

  it("never shows a place on the rail that the avatar holds, and leaves gated sections out", () => {
    render(<Frame />);
    const rail = screen.getByRole("navigation", { name: "Verikora" });
    const labels = within(rail).getAllByRole("link").map((a) => a.getAttribute("aria-label") ?? a.textContent);
    expect(labels).toEqual(expect.arrayContaining(["Home", "Checks", "Help"]));
    expect(labels).not.toContain("Settings");
    expect(labels).not.toContain("Files");
  });

  it("marks the current section and carries the language of the shared words", () => {
    render(<Frame />);
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
  });

  it("the administration variant says so and does not offer the way into itself", async () => {
    const user = userEvent.setup();
    render(<Frame admin />);
    expect(screen.getAllByText("Administration").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "Account" }));
    expect(within(screen.getByRole("menu")).queryByRole("menuitem", { name: "Administration" })).toBeNull();
    expect(document.querySelector("[data-variant=admin]")).toBeTruthy();
  });

  it("a name that is the document has exactly one brand mark per width (the rail's and the header's)", () => {
    render(<Frame />);
    expect(document.querySelectorAll("[data-brand-mark]").length).toBe(2);
  });

  it("the examples render with no axe violation", async () => {
    const { container, unmount } = render(<AppExample />);
    expect(await axeViolations(container)).toEqual([]);
    unmount();
    const admin = render(<AdminExample />);
    expect(await axeViolations(admin.container)).toEqual([]);
  });
});

describe("touchTargets", () => {
  it("gives the rail's places, the mark, the home link, the search and the account a 44 px floor", () => {
    render(<TouchExample />);
    const nav = screen.getByRole("navigation", { name: "Verikora" });
    for (const item of within(nav).getAllByRole("link")) expect(item.className).toMatch(/md:h-11|min-h-11/);
    expect(within(screen.getByRole("banner")).getByRole("link").className).toMatch(/min-h-11/);
    expect(screen.getByRole("button", { name: /search files and checks/i }).className).toMatch(/\bh-11\b.*\bw-11\b/);
    expect(screen.getByRole("button", { name: "Account" }).className).toMatch(/min-h-11/);
  });

  it("gives the home link the floor through the router's link too, filled with the name (never an empty link)", () => {
    const RouterLink = ({ href, ...rest }: React.ComponentProps<"a"> & { href: string }) => <a href={href} data-router="" {...rest} />;
    render(<Frame linkAs={RouterLink} touchTargets />);
    const home = within(screen.getByRole("banner")).getByRole("link", { name: /Verikora/ });
    expect(home.hasAttribute("data-router")).toBe(true);
    expect(home.getAttribute("href")).toBe("/app");
    expect(home.className).toMatch(/min-h-11/);
  });

  it("leaves the default frame alone", () => {
    render(<AppExample />);
    const nav = screen.getByRole("navigation", { name: "Verikora" });
    for (const item of within(nav).getAllByRole("link")) expect(item.className).not.toMatch(/h-11|min-h-11/);
    expect(screen.getByRole("button", { name: "Account" }).className).not.toMatch(/min-h-11/);
    expect(within(screen.getByRole("banner")).getByRole("link", { name: "Verikora" }).className).not.toMatch(/min-h-11/);
  });

  it("has no accessibility violation", async () => {
    const { container } = render(<TouchExample />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
