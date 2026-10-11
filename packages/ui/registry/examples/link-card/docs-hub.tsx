import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

const shortcuts = [
  { id: "cli", logo: "orazaka", title: "The CLI", text: "npx orazaka install, start, dev — then every command and option." },
  { id: "packs", logo: "orazaka", title: "Packs & Studios", text: "The business offers Orazaka installs without code." },
  { id: "admin", logo: "orochia", title: "Orochia admin console", text: "Verification, moderation, payouts — behind four gates." },
] as const;

// The entry points of a documentation hub: compact cards, the whole card one link. The pointer lights the card it is on.
export default function LinkCardDocsHub() {
  return (
    <CardGrid className="w-full max-w-4xl" min={260} reveal={false}>
      {shortcuts.map((s) => (
        <LinkCard key={s.id} href={`#${s.id}`} icon={<ProductLogo id={s.logo} size={24} animated={false} />} title={s.title} description={s.text} cta="Open" />
      ))}
    </CardGrid>
  );
}
