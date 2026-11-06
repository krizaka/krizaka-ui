import { render, screen, within } from "@testing-library/react";

import { familyLabels } from "../sites";
import { axeViolations } from "../test/axe";
import { FOOTER_LIMITS, type FooterSettings, footerSettingsProblems, resolveFooterSettings, SiteFooter } from "./index";

const messages: Record<string, string> = {
  "footer.label": "Pied de page",
  "footer.products": "Produits",
  "footer.company": "Krizaka",
  "footer.story": "Notre histoire",
  "footer.privacy": "Confidentialité",
  "footer.terms": "Conditions",
};
const t = (key: string) => messages[key] ?? key;

const settings: FooterSettings = {
  labelKey: "footer.label",
  columns: [
    {
      id: "products",
      titleKey: "footer.products",
      status: "development",
      links: [
        { label: "Verikora", href: "https://www.verikora.com", external: true },
        { label: "Folioviv", href: "https://www.folioviv.com", external: true },
      ],
    },
    { id: "company", titleKey: "footer.company", links: [{ labelKey: "footer.story", href: "/fr/story" }] },
  ],
  legal: {
    legalName: "Technologies Krizaka Inc.",
    neq: "1182652231",
    city: "Montréal (Québec)",
    showVersion: true,
    links: [
      { labelKey: "footer.privacy", href: "/fr/privacy" },
      { labelKey: "footer.terms", href: "/fr/terms" },
    ],
  },
  social: ["instagram"],
};
const social = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" },
  { id: "github", label: "GitHub", url: "https://github.com/krizaka" },
];

describe("footer settings", () => {
  it("resolve their words from the app's messages and their socials from the org", () => {
    const config = resolveFooterSettings(settings, t, social);
    expect(config.label).toBe("Pied de page");
    expect(config.columns.map((c) => c.title)).toEqual(["Produits", "Krizaka"]);
    expect(config.columns[1]!.links[0]).toEqual({ label: "Notre histoire", href: "/fr/story" });
    expect(config.legal.links.map((l) => l.label)).toEqual(["Confidentialité", "Conditions"]);
    expect(config.social).toEqual([{ id: "instagram", label: "Instagram", href: "https://www.instagram.com/krizakahq" }]);
  });

  it("are valid as the defaults are, and refused past the limits, twice, on http, on a dev host or with a bad NEQ", () => {
    expect(footerSettingsProblems(settings)).toEqual([]);
    const many = Array.from({ length: FOOTER_LIMITS.links + 1 }, (_, i) => ({ label: `L${i}`, href: `/l${i}` }));
    const bad: FooterSettings = {
      ...settings,
      columns: [
        ...Array.from({ length: FOOTER_LIMITS.columns }, (_, i) => ({ id: `c${i}`, titleKey: "x", links: [{ label: "x", href: `/c${i}` }] })),
        { id: "big", titleKey: "x", links: [...many, { label: "dup", href: "/l0" }, { label: "h", href: "http://x.com", external: true }, { label: "d", href: "https://dev.verikora.com", external: true }] },
      ],
      legal: { ...settings.legal, neq: "123" },
    };
    const problems = footerSettingsProblems(bad);
    expect(problems).toEqual(
      expect.arrayContaining([
        `at most ${FOOTER_LIMITS.columns} columns`,
        `column big: at most ${FOOTER_LIMITS.links} links`,
        "big: /l0 is already in the footer",
        "big: http://x.com is not https",
        "big: https://dev.verikora.com is a development host",
        "legal: the NEQ has ten digits",
      ]),
    );
  });
});

describe("SiteFooter with a config", () => {
  const config = resolveFooterSettings(settings, t, social);

  it("draws real columns under a named navigation, the status once per column, and no family", async () => {
    const { container } = render(<SiteFooter current="krizaka" labels={familyLabels.fr} version="0.15.0" path="/fr/story" config={config} />);
    expect(screen.queryByRole("navigation", { name: familyLabels.fr.family })).toBeNull();
    const nav = screen.getByRole("navigation", { name: "Pied de page" });
    const lists = within(nav).getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(within(lists[0]!).getAllByRole("link").map((a) => a.textContent)).toEqual(["Verikora", "Folioviv"]);
    expect(nav.textContent).toContain(`Produits · ${familyLabels.fr.status.development}`);
    expect(nav.textContent!.split(familyLabels.fr.status.development)).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Notre histoire" }).getAttribute("aria-current")).toBe("page");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("names the company once, with its NEQ, the version and the legal and social links on the last line", () => {
    const { container } = render(<SiteFooter current="krizaka" labels={familyLabels.fr} version="0.15.0" config={config} />);
    const text = container.textContent!;
    expect(text).toContain("Technologies Krizaka Inc. · NEQ 1182652231 · Montréal (Québec)");
    expect(text.split("Technologies Krizaka")).toHaveLength(2);
    expect(text).toContain("v0.15.0");
    expect(screen.queryByRole("link", { name: /v0\.15\.0/ })).toBeNull();
    expect(screen.getByRole("link", { name: "Instagram" }).getAttribute("href")).toBe("https://www.instagram.com/krizakahq");
    expect(screen.getByRole("link", { name: "Krizaka" }).getAttribute("href")).toBe("https://www.krizaka.com");
  });

  it("links the version to its release when the admin gives the address", () => {
    render(<SiteFooter current="krizaka" version="0.15.0" config={{ ...config, legal: { ...config.legal, versionHref: "https://github.com/krizaka/krizaka-com/releases/tag/v0.15.0" } }} />);
    expect(screen.getByRole("link", { name: /v0\.15\.0/ }).getAttribute("href")).toBe("https://github.com/krizaka/krizaka-com/releases/tag/v0.15.0");
  });

  it("hides the version when the admin says so, and keeps only the last line in an app", () => {
    const { container } = render(
      <SiteFooter current="verikora" variant="app" version="1.2.3" config={{ ...config, legal: { ...config.legal, showVersion: false } }} />,
    );
    expect(container.textContent).not.toContain("v1.2.3");
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.getByRole("link", { name: "Conditions" })).toBeTruthy();
  });

  it("renders internal links through the router link and external ones as plain anchors", () => {
    const Router = ({ href, children, ...rest }: { href: string; children?: React.ReactNode }) => (
      <a data-router href={href} {...rest}>
        {children}
      </a>
    );
    render(<SiteFooter current="krizaka" config={config} linkAs={Router} />);
    expect(screen.getByRole("link", { name: "Notre histoire" }).hasAttribute("data-router")).toBe(true);
    expect(screen.getByRole("link", { name: "Verikora" }).hasAttribute("data-router")).toBe(false);
  });
});
