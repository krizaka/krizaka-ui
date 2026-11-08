import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// The company's accounts come from the org (`org.links.social` of `@krizaka/org`, a footer never types an address):
// each known account (Instagram, YouTube) is drawn as its icon, named for screen readers.
const org = {
  brand: { name: "Krizaka" },
  footer: {
    line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
    legal: [{ id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "#privacy", en: "#privacy" } }],
  },
  links: {
    social: [
      { id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" },
      { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@krizakahq" },
    ],
  },
};

export default function SiteFooterSocials() {
  return <SiteFooter current="verikora" tone="cahier" labels={familyLabels.en} org={org} version="1.2.3" />;
}
