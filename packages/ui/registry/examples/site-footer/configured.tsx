import { type FooterSettings,resolveFooterSettings, SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// The footer as the admin configured it: the settings an app stores (message keys, the org's socials by id), resolved
// with the app's messages, then drawn as real columns and one legal line that names the company once.
const settings: FooterSettings = {
  labelKey: "footer.label",
  columns: [
    {
      id: "product",
      titleKey: "footer.product",
      links: [
        { labelKey: "footer.features", href: "#features" },
        { labelKey: "footer.pricing", href: "#pricing" },
        { labelKey: "footer.changelog", href: "#changelog" },
      ],
    },
    {
      id: "help",
      titleKey: "footer.help",
      links: [
        { labelKey: "footer.contact", href: "#contact" },
        { labelKey: "footer.security", href: "#security" },
      ],
    },
    { id: "krizaka", titleKey: "footer.krizaka", links: [{ label: "Krizaka", href: "https://www.krizaka.com", external: true }] },
  ],
  legal: {
    legalName: "Technologies Krizaka Inc.",
    neq: "1182652231",
    city: "Montréal (Québec)",
    showVersion: true,
    links: [
      { labelKey: "footer.privacy", href: "#privacy" },
      { labelKey: "footer.terms", href: "#terms" },
    ],
  },
  social: ["github"],
};

const messages: Record<string, string> = {
  "footer.label": "Footer",
  "footer.product": "Verikora",
  "footer.features": "Features",
  "footer.pricing": "Pricing",
  "footer.changelog": "Changelog",
  "footer.help": "Help",
  "footer.contact": "Contact",
  "footer.security": "Security",
  "footer.krizaka": "By Krizaka",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
};

export default function SiteFooterConfigured() {
  const config = resolveFooterSettings(settings, (key) => messages[key] ?? key, [
    { id: "github", label: "GitHub", url: "https://github.com/krizaka" },
  ]);
  return <SiteFooter current="yomizaka" labels={familyLabels.en} version="1.2.3" config={config} />;
}
