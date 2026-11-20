import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@krizaka/icons";
import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { familyLabels, siteById } from "../sites";
import { axeViolations } from "../test/axe";
import { FamilyFooter, type FamilyFooterData } from "./index";

// krizaka-internal#3562: rows A–E, one <footer>, each group a labelled <nav>; `kind` changes row C only.
const data = (over: Partial<FamilyFooterData> = {}): FamilyFooterData => ({
  id: "ui",
  groups: [
    { group: "products", entries: [{ id: "verikora", name: "Verikora", group: "products", status: "released", url: "https://www.verikora.com" }] },
    { group: "open-source", entries: [{ id: "ui", name: "Krizaka UI", group: "open-source", status: "released", url: "https://ui.krizaka.com" }] },
  ],
  // Out of order on purpose: the block fixes the order.
  social: [
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/krizaka" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" },
    { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@krizaka" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/krizaka" },
  ],
  source: "https://github.com/krizaka/krizaka-ui",
  license: "Apache-2.0",
  licenceHref: "https://github.com/krizaka/krizaka-ui/blob/main/LICENSE",
  releaseNotes: "https://ui.krizaka.com/changelog",
  legal: [
    { id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "https://x/fr/privacy", en: "https://x/en/privacy" } },
    { id: "terms", label: { fr: "Conditions", en: "Terms" }, url: { fr: "https://x/fr/terms", en: "https://x/en/terms" } },
  ],
  line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
  version: true,
  ...over,
});
const company = { legalName: "Technologies Krizaka Inc.", neq: "1182652231", city: "Montréal", region: "Québec" };
const draw = (kind: "company" | "developer", footer = data(), id: "ui" | "krizaka" = "ui") =>
  render(<FamilyFooter footer={footer} current={id} kind={kind} labels={familyLabels.en} company={company} version="2.0.0" />);

describe("FamilyFooter rows", () => {
  it("is one footer landmark, each group a labelled nav", () => {
    const { container } = draw("developer");
    expect(container.querySelectorAll("footer")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    for (const name of ["Krizaka family", "Krizaka on social media", "This project", "Legal"]) expect(screen.getByRole("navigation", { name }), name).toBeTruthy();
  });

  it("draws the four accounts in the fixed order, each with its own glyph and an accessible name", () => {
    draw("developer");
    const nav = screen.getByRole("navigation", { name: "Krizaka on social media" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Instagram", "Facebook", "YouTube", "LinkedIn"]);
    const glyphs = { instagram: InstagramIcon, facebook: FacebookIcon, youtube: YoutubeIcon, linkedin: LinkedinIcon };
    const ids = ["instagram", "facebook", "youtube", "linkedin"] as const;
    links.forEach((a, i) => {
      const Icon = glyphs[ids[i]!];
      expect(a.querySelector("svg"), ids[i]).not.toBeNull();
      expect(a.querySelector("svg")!.outerHTML, ids[i]).toBe(renderToStaticMarkup(<Icon size={20} />));
    });
    expect(new Set(links.map((a) => a.querySelector("svg")!.innerHTML)).size).toBe(4);
  });

  it("changes row C with the kind and nothing else", () => {
    const dev = draw("developer");
    const devProject = within(screen.getByRole("navigation", { name: "This project" })).getAllByRole("link").map((a) => a.textContent);
    expect(devProject).toEqual(["Source code", "Apache-2.0", "Release notes"]);
    expect(screen.getByText("v2.0.0")).toBeTruthy();
    const devOutside = outside();
    dev.unmount();

    draw("company");
    expect(screen.queryByText("v2.0.0")).toBeNull();
    expect(screen.queryByRole("link", { name: "Release notes" })).toBeNull();
    expect(outside()).toEqual(devOutside);
  });

  it("a developer footer always shows source, licence, version and release notes; a company one only what the org gives", () => {
    draw("company", data({ source: null, license: null, licenceHref: null }), "krizaka");
    expect(screen.queryByRole("navigation", { name: "This project" })).toBeNull();
  });

  it("row D names the company once, with its NEQ and city, then the legal links; row E is the signature line", () => {
    draw("developer");
    expect(screen.getByText("Technologies Krizaka Inc. · NEQ 1182652231 · Montréal (Québec)")).toBeTruthy();
    expect(within(screen.getByRole("navigation", { name: "Legal" })).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["https://x/en/privacy", "https://x/en/terms"]);
    // Said once (#4470): the legal line names the company, so the signature line is not repeated.
    expect(screen.queryByText("A Technologies Krizaka company · Made in Montréal")).toBeNull();
    expect(screen.getByText(/Technologies Krizaka Inc\./).closest("div")!.className).toMatch(/text-xs/);
  });

  it("without the company's facts, the signature line stays (#4470)", () => {
    render(<FamilyFooter footer={data()} current="ui" labels={familyLabels.en} />);
    expect(screen.getByText("A Technologies Krizaka company · Made in Montréal")).toBeTruthy();
  });

  it("holds at most one site column: the data's wins over the host's", () => {
    render(
      <FamilyFooter footer={data({ column: { title: { en: "Documentation", fr: "Documentation" }, links: [{ id: "c", label: { en: "Components", fr: "Composants" }, url: { en: "/c", fr: "/c" } }] } })} current="ui" labels={familyLabels.en}>
        <FamilyFooter.Column title="Host">
          <FamilyFooter.Link href="/h">Host link</FamilyFooter.Link>
        </FamilyFooter.Column>
      </FamilyFooter>,
    );
    expect(screen.getByText("Documentation")).toBeTruthy();
    expect(screen.queryByText("Host")).toBeNull();
  });

  it("speaks French when asked", () => {
    render(<FamilyFooter footer={data()} current="ui" kind="developer" labels={familyLabels.fr} version="2.0.0" />);
    expect(screen.getByRole("navigation", { name: "Krizaka sur les réseaux" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Notes de version" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Code source" })).toBeTruthy();
  });

  it("has no axe violation, in English and French, as a developer or a company footer", async () => {
    for (const [kind, labels] of [["developer", familyLabels.en], ["company", familyLabels.fr]] as const) {
      const { container, unmount } = render(<FamilyFooter footer={data()} current="ui" kind={kind} labels={labels} company={company} version="2.0.0" />);
      expect(await axeViolations(container), kind).toEqual([]);
      unmount();
    }
  });

  it("knows the rust and agents sites", () => {
    expect(siteById("rust").url).toBe("https://rust.krizaka.com");
    expect(siteById("agents").kind).toBe("company");
  });
});

/** What is outside row C: the socials, the legal row and the signature, as text. */
function outside() {
  const text = (name: string) => within(screen.getByRole("navigation", { name })).getAllByRole("link").map((a) => `${a.textContent}|${a.getAttribute("href")}`);
  return { social: text("Krizaka on social media"), legal: text("Legal"), family: text("Krizaka family"), line: screen.queryByText(/Made in Montréal/) };
}
