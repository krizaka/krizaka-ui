import { FamilyFooter, type FamilyFooterData } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// A developer site (ui.krizaka.com): the footer is what `footerFor("ui")` of `@krizaka/org` returns — pass it as is.
// The block places the family, the source code, the licence, the legal links, the accounts and the version; the site adds its own links.
const footer: FamilyFooterData = {
  id: "ui",
  groups: [
    { group: "products", entries: [{ id: "verikora", name: "Verikora", group: "products", status: "released", url: "https://www.verikora.com" }] },
    { group: "open-source", entries: [{ id: "ui", name: "Krizaka UI", group: "open-source", status: "released", url: "https://ui.krizaka.com" }] },
  ],
  social: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/krizaka" },
    { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@krizaka" },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/krizaka" },
  ],
  releaseNotes: "#changelog",
  source: "https://github.com/krizaka/krizaka-ui",
  license: "Apache-2.0",
  legal: [{ id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "#privacy", en: "#privacy" } }],
  line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
  version: true,
};
const company = { legalName: "Technologies Krizaka Inc.", neq: "1182652231", city: "Montréal", region: "Québec" };

export default function SiteFooterFamily() {
  return (
    <FamilyFooter footer={footer} current="ui" labels={familyLabels.en} kind="developer" company={company} version="2.0.0">
      <FamilyFooter.Column title="Docs">
        <FamilyFooter.Link href="#components">Components</FamilyFooter.Link>
      </FamilyFooter.Column>
    </FamilyFooter>
  );
}
