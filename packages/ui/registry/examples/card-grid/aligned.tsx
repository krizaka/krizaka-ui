import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts } from "@krizaka/ui/page";

// A row of cards whose sentences have different lengths: the cells share one height and each card pins its facts
// and its way in to the bottom, so the status and the link of every card sit on the same line.
export default function CardGridAligned() {
  return (
    <CardGrid className="w-full max-w-4xl" min={220} columns={3} reveal={false}>
      <LinkCard layout="stack" href="#sovkora" icon={<ProductLogo id="sovkora" size={28} animated={false} />} title="Sovkora" description="Sovereign AI on your own servers: chat, image, video and voice." extra={<Facts items={[{ label: "Dev preview", tone: "ok" }]} />} cta="Open sovkora" />
      <LinkCard layout="stack" href="#verikora" icon={<ProductLogo id="verikora" size={28} animated={false} />} title="Verikora" description="Reads your leases." extra={<Facts items={[{ label: "Coming soon", tone: "wip" }]} />} cta="Open verikora" />
      <LinkCard layout="stack" href="#folioviv" icon={<ProductLogo id="folioviv" size={28} animated={false} />} title="Folioviv" description="The all-in-one for independent Québec shops: the till, the appointments, the receipts and the taxes, in one place." extra={<Facts items={[{ label: "Under construction", tone: "wip" }]} />} cta="Open folioviv" />
    </CardGrid>
  );
}
