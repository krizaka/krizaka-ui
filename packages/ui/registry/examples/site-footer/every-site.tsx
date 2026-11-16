import { FamilyFooter, type FamilyFooterData } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// Every site of the family draws the same footer: `footerFor(id)` of `@krizaka/org` for its id, nothing typed per site.
// Only what the org says differs: a developer site adds the source code, the licence and the version.
const entry = (id: string, name: string, group: "krizaka" | "products" | "open-source" | "github", status: "released" | "development", url: string) => ({ id, name, group, status, url });
const groups: FamilyFooterData["groups"] = [
  { group: "krizaka", entries: [entry("blog", "Blog", "krizaka", "released", "https://blog.krizaka.com")] },
  { group: "products", entries: [entry("verikora", "Verikora", "products", "development", "https://www.verikora.com"), entry("kridoc", "Kridoc", "products", "development", "https://www.kridoc.com")] },
  { group: "open-source", entries: [entry("ui", "Krizaka UI", "open-source", "development", "https://ui.krizaka.com"), entry("lab", "Krizaka Lab", "open-source", "development", "https://lab.krizaka.com")] },
];
const base = {
  groups,
  social: [{ id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" }],
  legal: [{ id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "#privacy", en: "#privacy" } }],
  line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
};
const sites = [
  ["krizaka", false], ["blog", false], ["verikora", false], ["kridoc", false], ["ui", true], ["lab", true],
] as const;

export default function SiteFooterEverySite() {
  return (
    <div className="flex flex-col gap-6">
      {sites.map(([id, dev]) => (
        // One `contentinfo` per page: each footer sits in its own section here, and its family navigation is named after its site.
        <section key={id}>
          <FamilyFooter labels={{ ...familyLabels.en, family: `Krizaka family (${id})` }} sourceLabel="Source code" current={id} version={dev ? "2.0.0" : undefined} footer={{ ...base, id, source: dev ? `https://github.com/krizaka/${id}` : null, license: dev ? "Apache-2.0" : null, version: dev }} />
        </section>
      ))}
    </div>
  );
}
