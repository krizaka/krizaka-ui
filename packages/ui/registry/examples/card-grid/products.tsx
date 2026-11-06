import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

// `fit="fit"`: the cards of a short row share the whole width — two products, two halves. One column on a phone.
export default function CardGridProducts() {
  return (
    <CardGrid className="w-full max-w-3xl" fit="fit" reveal={false}>
      <LinkCard href="#sovkora" icon={<ProductLogo id="sovkora" size={24} animated={false} />} title="Sovkora" description="Sovereign AI on your own servers." cta="Overview" />
      <LinkCard href="#verikora" icon={<ProductLogo id="verikora" size={24} animated={false} />} title="Verikora" description="Reads your leases, contracts and invoices." cta="Overview" />
    </CardGrid>
  );
}
