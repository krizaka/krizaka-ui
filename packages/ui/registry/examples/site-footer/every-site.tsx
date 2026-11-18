import { FamilyFooter, type FamilyFooterData } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// Every site draws the same footer from `footerFor(id)` of `@krizaka/org`; `kind` changes row C only (a developer site
// always adds the source code, the licence, the version and the release notes).
const entry = (id: string, name: string, group: "krizaka" | "products" | "open-source", url: string) => ({ id, name, group, status: "development" as const, url });
const groups: FamilyFooterData["groups"] = [
  { group: "krizaka", entries: [entry("blog", "Blog", "krizaka", "https://blog.krizaka.com")] },
  { group: "products", entries: [entry("verikora", "Verikora", "products", "https://www.verikora.com")] },
  { group: "open-source", entries: [entry("ui", "Krizaka UI", "open-source", "https://ui.krizaka.com")] },
];
const social = ["instagram", "facebook", "youtube", "linkedin"].map((id) => ({ id, label: id, url: `https://example.com/${id}` }));
const base = {
  groups,
  social,
  legal: [{ id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "#privacy", en: "#privacy" } }],
  line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
};
const company = { legalName: "Technologies Krizaka Inc.", neq: "1182652231", city: "Montréal", region: "Québec" };
const sites = [["krizaka", false], ["verikora", false], ["ui", true], ["lab", true]] as const;
// One `contentinfo` per page, each navigation named once: here every footer sits in its own section, named after its site.
const words = familyLabels.en.footer!;
const labelsOf = (id: string) => ({ ...familyLabels.en, family: `Krizaka family (${id})`, footer: { ...words, social: `${words.social} (${id})`, project: `${words.project} (${id})`, legal: `${words.legal} (${id})` } });

export default function SiteFooterEverySite() {
  return (
    <div className="flex flex-col gap-6">
      {sites.map(([id, dev]) => (
        <section key={id}>
          <FamilyFooter labels={labelsOf(id)} kind={dev ? "developer" : "company"} company={company} current={id} version="2.0.0" footer={{ ...base, id, source: dev ? `https://github.com/krizaka/${id}` : null, license: dev ? "Apache-2.0" : null, version: dev, releaseNotes: "#changelog" }} />
        </section>
      ))}
    </div>
  );
}
