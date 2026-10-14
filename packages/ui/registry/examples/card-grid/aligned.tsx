import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts } from "@krizaka/ui/page";

// A row of cards whose sentences have different lengths: the cells share one height and each card pins its facts
// and its way in to the bottom, so the status and the link of every card sit on the same line.
export default function CardGridAligned() {
  return (
    <CardGrid className="w-full max-w-4xl" min={220} columns={3} reveal={false}>
      <LinkCard layout="stack" href="#orazaka" icon={<ProductLogo id="orazaka" size={28} animated={false} />} title="Orazaka" description="Sovereign AI on your own servers: chat, image, video and voice." extra={<Facts items={[{ label: "Dev preview", tone: "ok" }]} />} cta="Open orazaka" />
      <LinkCard layout="stack" href="#orochia" icon={<ProductLogo id="orochia" size={28} animated={false} />} title="Orochia" description="Creators, paid." extra={<Facts items={[{ label: "Coming soon", tone: "wip" }]} />} cta="Open orochia" />
      <LinkCard layout="stack" href="#yororis" icon={<ProductLogo id="yororis" size={28} animated={false} />} title="Yororis" description="A quiet place to keep what matters to you, built around the moments of a day and the threads between them." extra={<Facts items={[{ label: "Under construction", tone: "wip" }]} />} cta="Open yororis" />
    </CardGrid>
  );
}
