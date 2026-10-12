import { ProductLogo } from "@krizaka/ui";
import { ChoiceGrid } from "@krizaka/ui/choice-grid";
import { StatGauge } from "@krizaka/ui/profile-card";

const LINE_UP = [
  { id: "orazaka", name: "Orazaka", title: "Sovereign AI", stat: "Data kept at home", value: 100 },
  { id: "orochia", name: "Orochia", title: "Creator video", stat: "Creator share", value: 90 },
] as const;

// The select screen of a told page: each card in its brand, a gauge, and a link to its chapter.
export default function ChoiceGridLineUp() {
  return (
    <ChoiceGrid
      variant="arcade"
      label="The products"
      tag="Team select"
      caption="One studio"
      prompt="Choose your fighter"
      items={LINE_UP.map((p, i) => ({
        id: p.id,
        brand: p.id,
        badge: `P${i + 1}`,
        visual: <ProductLogo id={p.id} size={84} animated={false} />,
        name: p.name,
        title: p.title,
        extra: <StatGauge label={p.stat} value={p.value} />,
        meta: `Stage 0${i + 1} ↓`,
        href: `#${p.id}`,
      }))}
    />
  );
}
