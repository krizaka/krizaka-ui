import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

const shortcuts = [
  { id: "cli", logo: "orazaka", title: "The CLI", text: "npx orazaka install, start, dev — then every command and option." },
  { id: "packs", logo: "orazaka", title: "Packs & Studios", text: "The business offers Orazaka installs without code." },
  { id: "admin", logo: "orazaka", title: "The admin console", text: "Users, models, quotas and the audit log — behind four gates." },
] as const;

// The quiet hover on a card: no glow, a 2 px lift, one step of surface and border, a ring on focus.
export default function LinkCardHoverQuiet() {
  return (
    <CardGrid className="w-full max-w-4xl" min={260} reveal={false}>
      {shortcuts.map((s) => (
        <LinkCard key={s.id} href={`#${s.id}`} icon={<ProductLogo id={s.logo} size={24} animated={false} />} title={s.title} description={s.text} cta="Open" />
      ))}
    </CardGrid>
  );
}
