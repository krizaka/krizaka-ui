import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

// `fit="fit"`: the cards of a short row share the whole width — two products, two halves. One column on a phone.
export default function CardGridProducts() {
  return (
    <CardGrid className="w-full max-w-3xl" fit="fit" reveal={false}>
      <LinkCard href="#orazaka" icon={<ProductLogo id="orazaka" size={24} animated={false} />} title="Orazaka" description="Sovereign AI on your own servers." cta="Overview" />
      <LinkCard href="#yomizaka" icon={<ProductLogo id="yomizaka" size={24} animated={false} />} title="Yomizaka" description="Reads your leases, contracts and invoices." cta="Overview" />
    </CardGrid>
  );
}
