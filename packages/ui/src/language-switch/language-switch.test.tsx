import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { languageHref, languagesFor, LanguageSwitch } from "./index";

const languages = languagesFor("/fr/baux?tri=date#haut");

describe("languageHref", () => {
  it("swaps the locale segment and keeps the rest of the address", () => {
    expect(languageHref("/fr/baux?tri=date#haut", "en")).toBe("/en/baux?tri=date#haut");
    expect(languageHref("/fr", "en")).toBe("/en");
    expect(languageHref("/en/a/b/c", "fr")).toBe("/fr/a/b/c");
  });

  it("adds a locale to an address without one, and never swaps a segment that is not a locale", () => {
    expect(languageHref("/baux", "fr")).toBe("/fr/baux");
    expect(languageHref("/", "en")).toBe("/en");
    expect(languageHref("/frais", "en")).toBe("/en/frais");
  });
});

describe("languagesFor", () => {
  it("names every language in its own language", () => {
    expect(languages.map((l) => l.name)).toEqual(["English", "Français"]);
    expect(languages.map((l) => l.href)).toEqual(["/en/baux?tri=date#haut", "/fr/baux?tri=date#haut"]);
  });
});

describe("LanguageSwitch", () => {
  it("shows the current code on a globe, never the other language", () => {
    render(<LanguageSwitch label="Langue" current="fr" languages={languages} />);
    const trigger = screen.getByRole("button", { name: "Langue: Français" });
    expect(trigger.querySelector("[data-code]")?.getAttribute("data-code")).toBe("fr");
    expect(trigger.textContent).not.toMatch(/english/i);
  });

  it("opens a list of links with hreflang, the current one marked", async () => {
    render(<LanguageSwitch label="Langue" current="fr" languages={languages} />);
    await userEvent.click(screen.getByRole("button", { name: "Langue: Français" }));
    const english = await screen.findByRole("link", { name: "English" });
    expect(english.getAttribute("href")).toBe("/en/baux?tri=date#haut");
    expect(english.getAttribute("hreflang")).toBe("en");
    expect(english.getAttribute("lang")).toBe("en");
    expect(screen.getByRole("link", { name: "Français" }).getAttribute("aria-current")).toBe("true");
    expect(english.getAttribute("aria-current")).toBeNull();
  });

  it("opens with ArrowDown on the current language, walks with the arrows and closes with Escape, returning the focus", async () => {
    render(<LanguageSwitch label="Langue" current="fr" languages={languages} />);
    const trigger = screen.getByRole("button", { name: "Langue: Français" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await waitFor(() => expect(document.activeElement?.getAttribute("hreflang")).toBe("fr"));
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement?.getAttribute("hreflang")).toBe("en");
    await userEvent.keyboard("{End}");
    expect(document.activeElement?.getAttribute("hreflang")).toBe("fr");
    await userEvent.keyboard("{Escape}");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "English" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on a press outside and when the focus leaves it", async () => {
    render(
      <div>
        <p>The page</p>
        <LanguageSwitch label="Langue" current="fr" languages={languages} />
        <button type="button">Next</button>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Langue: Français" });
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await userEvent.click(screen.getByText("The page"));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(trigger);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("has no axe violation, open or closed", async () => {
    const { container } = render(<LanguageSwitch label="Langue" current="fr" languages={languages} defaultOpen />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders the router's link when given", async () => {
    const Link = ({ href, ...props }: React.ComponentProps<"a">) => <a data-router href={href} {...props} />;
    render(<LanguageSwitch label="Langue" current="fr" languages={languages} linkAs={Link} defaultOpen />);
    expect((await screen.findByRole("link", { name: "English" })).hasAttribute("data-router")).toBe(true);
  });

  it("lays the languages in a row for a panel (inline)", async () => {
    const { container } = render(<LanguageSwitch variant="inline" label="Langue" current="fr" languages={languages} />);
    const group = screen.getByRole("group", { name: "Langue" });
    expect(group.querySelectorAll("a").length).toBe(2);
    expect(screen.getByRole("link", { name: "Français" }).getAttribute("aria-current")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });
});
