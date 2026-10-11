import { ProductLogo } from "@krizaka/ui";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts } from "@krizaka/ui/page";

// `layout="stack"`: the icon above the text, for a few large entry points (the products). `meta` names the category,
// `extra` carries facts — never another link: the card is one.
export default function LinkCardStack() {
  return (
    <LinkCard
      className="max-w-sm"
      layout="stack"
      href="#orazaka"
      icon={<ProductLogo id="orazaka" size={26} animated={false} />}
      meta="Product"
      title="Orazaka"
      description="The sovereign AI engine: chat, image, video and voice on your own servers."
      extra={<Facts items={[{ label: "Self-hosted", tone: "ok" }, { label: "Apache-2.0" }]} />}
      cta="Overview"
    />
  );
}
