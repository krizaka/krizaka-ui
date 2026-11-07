import { type FooterSettings, resolveFooterSettings, SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// The footer as the admin configured it: settings stored by the app (message keys, the org's socials by id),
// resolved with the app's messages, then drawn as real columns and one legal line that names the company once.
const settings: FooterSettings = {
  labelKey: "footer.label",
  columns: [
    { id: "product", titleKey: "footer.product", links: [{ labelKey: "footer.pricing", href: "#pricing" }] },
    { id: "help", titleKey: "footer.help", links: [{ labelKey: "footer.contact", href: "#contact" }] },
    { id: "krizaka", titleKey: "footer.krizaka", links: [{ label: "Krizaka", href: "https://www.krizaka.com", external: true }] },
  ],
  legal: {
    legalName: "Technologies Krizaka Inc.",
    neq: "1182652231",
    city: "Montréal (Québec)",
    showVersion: true,
    links: [{ labelKey: "footer.privacy", href: "#privacy" }],
  },
  social: ["instagram"],
};

const messages: Record<string, string> = {
  "footer.label": "Footer",
  "footer.product": "Verikora",
  "footer.pricing": "Pricing",
  "footer.help": "Help",
  "footer.contact": "Contact",
  "footer.krizaka": "By Krizaka",
  "footer.privacy": "Privacy",
};

export default function SiteFooterConfigured() {
  const socials = [{ id: "instagram", label: "Instagram", url: "https://www.instagram.com/krizakahq" }];
  const config = resolveFooterSettings(settings, (key) => messages[key] ?? key, socials);
  return <SiteFooter current="verikora" labels={familyLabels.en} version="1.2.3" config={config} />;
}
