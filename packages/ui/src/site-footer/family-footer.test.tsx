import { render, screen, within } from "@testing-library/react";

import { familyLabels } from "../sites";
import { axeViolations } from "../test/axe";
import { FamilyFooter, type FamilyFooterData } from "./index";

// What `footerFor("ui")` of `@krizaka/org` 1.4.0 returns (the shape; the words are the org's).
const entry = (id: string, name: string, group: "krizaka" | "products" | "open-source" | "github", url: string) => ({ id, name, group, url, status: "released" as const });
const footer: FamilyFooterData = {
  id: "ui",
  groups: [
    { group: "products", entries: [entry("verikora", "Verikora", "products", "https://www.verikora.com"), entry("folioviv", "Folioviv", "products", "https://www.folioviv.com")] },
    { group: "open-source", entries: [entry("ui", "Krizaka UI", "open-source", "https://ui.krizaka.com"), entry("lab", "Krizaka Lab", "open-source", "https://lab.krizaka.com")] },
    { group: "github", entries: [entry("github", "GitHub", "github", "https://github.com/krizaka")] },
  ],
  social: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/krizaka-technologies-inc" },
  ],
  source: "https://github.com/krizaka/krizaka-ui",
  license: "Apache-2.0",
  legal: [
    { id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "https://www.krizaka.com/fr/privacy", en: "https://www.krizaka.com/en/privacy" } },
    { id: "terms", label: { fr: "Conditions", en: "Terms" }, url: { fr: "https://www.krizaka.com/fr/terms", en: "https://www.krizaka.com/en/terms" } },
  ],
  line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
  version: true,
};

const draw = (over: Partial<React.ComponentProps<typeof FamilyFooter>> = {}) =>
  render(<FamilyFooter footer={footer} current="ui" labels={familyLabels.en} sourceLabel="Source code" version="2.0.0" {...over} />);

describe("FamilyFooter", () => {
  it("places the org's selection: family, source, licence, legal links, socials, version — and passes axe", async () => {
    const { container } = draw();
    const nav = screen.getByRole("navigation", { name: familyLabels.en.family });
    expect(within(nav).getByRole("link", { name: "Verikora" }).getAttribute("href")).toBe("https://www.verikora.com");
    expect(within(nav).getByRole("link", { name: /Krizaka UI/ }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("link", { name: "Source code" }).getAttribute("href")).toBe("https://github.com/krizaka/krizaka-ui");
    expect(screen.getByText("Apache-2.0")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Privacy" }).getAttribute("href")).toBe("https://www.krizaka.com/en/privacy");
    expect(screen.getByRole("link", { name: "Instagram" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeTruthy();
    expect(screen.getByText("v2.0.0")).toBeTruthy();
    expect(screen.getByText(footer.line.en)).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("draws only the groups the selection lists", () => {
    draw({ footer: { ...footer, groups: footer.groups.filter((g) => g.group === "products") } });
    const nav = screen.getByRole("navigation", { name: familyLabels.en.family });
    expect(within(nav).queryByRole("link", { name: "GitHub" })).toBeNull();
    expect(within(nav).queryByRole("link", { name: "Story" })).toBeNull();
    expect(within(nav).getByRole("link", { name: "Verikora" })).toBeTruthy();
  });

  it("shows no source, no licence, no version when the selection says none", () => {
    draw({ footer: { ...footer, source: null, license: null, version: false } });
    expect(screen.queryByRole("link", { name: "Source code" })) .toBeNull();
    expect(screen.queryByText("Apache-2.0")).toBeNull();
    expect(screen.queryByText("v2.0.0")).toBeNull();
  });

  it("reads the French of the org's legal links", () => {
    draw({ labels: familyLabels.fr, sourceLabel: "Code source" });
    expect(screen.getByRole("link", { name: "Confidentialité" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/privacy");
  });

  it("folds each group in a details (phones) and keeps the host's own links first", () => {
    const { container } = draw({ children: <FamilyFooter.Column title="Docs"><FamilyFooter.Link href="/c">Components</FamilyFooter.Link></FamilyFooter.Column> } as never);
    expect(container.querySelectorAll("nav details").length).toBeGreaterThanOrEqual(2);
  });

  it("is three lines at most: the host's links, the family, then the last line — on the documentation's width", () => {
    const { container } = draw({ children: <FamilyFooter.Column title="Docs"><FamilyFooter.Link href="/c">Components</FamilyFooter.Link></FamilyFooter.Column> });
    const inner = container.querySelector("footer > div")!;
    expect(inner.children.length).toBe(3);
    expect(inner.className).toContain("--kz-page-max-docs");
  });
});
